import { randomUUID } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { EventEnvelope, TopicName, TopicPayloadMap, DeadLetterRecord } from "./topics.js";

export type EventHandler<T extends TopicName> = (event: EventEnvelope<T>) => Promise<void> | void;

interface ConsumerRegistration<T extends TopicName = TopicName> {
  readonly groupId: string;
  readonly topic: T;
  readonly handler: EventHandler<T>;
  readonly maxRetries: number;
}

export interface BrokerMetrics {
  readonly publishedCount: number;
  readonly deliveredCount: number;
  readonly dlqCount: number;
  readonly topicOffsets: Record<string, number>;
}

/**
 * Pure-TypeScript partitioned event broker inspired by Kafka/Redpanda.
 * Supports deterministic key hashing, consumer groups, offset tracking,
 * retry backoff, Dead Letter Queue (DLQ) routing, and optional NDJSON WAL disk persistence.
 */
export class PartitionedEventBroker {
  private readonly partitionCount: number;
  private readonly logs: Map<TopicName, EventEnvelope[][]> = new Map();
  private readonly consumers: Map<TopicName, ConsumerRegistration[]> = new Map();
  private readonly committedOffsets: Map<string, number> = new Map();
  private readonly dlq: DeadLetterRecord[] = [];
  private readonly walFilePath?: string;

  private publishedCount = 0;
  private deliveredCount = 0;

  public constructor(options?: { partitionCount?: number; walFilePath?: string }) {
    this.partitionCount = options?.partitionCount ?? 4;
    if (options?.walFilePath) {
      this.walFilePath = options.walFilePath;
      mkdirSync(dirname(options.walFilePath), { recursive: true });
    }
  }

  private hashPartition(key: string): number {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash) % this.partitionCount;
  }

  private ensureTopic(topic: TopicName): EventEnvelope[][] {
    let partitions = this.logs.get(topic);
    if (!partitions) {
      partitions = Array.from({ length: this.partitionCount }, () => []);
      this.logs.set(topic, partitions);
    }
    return partitions;
  }

  public subscribe<T extends TopicName>(
    topic: T,
    groupId: string,
    handler: EventHandler<T>,
    maxRetries = 3
  ): void {
    const list = this.consumers.get(topic) ?? [];
    list.push({
      groupId,
      topic,
      handler: handler as EventHandler<TopicName>,
      maxRetries
    });
    this.consumers.set(topic, list);
  }

  public async publish<T extends TopicName>(
    topic: T,
    key: string,
    payload: TopicPayloadMap[T],
    traceId?: string
  ): Promise<EventEnvelope<T>> {
    const partitions = this.ensureTopic(topic);
    const partition = this.hashPartition(key);
    const partLog = partitions[partition]!;
    const offset = partLog.length;

    const envelope: EventEnvelope<T> = {
      eventId: randomUUID(),
      topic,
      partition,
      offset,
      key,
      timestampMs: Date.now(),
      traceId: traceId ?? randomUUID(),
      payload
    };

    partLog.push(envelope);
    this.publishedCount++;

    if (this.walFilePath) {
      const line = JSON.stringify(envelope, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
      appendFileSync(this.walFilePath, line + "\n", "utf8");
    }

    await this.dispatchToConsumers(topic, envelope);
    return envelope;
  }

  private async dispatchToConsumers<T extends TopicName>(
    topic: T,
    envelope: EventEnvelope<T>
  ): Promise<void> {
    const registrations = this.consumers.get(topic);
    if (!registrations || registrations.length === 0) return;

    for (const reg of registrations) {
      const offsetKey = `${reg.groupId}:${topic}:${envelope.partition}`;
      let attempt = 0;
      let succeeded = false;
      let lastError = "";

      while (attempt < reg.maxRetries && !succeeded) {
        attempt++;
        try {
          await reg.handler(envelope);
          this.committedOffsets.set(offsetKey, envelope.offset);
          this.deliveredCount++;
          succeeded = true;
        } catch (err) {
          lastError = err instanceof Error ? err.message : String(err);
        }
      }

      if (!succeeded) {
        this.dlq.push({
          originalTopic: topic,
          originalEvent: envelope,
          consumerGroup: reg.groupId,
          errorMessage: lastError,
          attempts: attempt,
          failedAtMs: Date.now()
        });
      }
    }
  }

  public getDeadLetters(): readonly DeadLetterRecord[] {
    return this.dlq;
  }

  public getMetrics(): BrokerMetrics {
    const topicOffsets: Record<string, number> = {};
    for (const [topic, partitions] of this.logs.entries()) {
      topicOffsets[topic] = partitions.reduce((acc, p) => acc + p.length, 0);
    }
    return {
      publishedCount: this.publishedCount,
      deliveredCount: this.deliveredCount,
      dlqCount: this.dlq.length,
      topicOffsets
    };
  }
}
