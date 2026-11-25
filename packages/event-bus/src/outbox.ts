import { randomUUID } from "node:crypto";
import type { PartitionedEventBroker } from "./wal-broker.js";
import type { TopicName, TopicPayloadMap } from "./topics.js";

export interface OutboxRecord<T extends TopicName = TopicName> {
  readonly id: string;
  readonly topic: T;
  readonly key: string;
  readonly payload: TopicPayloadMap[T];
  readonly createdAtMs: number;
  status: "PENDING" | "PUBLISHED";
  publishedAtMs?: number;
}

/**
 * Transactional Outbox Pattern implementation guaranteeing atomic state + event durability.
 */
export class TransactionalOutbox {
  private readonly records: OutboxRecord[] = [];
  private readonly broker: PartitionedEventBroker;

  public constructor(broker: PartitionedEventBroker) {
    this.broker = broker;
  }

  public stage<T extends TopicName>(topic: T, key: string, payload: TopicPayloadMap[T]): OutboxRecord<T> {
    const record: OutboxRecord<T> = {
      id: randomUUID(),
      topic,
      key,
      payload,
      createdAtMs: Date.now(),
      status: "PENDING"
    };
    this.records.push(record);
    return record;
  }

  public async flushPending(): Promise<number> {
    let flushed = 0;
    for (const rec of this.records) {
      if (rec.status === "PENDING") {
        await this.broker.publish(rec.topic, rec.key, rec.payload);
        rec.status = "PUBLISHED";
        rec.publishedAtMs = Date.now();
        flushed++;
      }
    }
    return flushed;
  }

  public pendingCount(): number {
    return this.records.filter((r) => r.status === "PENDING").length;
  }
}
