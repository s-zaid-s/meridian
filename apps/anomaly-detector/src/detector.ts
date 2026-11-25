import { randomUUID } from "node:crypto";
import type {
  AnomalyAlert,
  DeviceId,
  DeviceStaticProfile,
  InverterTelemetry
} from "@meridian/domain-core";
import type { PartitionedEventBroker } from "@meridian/event-bus";

/**
 * Real-time stream processor detecting spoofed inverter telemetry,
 * impossible SoC jumps, and hardware limit violations.
 */
export class StreamAnomalyDetector {
  private readonly broker: PartitionedEventBroker;
  private readonly profiles: Map<DeviceId, DeviceStaticProfile> = new Map();
  private readonly lastTelemetry: Map<DeviceId, InverterTelemetry> = new Map();
  private readonly quarantined: Set<DeviceId> = new Set();
  private readonly alerts: AnomalyAlert[] = [];

  public constructor(broker: PartitionedEventBroker, profiles: readonly DeviceStaticProfile[]) {
    this.broker = broker;
    for (const p of profiles) {
      this.profiles.set(p.deviceId, p);
    }

    this.broker.subscribe("telemetry.raw", "anomaly-detector-v1", async (env) => {
      await this.evaluate(env.payload);
    });
  }

  public async evaluate(frame: InverterTelemetry): Promise<AnomalyAlert | null> {
    const profile = this.profiles.get(frame.deviceId);
    if (!profile) return null;

    let triggeredRule: AnomalyAlert["ruleTriggered"] | null = null;
    let details = "";

    // Rule 1: Physical inverter rating bound check (allows 5% measurement tolerance)
    if (Math.abs(frame.activePowerW) > profile.maxDischargeW * 1.05) {
      triggeredRule = "OVER_RATED_POWER";
      details = `Reported ${frame.activePowerW}W exceeds inverter max ${profile.maxDischargeW}W`;
    }

    // Rule 2: Impossible SoC jump rate between consecutive samples
    const prev = this.lastTelemetry.get(frame.deviceId);
    if (!triggeredRule && prev) {
      const dtSec = Math.max(1, (frame.timestampMs - prev.timestampMs) / 1000);
      const maxPossibleDeltaSoc = ((profile.maxDischargeW * (dtSec / 3600)) / profile.capacityWh) * 100 + 2.0;
      const actualDelta = Math.abs(frame.socPct - prev.socPct);
      if (actualDelta > maxPossibleDeltaSoc) {
        triggeredRule = "SOC_TELEPORT";
        details = `SoC jumped ${actualDelta.toFixed(2)}% in ${dtSec.toFixed(1)}s (max physical ${maxPossibleDeltaSoc.toFixed(2)}%)`;
      }
    }

    this.lastTelemetry.set(frame.deviceId, frame);

    if (triggeredRule) {
      this.quarantined.add(frame.deviceId);
      const alert: AnomalyAlert = {
        alertId: randomUUID(),
        deviceId: frame.deviceId,
        regionId: frame.regionId,
        timestampMs: frame.timestampMs,
        ruleTriggered: triggeredRule,
        severity: "CRITICAL",
        details,
        quarantineApplied: true
      };
      this.alerts.push(alert);
      await this.broker.publish("telemetry.anomalies", frame.regionId, alert);
      return alert;
    }

    return null;
  }

  public isQuarantined(deviceId: DeviceId): boolean {
    return this.quarantined.has(deviceId);
  }

  public getQuarantinedDevices(): readonly DeviceId[] {
    return [...this.quarantined];
  }

  public getAlerts(): readonly AnomalyAlert[] {
    return this.alerts;
  }
}
