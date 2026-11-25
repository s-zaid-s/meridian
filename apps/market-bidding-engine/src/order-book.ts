import { randomUUID } from "node:crypto";
import type { BidId, GridFrequencyTick, RegionId } from "@meridian/domain-core";

export interface WholesaleBidRequest {
  readonly bidId: BidId;
  readonly regionId: RegionId;
  readonly offerPowerW: number;
  readonly durationSec: number;
  readonly askPriceMicroPerKwh: bigint;
}

export interface WholesaleBidResult {
  readonly bidId: BidId;
  readonly cleared: boolean;
  readonly clearingPriceMicroPerKwh: bigint;
  readonly reason?: string;
}

/**
 * Offline wholesale energy exchange & grid frequency disturbance simulator.
 */
export class OfflineEnergyMarket {
  private readonly marketCeilingMicroPerKwh: bigint;

  public constructor(marketCeilingMicroPerKwh = 450_000n) {
    this.marketCeilingMicroPerKwh = marketCeilingMicroPerKwh; // £0.45/kWh
  }

  public createFrequencyDropEvent(
    regionId: RegionId,
    frequencyMHz = 49_720,
    wholesalePriceMicroPerKwh = 380_000n
  ): GridFrequencyTick {
    return {
      tickId: randomUUID(),
      timestampMs: Date.now(),
      frequencyMHz,
      wholesalePriceMicroPerKwh,
      regionId
    };
  }

  public submitBid(req: WholesaleBidRequest, currentMarketPriceMicro: bigint): WholesaleBidResult {
    const effectiveCeiling =
      currentMarketPriceMicro > this.marketCeilingMicroPerKwh
        ? currentMarketPriceMicro
        : this.marketCeilingMicroPerKwh;

    if (req.askPriceMicroPerKwh > effectiveCeiling) {
      return {
        bidId: req.bidId,
        cleared: false,
        clearingPriceMicroPerKwh: 0n,
        reason: "ASK_ABOVE_CLEARING_CEILING"
      };
    }

    return {
      bidId: req.bidId,
      cleared: true,
      clearingPriceMicroPerKwh: currentMarketPriceMicro
    };
  }
}
