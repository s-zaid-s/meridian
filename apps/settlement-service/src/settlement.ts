import {
  EnergyMath,
  Money,
  type DeviceId,
  type DeviceStaticProfile,
  type DispatchWindowClosedEvent
} from "@meridian/domain-core";
import type { PartitionedEventBroker, TransactionalOutbox } from "@meridian/event-bus";
import type { TimeSeriesEngine } from "@meridian/ts-storage";
import type { DoubleEntryLedger, LedgerPostingInput } from "@meridian/ledger-engine";

export const UTILITY_CLEARING_ACCOUNT = "sys_utility_clearing_gbp";
export const PLATFORM_FEE_ACCOUNT = "sys_platform_fee_gbp";

export interface SettlementReceipt {
  readonly dispatchId: string;
  readonly journalEntryId: string;
  readonly deduplicated: boolean;
  readonly devicesPaid: number;
  readonly devicesExcludedForAnomaly: number;
  readonly totalGrossMicro: bigint;
  readonly totalPlatformFeeMicro: bigint;
  readonly totalOwnerPayoutMicro: bigint;
}

/**
 * Reconciles verified discharged energy from TimeSeriesEngine against anomaly flags,
 * computes exact BigInt payouts & platform fees, and posts atomic double-entry journals.
 */
export class MicroSettlementService {
  private readonly tsdb: TimeSeriesEngine;
  private readonly ledger: DoubleEntryLedger;
  private readonly outbox: TransactionalOutbox;
  private readonly profiles: Map<DeviceId, DeviceStaticProfile> = new Map();
  private readonly isQuarantined: (deviceId: DeviceId) => boolean;
  private readonly platformFeeBps: bigint;

  public constructor(params: {
    broker: PartitionedEventBroker;
    tsdb: TimeSeriesEngine;
    ledger: DoubleEntryLedger;
    outbox: TransactionalOutbox;
    profiles: readonly DeviceStaticProfile[];
    isQuarantined: (deviceId: DeviceId) => boolean;
    platformFeeBps?: bigint;
  }) {
    this.tsdb = params.tsdb;
    this.ledger = params.ledger;
    this.outbox = params.outbox;
    this.isQuarantined = params.isQuarantined;
    this.platformFeeBps = params.platformFeeBps ?? 1000n; // 10.00%

    // Ensure system accounts exist
    this.ledger.createAccount(UTILITY_CLEARING_ACCOUNT, "UTILITY_CLEARING", "GBP", true);
    this.ledger.createAccount(PLATFORM_FEE_ACCOUNT, "PLATFORM_FEE", "GBP", false);

    for (const p of params.profiles) {
      this.profiles.set(p.deviceId, p);
      this.ledger.createAccount(p.ownerAccountId, "ASSET_OWNER", "GBP", false);
    }

    params.broker.subscribe("dispatch.window.closed", "settlement-engine-v1", async (env) => {
      await this.settleDispatchWindow(env.payload);
    });
  }

  public async settleDispatchWindow(event: DispatchWindowClosedEvent): Promise<SettlementReceipt> {
    const postings: LedgerPostingInput[] = [];
    let totalGross = Money.zero("GBP");
    let totalFees = Money.zero("GBP");
    let totalOwnerPayouts = Money.zero("GBP");
    let devicesPaid = 0;
    let excludedAnomalies = 0;

    for (const deviceId of event.participantDeviceIds) {
      if (this.isQuarantined(deviceId)) {
        excludedAnomalies++;
        continue;
      }
      const profile = this.profiles.get(deviceId);
      if (!profile) continue;

      const summary = this.tsdb.integrateDischargeWh(deviceId, event.startTsMs, event.endTsMs);
      if (summary.verifiedDischargeWh <= 0) continue;

      const gross = EnergyMath.calculateEnergyRevenue(
        summary.verifiedDischargeWh,
        event.clearingPriceMicroPerKwh,
        "GBP"
      );
      if (gross.isZero()) continue;

      const fee = gross.multiplyBps(this.platformFeeBps);
      const netOwner = gross.subtract(fee);

      totalGross = totalGross.add(gross);
      totalFees = totalFees.add(fee);
      totalOwnerPayouts = totalOwnerPayouts.add(netOwner);
      devicesPaid++;

      postings.push({
        accountId: profile.ownerAccountId,
        debitMicro: 0n,
        creditMicro: netOwner.microUnits,
        memo: `Dispatch ${event.dispatchId} verified ${summary.verifiedDischargeWh.toFixed(2)}Wh`
      });
    }

    if (totalGross.isZero()) {
      return {
        dispatchId: event.dispatchId,
        journalEntryId: "NO_PAYOUT",
        deduplicated: false,
        devicesPaid: 0,
        devicesExcludedForAnomaly: excludedAnomalies,
        totalGrossMicro: 0n,
        totalPlatformFeeMicro: 0n,
        totalOwnerPayoutMicro: 0n
      };
    }

    if (!totalFees.isZero()) {
      postings.push({
        accountId: PLATFORM_FEE_ACCOUNT,
        debitMicro: 0n,
        creditMicro: totalFees.microUnits,
        memo: `Platform fee for dispatch ${event.dispatchId}`
      });
    }

    // Balancing debit from utility clearing account
    postings.push({
      accountId: UTILITY_CLEARING_ACCOUNT,
      debitMicro: totalGross.microUnits,
      creditMicro: 0n,
      memo: `Utility wholesale clearing settlement for ${event.dispatchId}`
    });

    const { entry, deduplicated } = this.ledger.postJournalEntry({
      idempotencyKey: `settle:${event.dispatchId}`,
      referenceId: event.dispatchId,
      currency: "GBP",
      postings
    });

    if (!deduplicated) {
      this.outbox.stage("settlement.completed", event.regionId, {
        dispatchId: event.dispatchId,
        journalEntryId: entry.entryId,
        devicesSettled: devicesPaid,
        totalPayoutMicro: totalOwnerPayouts.microUnits,
        platformFeeMicro: totalFees.microUnits,
        settledAtMs: Date.now()
      });
      await this.outbox.flushPending();
    }

    return {
      dispatchId: event.dispatchId,
      journalEntryId: entry.entryId,
      deduplicated,
      devicesPaid,
      devicesExcludedForAnomaly: excludedAnomalies,
      totalGrossMicro: totalGross.microUnits,
      totalPlatformFeeMicro: totalFees.microUnits,
      totalOwnerPayoutMicro: totalOwnerPayouts.microUnits
    };
  }
}
