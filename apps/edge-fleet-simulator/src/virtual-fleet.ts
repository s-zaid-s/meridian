import {
  type DeviceId,
  type DeviceMode,
  type DeviceStaticProfile,
  type InverterTelemetry,
  type RegionId,
  type SignedDispatchCommand,
  type CommandAck
} from "@meridian/domain-core";
import type { DispatchCommandSigner } from "@meridian/crypto-auth";

interface VirtualBatteryState {
  readonly profile: DeviceStaticProfile;
  socPct: number;
  activePowerW: number;
  temperatureC: number;
  mode: DeviceMode;
  sequenceNumber: number;
  commandExpiresAtMs: number;
  isSpoofing: boolean;
  isOffline: boolean;
}

const REGIONS: readonly RegionId[] = ["UK-NORTH", "UK-SOUTH", "UK-MIDLANDS", "SCOTLAND-EAST"];

/**
 * Deterministic in-process simulator spawning thousands of residential batteries & solar inverters.
 * Supports fault injection (spoofing telemetry & dropped nodes) and Ed25519 command verification.
 */
export class VirtualEdgeFleet {
  private readonly devices: Map<DeviceId, VirtualBatteryState> = new Map();
  private readonly signer: DispatchCommandSigner;

  public constructor(
    signer: DispatchCommandSigner,
    options: { fleetSize: number; spoofRate?: number; dropRate?: number }
  ) {
    this.signer = signer;
    const spoofRate = options.spoofRate ?? 0.02;
    const dropRate = options.dropRate ?? 0.01;

    for (let i = 0; i < options.fleetSize; i++) {
      const regionId = REGIONS[i % REGIONS.length]!;
      const sectorNum = (i % 5) + 1;
      const deviceId = `bat_${regionId.toLowerCase()}_${String(i).padStart(5, "0")}`;
      const profile: DeviceStaticProfile = {
        deviceId,
        ownerAccountId: `owner_${deviceId}`,
        regionId,
        postalSector: `${regionId}-S${sectorNum}`,
        capacityWh: 13_500, // 13.5 kWh residential battery
        maxChargeW: 5_000,
        maxDischargeW: 5_000,
        minReserveSocPct: 20,
        nominalVoltageV: 230,
        roundTripEfficiency: 0.92
      };

      const deterministicFraction = ((i * 2654435761) >>> 0) / 0xffffffff;
      const initialSoc = 45 + (i % 50); // 45% to 94%

      this.devices.set(deviceId, {
        profile,
        socPct: initialSoc,
        activePowerW: 0,
        temperatureC: 24 + (i % 8),
        mode: "IDLE",
        sequenceNumber: 0,
        commandExpiresAtMs: 0,
        isSpoofing: deterministicFraction < spoofRate,
        isOffline: deterministicFraction >= spoofRate && deterministicFraction < spoofRate + dropRate
      });
    }
  }

  public getProfiles(): DeviceStaticProfile[] {
    return [...this.devices.values()].map((d) => d.profile);
  }

  public getProfile(deviceId: DeviceId): DeviceStaticProfile | undefined {
    return this.devices.get(deviceId)?.profile;
  }

  public handleCommand(cmd: SignedDispatchCommand, nowMs: number = Date.now()): CommandAck {
    const dev = this.devices.get(cmd.deviceId);
    if (!dev || dev.isOffline) {
      return {
        commandId: cmd.commandId,
        dispatchId: cmd.dispatchId,
        deviceId: cmd.deviceId,
        accepted: false,
        reason: "DEVICE_OFFLINE",
        timestampMs: nowMs
      };
    }

    const verification = this.signer.verifyCommand(cmd, nowMs, true);
    if (!verification.valid) {
      return {
        commandId: cmd.commandId,
        dispatchId: cmd.dispatchId,
        deviceId: cmd.deviceId,
        accepted: false,
        reason: verification.reason ?? "INVALID_SIGNATURE",
        timestampMs: nowMs
      };
    }

    if (cmd.action === "DISCHARGE" && dev.socPct <= dev.profile.minReserveSocPct) {
      return {
        commandId: cmd.commandId,
        dispatchId: cmd.dispatchId,
        deviceId: cmd.deviceId,
        accepted: false,
        reason: "BELOW_MIN_RESERVE_SOC",
        timestampMs: nowMs
      };
    }

    dev.mode = cmd.action === "DISCHARGE" ? "DISCHARGING" : cmd.action === "CHARGE" ? "CHARGING" : "IDLE";
    dev.activePowerW =
      cmd.action === "DISCHARGE"
        ? Math.min(cmd.targetPowerW, dev.profile.maxDischargeW)
        : cmd.action === "CHARGE"
          ? -Math.min(cmd.targetPowerW, dev.profile.maxChargeW)
          : 0;
    dev.commandExpiresAtMs = nowMs + cmd.durationSec * 1000;

    return {
      commandId: cmd.commandId,
      dispatchId: cmd.dispatchId,
      deviceId: cmd.deviceId,
      accepted: true,
      timestampMs: nowMs
    };
  }

  /**
   * Advances battery physics by stepSec seconds and emits telemetry frames.
   */
  public tick(stepSec: number, nowMs: number = Date.now()): InverterTelemetry[] {
    const frames: InverterTelemetry[] = [];

    for (const dev of this.devices.values()) {
      if (dev.isOffline) continue;

      if (dev.commandExpiresAtMs > 0 && nowMs >= dev.commandExpiresAtMs) {
        dev.mode = "IDLE";
        dev.activePowerW = 0;
        dev.commandExpiresAtMs = 0;
      }

      // Integrate SoC change
      const deltaWh = (dev.activePowerW * stepSec) / 3600;
      const deltaSocPct = (deltaWh / dev.profile.capacityWh) * 100;
      dev.socPct = Math.max(0, Math.min(100, dev.socPct - deltaSocPct));

      if (dev.mode === "DISCHARGING" && dev.socPct <= dev.profile.minReserveSocPct) {
        dev.mode = "IDLE";
        dev.activePowerW = 0;
      }

      // Thermal drift
      if (dev.activePowerW > 0) {
        dev.temperatureC = Math.min(52, dev.temperatureC + 0.05 * stepSec);
      } else {
        dev.temperatureC = Math.max(22, dev.temperatureC - 0.02 * stepSec);
      }

      dev.sequenceNumber++;

      // Adversarial spoofing: claim 3x max rated discharge to game settlement payouts
      const reportedPowerW = dev.isSpoofing ? dev.profile.maxDischargeW * 2.5 : dev.activePowerW;

      frames.push({
        deviceId: dev.profile.deviceId,
        regionId: dev.profile.regionId,
        postalSector: dev.profile.postalSector,
        timestampMs: nowMs,
        socPct: Number(dev.socPct.toFixed(2)),
        activePowerW: Math.round(reportedPowerW),
        solarGenerationW: 1200,
        voltageV: dev.profile.nominalVoltageV,
        temperatureC: Number(dev.temperatureC.toFixed(1)),
        mode: dev.mode,
        sequenceNumber: dev.sequenceNumber
      });
    }

    return frames;
  }
}
