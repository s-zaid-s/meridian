import { randomUUID } from "node:crypto";
import type {
  BidId,
  DispatchId,
  GridFrequencyTick,
  RegionId,
  ReservationToken
} from "@meridian/domain-core";
import type { PartitionedEventBroker, TransactionalOutbox } from "@meridian/event-bus";
import type { GridOrchestrator } from "@meridian/grid-orchestrator";
import type { OfflineEnergyMarket } from "./order-book.js";

export type SagaState =
  | "INITIATED"
  | "CAPACITY_LOCKED"
  | "BID_SUBMITTED"
  | "DISPATCHING"
  | "COMPLETED"
  | "COMPENSATED";

export interface BiddingSagaRecord {
  readonly sagaId: string;
  readonly bidId: BidId;
  readonly dispatchId: DispatchId;
  readonly regionId: RegionId;
  readonly targetPowerW: number;
  readonly durationSec: number;
  state: SagaState;
  reservationToken?: ReservationToken;
  fencingToken?: number;
  clearingPriceMicroPerKwh?: bigint;
  failureReason?: string;
  readonly createdAtMs: number;
  updatedAtMs: number;
}

/**
 * Durable Saga Orchestrator coordinating Capacity Lock -> Market Bid -> Outbox Dispatch,
 * with automatic compensating capacity release on bid rejection.
 */
export class BiddingSagaCoordinator {
  private readonly orchestrator: GridOrchestrator;
  private readonly market: OfflineEnergyMarket;
  private readonly outbox: TransactionalOutbox;
  private readonly sagas: Map<string, BiddingSagaRecord> = new Map();

  private readonly frequencyTriggerMHz = 49_850; // Trigger VPP response below 49.850 Hz
  private readonly minProfitablePriceMicro = 150_000n; // £0.15/kWh

  public constructor(params: {
    broker: PartitionedEventBroker;
    orchestrator: GridOrchestrator;
    market: OfflineEnergyMarket;
    outbox: TransactionalOutbox;
  }) {
    this.orchestrator = params.orchestrator;
    this.market = params.market;
    this.outbox = params.outbox;

    params.broker.subscribe("grid.frequency", "market-bidding-saga-v1", async (env) => {
      await this.onGridFrequencyTick(env.payload);
    });
  }

  public async onGridFrequencyTick(tick: GridFrequencyTick): Promise<BiddingSagaRecord | null> {
    const needsFrequencyResponse = tick.frequencyMHz < this.frequencyTriggerMHz;
    const isPriceSpike = tick.wholesalePriceMicroPerKwh >= this.minProfitablePriceMicro;
    if (!needsFrequencyResponse && !isPriceSpike) {
      return null;
    }

    const snapshot = this.orchestrator.getRegionCapacity(tick.regionId, 900);
    // Bid up to 60% of available regional capacity
    const targetPowerW = Math.floor(snapshot.totalAvailablePowerW * 0.6);
    if (targetPowerW < 10_000) {
      return null;
    }

    return this.executeBiddingSaga(tick.regionId, targetPowerW, 900, tick.wholesalePriceMicroPerKwh);
  }

  public async executeBiddingSaga(
    regionId: RegionId,
    targetPowerW: number,
    durationSec: number,
    marketPriceMicroPerKwh: bigint
  ): Promise<BiddingSagaRecord> {
    const nowMs = Date.now();
    const record: BiddingSagaRecord = {
      sagaId: `saga_${randomUUID()}`,
      bidId: `bid_${randomUUID()}`,
      dispatchId: `dsp_${randomUUID()}`,
      regionId,
      targetPowerW,
      durationSec,
      state: "INITIATED",
      createdAtMs: nowMs,
      updatedAtMs: nowMs
    };
    this.sagas.set(record.sagaId, record);

    // Step 1: Acquire distributed capacity lock
    const reservation = this.orchestrator.reserveCapacity(regionId, targetPowerW, durationSec);
    if (!reservation.reserved || !reservation.token || reservation.fencingToken === undefined) {
      record.state = "COMPENSATED";
      record.failureReason = reservation.reason ?? "RESERVATION_FAILED";
      record.updatedAtMs = Date.now();
      return record;
    }

    record.state = "CAPACITY_LOCKED";
    record.reservationToken = reservation.token;
    record.fencingToken = reservation.fencingToken;
    record.updatedAtMs = Date.now();

    // Step 2: Submit wholesale bid
    record.state = "BID_SUBMITTED";
    const bidResult = this.market.submitBid(
      {
        bidId: record.bidId,
        regionId,
        offerPowerW: targetPowerW,
        durationSec,
        askPriceMicroPerKwh: 120_000n // £0.12/kWh floor ask
      },
      marketPriceMicroPerKwh
    );

    // Compensating transaction if rejected
    if (!bidResult.cleared) {
      this.orchestrator.releaseCapacity(reservation.token);
      record.state = "COMPENSATED";
      record.failureReason = bidResult.reason ?? "BID_REJECTED";
      record.updatedAtMs = Date.now();
      return record;
    }

    // Step 3: Stage dispatch command event in Transactional Outbox & flush
    record.state = "DISPATCHING";
    record.clearingPriceMicroPerKwh = bidResult.clearingPriceMicroPerKwh;
    record.updatedAtMs = Date.now();

    this.outbox.stage("market.bid.cleared", regionId, {
      bidId: record.bidId,
      dispatchId: record.dispatchId,
      regionId,
      reservationToken: reservation.token,
      fencingToken: reservation.fencingToken,
      targetPowerW,
      durationSec,
      clearingPriceMicroPerKwh: bidResult.clearingPriceMicroPerKwh,
      clearedAtMs: Date.now()
    });

    await this.outbox.flushPending();
    return record;
  }

  public getSagas(): readonly BiddingSagaRecord[] {
    return [...this.sagas.values()];
  }
}
