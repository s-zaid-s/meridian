export type RegionId = "UK-NORTH" | "UK-SOUTH" | "UK-MIDLANDS" | "SCOTLAND-EAST";
export type DeviceId = string;
export type AccountId = string;
export type DispatchId = string;
export type BidId = string;
export type ReservationToken = string;

export type DeviceMode = "IDLE" | "CHARGING" | "DISCHARGING" | "FAULT" | "QUARANTINED";

export interface DeviceStaticProfile {
  readonly deviceId: DeviceId;
  readonly ownerAccountId: AccountId;
  readonly regionId: RegionId;
  readonly postalSector: string;
  readonly capacityWh: number;
  readonly maxChargeW: number;
  readonly maxDischargeW: number;
  readonly minReserveSocPct: number;
  readonly nominalVoltageV: number;
  readonly roundTripEfficiency: number;
}

export interface InverterTelemetry {
  readonly deviceId: DeviceId;
  readonly regionId: RegionId;
  readonly postalSector: string;
  readonly timestampMs: number;
  readonly socPct: number;
  readonly activePowerW: number; // Positive = discharging to grid, Negative = charging
  readonly solarGenerationW: number;
  readonly voltageV: number;
  readonly temperatureC: number;
  readonly mode: DeviceMode;
  readonly sequenceNumber: number;
}

export interface SignedDispatchCommand {
  readonly commandId: string;
  readonly dispatchId: DispatchId;
  readonly deviceId: DeviceId;
  readonly regionId: RegionId;
  readonly action: "DISCHARGE" | "CHARGE" | "IDLE";
  readonly targetPowerW: number;
  readonly durationSec: number;
  readonly issuedAtMs: number;
  readonly expiresAtMs: number;
  readonly fencingToken: number;
  readonly nonce: string;
  readonly signatureHex: string;
}

export interface CommandAck {
  readonly commandId: string;
  readonly dispatchId: DispatchId;
  readonly deviceId: DeviceId;
  readonly accepted: boolean;
  readonly reason?: string;
  readonly timestampMs: number;
}

export interface GridFrequencyTick {
  readonly tickId: string;
  readonly timestampMs: number;
  readonly frequencyMHz: number; // e.g., 50000 = 50.000 Hz
  readonly wholesalePriceMicroPerKwh: bigint; // micro-GBP per kWh
  readonly regionId: RegionId;
}

export interface AnomalyAlert {
  readonly alertId: string;
  readonly deviceId: DeviceId;
  readonly regionId: RegionId;
  readonly timestampMs: number;
  readonly ruleTriggered: "SOC_TELEPORT" | "OVER_RATED_POWER" | "IRRADIANCE_MISMATCH" | "NEIGHBOR_DIVERGENCE";
  readonly severity: "WARN" | "CRITICAL";
  readonly details: string;
  readonly quarantineApplied: boolean;
}

export interface DispatchWindowClosedEvent {
  readonly dispatchId: DispatchId;
  readonly bidId: BidId;
  readonly regionId: RegionId;
  readonly clearingPriceMicroPerKwh: bigint;
  readonly promisedEnergyWh: number;
  readonly startTsMs: number;
  readonly endTsMs: number;
  readonly participantDeviceIds: readonly DeviceId[];
}
