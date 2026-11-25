import { randomUUID } from "node:crypto";
import {
  BatteryPhysicsModel,
  type CommandAck,
  type DeviceId,
  type DeviceStaticProfile,
  type DispatchId,
  type InverterTelemetry,
  type RegionId,
  type ReservationToken,
  type SignedDispatchCommand
} from "@meridian/domain-core";
import type { DispatchCommandSigner } from "@meridian/crypto-auth";
import type { MarketBidClearedEvent, PartitionedEventBroker } from "@meridian/event-bus";
import type { DistributedLeaseManager } from "@meridian/distributed-lock";

export interface RegionCapacitySnapshot {
  readonly regionId: RegionId;
  readonly onlineDevices: number;
  readonly availableDevices: number;
  readonly quarantinedDevices: number;
  readonly totalAvailablePowerW: number;
  readonly averageSocPct: number;
}

export interface CapacityReservationResponse {
  readonly reserved: boolean;
  readonly token?: ReservationToken;
  readonly fencingToken?: number;
  readonly reservedPowerW: number;
  readonly cohortDeviceIds: readonly DeviceId[];
  readonly reason?: string;
}

/**
 * Core VPP Brain: maintains region-sharded capacity maps, acquires atomic cohort leases,
 * signs Ed25519 commands, and fans out sub-second dispatch instructions.
 */
export class GridOrchestrator {
  private readonly broker: PartitionedEventBroker;
  private readonly leaseManager: DistributedLeaseManager;
  private readonly signer: DispatchCommandSigner;
  private readonly commandSink: (cmd: SignedDispatchCommand) => CommandAck;

  private readonly profiles: Map<DeviceId, DeviceStaticProfile> = new Map();
  private readonly latestTelemetry: Map<DeviceId, InverterTelemetry> = new Map();
  private readonly quarantined: Set<DeviceId> = new Set();
  private readonly dispatchParticipants: Map<DispatchId, readonly DeviceId[]> = new Map();

  public constructor(params: {
    broker: PartitionedEventBroker;
    leaseManager: DistributedLeaseManager;
    signer: DispatchCommandSigner;
    profiles: readonly DeviceStaticProfile[];
    commandSink: (cmd: SignedDispatchCommand) => CommandAck;
  }) {
    this.broker = params.broker;
    this.leaseManager = params.leaseManager;
    this.signer = params.signer;
    this.commandSink = params.commandSink;

    for (const p of params.profiles) {
      this.profiles.set(p.deviceId, p);
    }

    this.broker.subscribe("telemetry.raw", "grid-orchestrator-v1", (env) => {
      this.latestTelemetry.set(env.payload.deviceId, env.payload);
    });

    this.broker.subscribe("telemetry.anomalies", "grid-orchestrator-v1", (env) => {
      if (env.payload.quarantineApplied) {
        this.quarantined.add(env.payload.deviceId);
      }
    });

    this.broker.subscribe("market.bid.cleared", "grid-orchestrator-v1", async (env) => {
      await this.executeClearedDispatch(env.payload);
    });
  }

  public getRegionCapacity(regionId: RegionId, windowDurationSec = 900): RegionCapacitySnapshot {
    let online = 0;
    let available = 0;
    let quarantinedCount = 0;
    let totalPowerW = 0;
    let socSum = 0;

    for (const [deviceId, frame] of this.latestTelemetry.entries()) {
      if (frame.regionId !== regionId) continue;
      online++;
      if (this.quarantined.has(deviceId)) {
        quarantinedCount++;
        continue;
      }
      if (this.leaseManager.isLocked(deviceId)) continue;

      const profile = this.profiles.get(deviceId);
      if (!profile) continue;
      const headroom = BatteryPhysicsModel.computeDischargeHeadroom(
        profile,
        frame.socPct,
        frame.temperatureC,
        windowDurationSec
      );
      if (headroom.sustainablePowerW > 0) {
        available++;
        totalPowerW += headroom.sustainablePowerW;
        socSum += frame.socPct;
      }
    }

    return {
      regionId,
      onlineDevices: online,
      availableDevices: available,
      quarantinedDevices: quarantinedCount,
      totalAvailablePowerW: totalPowerW,
      averageSocPct: available > 0 ? Number((socSum / available).toFixed(2)) : 0
    };
  }

