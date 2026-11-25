import type {
  InverterTelemetry,
  AnomalyAlert,
  GridFrequencyTick,
  SignedDispatchCommand,
  CommandAck,
  DispatchWindowClosedEvent,
  BidId,
  DispatchId,
  RegionId,
  ReservationToken
} from "@meridian/domain-core";

export interface MarketBidClearedEvent {
  readonly bidId: BidId;
  readonly dispatchId: DispatchId;
  readonly regionId: RegionId;
  readonly reservationToken: ReservationToken;
  readonly fencingToken: number;
  readonly targetPowerW: number;
  readonly durationSec: number;
  readonly clearingPriceMicroPerKwh: bigint;
  readonly clearedAtMs: number;
}

export interface SettlementCompletedEvent {
  readonly dispatchId: DispatchId;
  readonly journalEntryId: string;
  readonly devicesSettled: number;
  readonly totalPayoutMicro: bigint;
  readonly platformFeeMicro: bigint;
  readonly settledAtMs: number;
}

export interface TopicPayloadMap {
  "telemetry.raw": InverterTelemetry;
  "telemetry.anomalies": AnomalyAlert;
  "grid.frequency": GridFrequencyTick;
  "market.bid.cleared": MarketBidClearedEvent;
  "dispatch.commands": SignedDispatchCommand;
  "dispatch.acks": CommandAck;
  "dispatch.window.closed": DispatchWindowClosedEvent;
  "settlement.completed": SettlementCompletedEvent;
}

export type TopicName = keyof TopicPayloadMap;

export interface EventEnvelope<T extends TopicName = TopicName> {
  readonly eventId: string;
  readonly topic: T;
  readonly partition: number;
  readonly offset: number;
  readonly key: string;
  readonly timestampMs: number;
  readonly traceId: string;
  readonly payload: TopicPayloadMap[T];
}

export interface DeadLetterRecord {
  readonly originalTopic: TopicName;
  readonly originalEvent: EventEnvelope;
  readonly consumerGroup: string;
  readonly errorMessage: string;
  readonly attempts: number;
  readonly failedAtMs: number;
}
