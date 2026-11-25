import { randomUUID } from "node:crypto";
import type { DeviceId, ReservationToken } from "@meridian/domain-core";

export interface DeviceLease {
  readonly deviceId: DeviceId;
  readonly token: ReservationToken;
  readonly fencingToken: number;
  readonly acquiredAtMs: number;
  readonly expiresAtMs: number;
}

export interface CohortLockResult {
  readonly acquired: boolean;
  readonly token?: ReservationToken;
  readonly fencingToken?: number;
  readonly lockedDevices: readonly DeviceId[];
  readonly conflictedDevices: readonly DeviceId[];
}

/**
 * Atomic cohort lease manager with monotonically increasing fencing tokens.
 * Prevents split-brain double-allocation of the same battery across concurrent market bids.
 */
export class DistributedLeaseManager {
  private readonly activeLeases: Map<DeviceId, DeviceLease> = new Map();
  private readonly tokenIndex: Map<ReservationToken, Set<DeviceId>> = new Map();
  private fencingCounter = 0;

  private pruneExpired(nowMs: number): void {
    for (const [deviceId, lease] of this.activeLeases.entries()) {
      if (lease.expiresAtMs <= nowMs) {
        this.activeLeases.delete(deviceId);
        const set = this.tokenIndex.get(lease.token);
        if (set) {
          set.delete(deviceId);
          if (set.size === 0) this.tokenIndex.delete(lease.token);
        }
      }
    }
  }

  /**
   * All-or-nothing atomic reservation for a cohort of devices.
   */
  public acquireCohort(
    deviceIds: readonly DeviceId[],
    ttlMs: number,
    nowMs: number = Date.now()
  ): CohortLockResult {
    this.pruneExpired(nowMs);
    const conflicts: DeviceId[] = [];
    for (const id of deviceIds) {
      if (this.activeLeases.has(id)) {
        conflicts.push(id);
      }
    }

    if (conflicts.length > 0) {
      return {
        acquired: false,
        lockedDevices: [],
        conflictedDevices: conflicts
      };
    }

    const token: ReservationToken = `rsv_${randomUUID()}`;
    const fencingToken = ++this.fencingCounter;
    const expiresAtMs = nowMs + ttlMs;
    const memberSet = new Set<DeviceId>();

    for (const id of deviceIds) {
      this.activeLeases.set(id, {
        deviceId: id,
        token,
        fencingToken,
        acquiredAtMs: nowMs,
        expiresAtMs
      });
      memberSet.add(id);
    }
    this.tokenIndex.set(token, memberSet);

    return {
      acquired: true,
      token,
      fencingToken,
      lockedDevices: [...deviceIds],
      conflictedDevices: []
    };
  }

  public releaseCohort(token: ReservationToken): number {
    const members = this.tokenIndex.get(token);
    if (!members) return 0;
    let released = 0;
    for (const id of members) {
      const lease = this.activeLeases.get(id);
      if (lease && lease.token === token) {
        this.activeLeases.delete(id);
        released++;
      }
    }
    this.tokenIndex.delete(token);
    return released;
  }

  public validateReservation(token: ReservationToken, nowMs: number = Date.now()): boolean {
    this.pruneExpired(nowMs);
    const members = this.tokenIndex.get(token);
    return members !== undefined && members.size > 0;
  }

  public getLockedDevicesForToken(token: ReservationToken): readonly DeviceId[] {
    const members = this.tokenIndex.get(token);
    return members ? [...members] : [];
  }

  public isLocked(deviceId: DeviceId, nowMs: number = Date.now()): boolean {
    this.pruneExpired(nowMs);
    return this.activeLeases.has(deviceId);
  }
}