  public reserveCapacity(
    regionId: RegionId,
    targetPowerW: number,
    durationSec: number
  ): CapacityReservationResponse {
    const candidates: { deviceId: DeviceId; socPct: number; powerW: number }[] = [];

    for (const [deviceId, frame] of this.latestTelemetry.entries()) {
      if (frame.regionId !== regionId) continue;
      if (this.quarantined.has(deviceId) || this.leaseManager.isLocked(deviceId)) continue;
      const profile = this.profiles.get(deviceId);
      if (!profile) continue;

      const headroom = BatteryPhysicsModel.computeDischargeHeadroom(
        profile,
        frame.socPct,
        frame.temperatureC,
        durationSec
      );
      if (headroom.sustainablePowerW > 0) {
        candidates.push({
          deviceId,
          socPct: frame.socPct,
          powerW: headroom.sustainablePowerW
        });
      }
    }

    // Prioritize highest SoC batteries first to balance fleet wear
    candidates.sort((a, b) => b.socPct - a.socPct);

    const selected: DeviceId[] = [];
    let accumulatedW = 0;
    for (const c of candidates) {
      if (accumulatedW >= targetPowerW) break;
      selected.push(c.deviceId);
      accumulatedW += c.powerW;
    }

    if (accumulatedW < targetPowerW) {
      return {
        reserved: false,
        reservedPowerW: accumulatedW,
        cohortDeviceIds: [],
        reason: `INSUFFICIENT_CAPACITY: requested=${targetPowerW}W available=${accumulatedW}W`
      };
    }

    const lease = this.leaseManager.acquireCohort(selected, (durationSec + 60) * 1000);
    if (!lease.acquired || !lease.token || lease.fencingToken === undefined) {
      return {
        reserved: false,
        reservedPowerW: 0,
        cohortDeviceIds: [],
        reason: "CONCURRENT_LOCK_CONFLICT"
      };
    }

    return {
      reserved: true,
      token: lease.token,
      fencingToken: lease.fencingToken,
      reservedPowerW: accumulatedW,
      cohortDeviceIds: selected
    };
  }

  public releaseCapacity(token: ReservationToken): number {
    return this.leaseManager.releaseCohort(token);
  }

  private async executeClearedDispatch(event: MarketBidClearedEvent): Promise<void> {
    if (!this.leaseManager.validateReservation(event.reservationToken)) {
      return;
    }

    const devices = this.leaseManager.getLockedDevicesForToken(event.reservationToken);
    if (devices.length === 0) return;

    const perDevicePowerW = Math.ceil(event.targetPowerW / devices.length);
    const nowMs = Date.now();
    const acceptedDevices: DeviceId[] = [];

    for (const deviceId of devices) {
      const cmd = this.signer.signCommand({
        commandId: randomUUID(),
        dispatchId: event.dispatchId,
        deviceId,
        regionId: event.regionId,
        action: "DISCHARGE",
        targetPowerW: perDevicePowerW,
        durationSec: event.durationSec,
        issuedAtMs: nowMs,
        expiresAtMs: nowMs + event.durationSec * 1000,
        fencingToken: event.fencingToken
      });

      await this.broker.publish("dispatch.commands", event.regionId, cmd);
      const ack = this.commandSink(cmd);
      await this.broker.publish("dispatch.acks", event.regionId, ack);
      if (ack.accepted) {
        acceptedDevices.push(deviceId);
      }
    }

    this.dispatchParticipants.set(event.dispatchId, acceptedDevices);
  }

  public getDispatchParticipants(dispatchId: DispatchId): readonly DeviceId[] {
    return this.dispatchParticipants.get(dispatchId) ?? [];
  }
}
