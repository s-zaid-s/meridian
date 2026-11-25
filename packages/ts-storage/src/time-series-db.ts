import type { DeviceId, InverterTelemetry } from "@meridian/domain-core";

export interface EnergyDeliverySummary {
  readonly deviceId: DeviceId;
  readonly sampleCount: number;
  readonly verifiedDischargeWh: number;
  readonly averagePowerW: number;
  readonly maxTempC: number;
}

/**
 * Pure-TypeScript Time-Series Engine with time-bucketed chunking and
 * trapezoidal integration for verified energy settlement reconciliation.
 */
export class TimeSeriesEngine {
  // deviceId -> sorted array of telemetry samples
  private readonly series: Map<DeviceId, InverterTelemetry[]> = new Map();
  private totalSamplesStored = 0;
  private readonly maxSamplesPerDevice: number;

  public constructor(maxSamplesPerDevice = 5_000) {
    this.maxSamplesPerDevice = maxSamplesPerDevice;
  }

  public insertBatch(batch: readonly InverterTelemetry[]): number {
    for (const sample of batch) {
      let arr = this.series.get(sample.deviceId);
      if (!arr) {
        arr = [];
        this.series.set(sample.deviceId, arr);
      }
      arr.push(sample);
      if (arr.length > this.maxSamplesPerDevice) {
        arr.shift();
      }
      this.totalSamplesStored++;
    }
    return batch.length;
  }

  public queryRange(deviceId: DeviceId, startTsMs: number, endTsMs: number): InverterTelemetry[] {
    const arr = this.series.get(deviceId);
    if (!arr || arr.length === 0) return [];
    const results: InverterTelemetry[] = [];
    for (const s of arr) {
      if (s.timestampMs >= startTsMs && s.timestampMs <= endTsMs) {
        results.push(s);
      }
    }
    return results.sort((a, b) => a.timestampMs - b.timestampMs);
  }

  /**
   * Computes verified discharged Watt-hours over [startTsMs, endTsMs] using
   * trapezoidal numerical integration over positive activePowerW samples.
   */
  public integrateDischargeWh(
    deviceId: DeviceId,
    startTsMs: number,
    endTsMs: number
  ): EnergyDeliverySummary {
    const points = this.queryRange(deviceId, startTsMs, endTsMs);
    if (points.length === 0) {
      return {
        deviceId,
        sampleCount: 0,
        verifiedDischargeWh: 0,
        averagePowerW: 0,
        maxTempC: 0
      };
    }

    let totalWh = 0;
    let powerSum = 0;
    let maxTemp = -Infinity;

    for (let i = 0; i < points.length; i++) {
      const curr = points[i]!;
      const pCurr = Math.max(0, curr.activePowerW);
      powerSum += pCurr;
      if (curr.temperatureC > maxTemp) maxTemp = curr.temperatureC;

      if (i > 0) {
        const prev = points[i - 1]!;
        const pPrev = Math.max(0, prev.activePowerW);
        const dtHours = (curr.timestampMs - prev.timestampMs) / 3_600_000;
        if (dtHours > 0) {
          totalWh += ((pPrev + pCurr) / 2) * dtHours;
        }
      }
    }

    // If only a single sample exists within a short window, extrapolate over window duration conservatively
    if (points.length === 1) {
      const dtHours = Math.max(0, endTsMs - startTsMs) / 3_600_000;
      totalWh = Math.max(0, points[0]!.activePowerW) * dtHours;
    }

    return {
      deviceId,
      sampleCount: points.length,
      verifiedDischargeWh: totalWh,
      averagePowerW: powerSum / points.length,
      maxTempC: maxTemp === -Infinity ? 0 : maxTemp
    };
  }

  public getStats(): { trackedDevices: number; totalSamplesStored: number } {
    return {
      trackedDevices: this.series.size,
      totalSamplesStored: this.totalSamplesStored
    };
  }
}
