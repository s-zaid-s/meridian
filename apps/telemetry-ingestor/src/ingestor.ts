import type { InverterTelemetry } from "@meridian/domain-core";
import type { PartitionedEventBroker } from "@meridian/event-bus";
import type { TimeSeriesEngine } from "@meridian/ts-storage";

export interface IngestorStats {
  readonly receivedFrames: number;
  readonly rejectedFrames: number;
  readonly flushedBatches: number;
  readonly bufferedFrames: number;
}

/**
 * High-throughput telemetry ingestor with ring-buffer micro-batching,
 * payload validation, TimeSeriesEngine persistence, and Redpanda-style fan-out.
 */
export class TelemetryIngestor {
  private readonly broker: PartitionedEventBroker;
  private readonly tsdb: TimeSeriesEngine;
  private readonly maxBatchSize: number;
  private buffer: InverterTelemetry[] = [];

  private receivedFrames = 0;
  private rejectedFrames = 0;
  private flushedBatches = 0;

  public constructor(
    broker: PartitionedEventBroker,
    tsdb: TimeSeriesEngine,
    maxBatchSize = 500
  ) {
    this.broker = broker;
    this.tsdb = tsdb;
    this.maxBatchSize = maxBatchSize;
  }

  private validate(frame: InverterTelemetry): boolean {
    if (!frame.deviceId || !frame.regionId) return false;
    if (!Number.isFinite(frame.socPct) || frame.socPct < 0 || frame.socPct > 100) return false;
    if (!Number.isFinite(frame.activePowerW) || !Number.isFinite(frame.temperatureC)) return false;
    if (frame.timestampMs <= 0) return false;
    return true;
  }

  public async ingest(frames: readonly InverterTelemetry[]): Promise<void> {
    for (const frame of frames) {
      if (!this.validate(frame)) {
        this.rejectedFrames++;
        continue;
      }
      this.receivedFrames++;
      this.buffer.push(frame);
      if (this.buffer.length >= this.maxBatchSize) {
        await this.flush();
      }
    }
    if (this.buffer.length > 0) {
      await this.flush();
    }
  }

  public async flush(): Promise<number> {
    if (this.buffer.length === 0) return 0;
    const batch = this.buffer;
    this.buffer = [];

    this.tsdb.insertBatch(batch);
    for (const frame of batch) {
      await this.broker.publish("telemetry.raw", frame.regionId, frame);
    }

    this.flushedBatches++;
    return batch.length;
  }

  public getStats(): IngestorStats {
    return {
      receivedFrames: this.receivedFrames,
      rejectedFrames: this.rejectedFrames,
      flushedBatches: this.flushedBatches,
      bufferedFrames: this.buffer.length
    };
  }
}
