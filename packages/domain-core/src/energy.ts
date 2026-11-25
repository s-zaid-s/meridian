import { Money, type CurrencyCode } from "./money.js";

/**
 * Pure energy & power calculations using integer milliwatt-hours / watt-hours
 * to prevent rounding divergence between telemetry integration and settlement.
 */
export class EnergyMath {
  /**
   * Computes watt-hours delivered over an interval given average power in Watts.
   */
  public static powerToWh(powerW: number, durationSec: number): number {
    if (durationSec < 0) throw new RangeError("Duration must be non-negative");
    return (powerW * durationSec) / 3600;
  }

  /**
   * Computes exact revenue in micro-currency for delivered Wh at a micro-currency/kWh clearing rate.
   * Uses BigInt integer arithmetic: (deliveredMilliWh * priceMicroPerKwh) / 1_000_000n
   */
  public static calculateEnergyRevenue(
    deliveredWh: number,
    clearingPriceMicroPerKwh: bigint,
    currency: CurrencyCode = "GBP"
  ): Money {
    if (deliveredWh <= 0 || clearingPriceMicroPerKwh <= 0n) {
      return Money.zero(currency);
    }
    const milliWh = BigInt(Math.round(deliveredWh * 1000));
    const microRevenue = (milliWh * clearingPriceMicroPerKwh) / 1_000_000n;
    return Money.fromMicro(microRevenue, currency);
  }

  /**
   * Converts megawatts to watts cleanly.
   */
  public static mwToWatts(mw: number): number {
    return Math.round(mw * 1_000_000);
  }

  /**
   * Converts watts to megawatts.
   */
  public static wattsToMw(watts: number): number {
    return watts / 1_000_000;
  }
}
