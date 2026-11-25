import type { DeviceStaticProfile } from "./types.js";
import { Money, type CurrencyCode } from "./money.js";

export interface BatteryHeadroom {
  readonly availableEnergyWh: number;
  readonly sustainablePowerW: number;
  readonly thermalDeratingFactor: number;
}

/**
 * Deterministic residential/commercial lithium-ion battery physics & guardrails.
 */
export class BatteryPhysicsModel {
  /**
   * Computes thermal derating factor [0.0 .. 1.0].
   * Above 45C, inverter power is linearly derated to protect cell health; above 60C, hard cutoff.
   */
  public static thermalDeratingFactor(temperatureC: number): number {
    if (temperatureC >= 60) return 0;
    if (temperatureC <= 45) return 1;
    return Math.max(0, 1 - (temperatureC - 45) / 15);
  }

  /**
   * Calculates safe dispatchable headroom without violating the owner's reserve floor.
   */
  public static computeDischargeHeadroom(
    profile: DeviceStaticProfile,
    currentSocPct: number,
    temperatureC: number,
    windowDurationSec: number
  ): BatteryHeadroom {
    const derating = this.thermalDeratingFactor(temperatureC);
    const usableSocPct = Math.max(0, currentSocPct - profile.minReserveSocPct);
    const availableEnergyWh = (usableSocPct / 100) * profile.capacityWh * profile.roundTripEfficiency;

    if (availableEnergyWh <= 0 || windowDurationSec <= 0 || derating === 0) {
      return { availableEnergyWh: 0, sustainablePowerW: 0, thermalDeratingFactor: derating };
    }

    const energyLimitedPowerW = (availableEnergyWh * 3600) / windowDurationSec;
    const inverterLimitedPowerW = profile.maxDischargeW * derating;
    const sustainablePowerW = Math.floor(Math.min(energyLimitedPowerW, inverterLimitedPowerW));

    return {
      availableEnergyWh,
      sustainablePowerW,
      thermalDeratingFactor: derating
    };
  }

  /**
   * Computes deterministic cycle degradation cost in micro-currency for a given discharge.
   * Deeper C-rates incur a non-linear wear multiplier.
   */
  public static computeDegradationCost(
    profile: DeviceStaticProfile,
    dischargedWh: number,
    avgPowerW: number,
    baseCostMicroPerKwh: bigint = 35_000n, // £0.035/kWh baseline cell wear
    currency: CurrencyCode = "GBP"
  ): Money {
    if (dischargedWh <= 0) return Money.zero(currency);
    const cRate = profile.capacityWh > 0 ? avgPowerW / profile.capacityWh : 0;
    // C-rate multiplier in basis points: 10000 bps at <=0.5C, scaling up linearly
    const wearMultiplierBps = cRate <= 0.5 ? 10_000n : BigInt(Math.round(10_000 * (1 + (cRate - 0.5) * 0.6)));
    const milliWh = BigInt(Math.round(dischargedWh * 1000));
    const baseMicro = (milliWh * baseCostMicroPerKwh) / 1_000_000n;
    return Money.fromMicro(baseMicro, currency).multiplyBps(wearMultiplierBps);
  }
}
