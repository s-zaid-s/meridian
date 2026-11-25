import { randomUUID } from "node:crypto";
import { Money, type AccountId, type CurrencyCode } from "@meridian/domain-core";

export type AccountType = "ASSET_OWNER" | "UTILITY_CLEARING" | "PLATFORM_FEE" | "PENALTY_POOL";

export interface LedgerAccount {
  readonly accountId: AccountId;
  readonly type: AccountType;
  readonly currency: CurrencyCode;
  readonly allowNegativeBalance: boolean;
  readonly createdAtMs: number;
}

export interface LedgerPostingInput {
  readonly accountId: AccountId;
  readonly debitMicro: bigint;
  readonly creditMicro: bigint;
  readonly memo?: string;
}

export interface JournalEntry {
  readonly entryId: string;
  readonly idempotencyKey: string;
  readonly referenceId: string;
  readonly currency: CurrencyCode;
  readonly timestampMs: number;
  readonly postings: readonly LedgerPostingInput[];
}

/**
 * Immutable, ACID-invariant Double-Entry Accounting Ledger Engine.
 * Enforces:
 *  1. SUM(debits) === SUM(credits) for every journal entry
 *  2. Strict idempotency keys (replays return existing entry without mutation)
 *  3. Account-level negative balance guardrails
 */
export class DoubleEntryLedger {
  private readonly accounts: Map<AccountId, LedgerAccount> = new Map();
  private readonly balancesMicro: Map<AccountId, bigint> = new Map();
  private readonly entries: JournalEntry[] = [];
  private readonly idempotencyIndex: Map<string, JournalEntry> = new Map();

  public createAccount(
    accountId: AccountId,
    type: AccountType,
    currency: CurrencyCode = "GBP",
    allowNegativeBalance = false
  ): LedgerAccount {
    const existing = this.accounts.get(accountId);
    if (existing) return existing;
    const acct: LedgerAccount = {
      accountId,
      type,
      currency,
      allowNegativeBalance,
      createdAtMs: Date.now()
    };
    this.accounts.set(accountId, acct);
    this.balancesMicro.set(accountId, 0n);
    return acct;
  }

  public getBalance(accountId: AccountId): Money {
    const acct = this.accounts.get(accountId);
    if (!acct) throw new Error(`Unknown ledger account: ${accountId}`);
    return Money.fromMicro(this.balancesMicro.get(accountId) ?? 0n, acct.currency);
  }

  public postJournalEntry(params: {
    idempotencyKey: string;
    referenceId: string;
    currency?: CurrencyCode;
    postings: readonly LedgerPostingInput[];
  }): { entry: JournalEntry; deduplicated: boolean } {
    const existing = this.idempotencyIndex.get(params.idempotencyKey);
    if (existing) {
      return { entry: existing, deduplicated: true };
    }

    const currency = params.currency ?? "GBP";
    if (params.postings.length < 2) {
      throw new Error("A double-entry journal must contain at least 2 postings");
    }

    let totalDebits = 0n;
    let totalCredits = 0n;
    const stagedDeltas = new Map<AccountId, bigint>();

    for (const p of params.postings) {
      if (p.debitMicro < 0n || p.creditMicro < 0n) {
        throw new RangeError("Debit and credit amounts must be non-negative");
      }
      if (p.debitMicro > 0n && p.creditMicro > 0n) {
        throw new Error("A single posting line cannot have both debit and credit > 0");
      }
      const acct = this.accounts.get(p.accountId);
      if (!acct) {
        throw new Error(`Ledger account does not exist: ${p.accountId}`);
      }
      if (acct.currency !== currency) {
        throw new Error(`Currency mismatch for account ${p.accountId}`);
      }

      totalDebits += p.debitMicro;
      totalCredits += p.creditMicro;

      // Credit increases liability/owner balance, Debit decreases it
      const delta = p.creditMicro - p.debitMicro;
      stagedDeltas.set(p.accountId, (stagedDeltas.get(p.accountId) ?? 0n) + delta);
    }

    if (totalDebits !== totalCredits) {
      throw new Error(
        `Unbalanced journal entry rejected: debits=${totalDebits} != credits=${totalCredits}`
      );
    }

    // Check balance guardrails before committing
    for (const [acctId, delta] of stagedDeltas.entries()) {
      const acct = this.accounts.get(acctId)!;
      const current = this.balancesMicro.get(acctId) ?? 0n;
      const projected = current + delta;
      if (!acct.allowNegativeBalance && projected < 0n) {
        throw new Error(`Insufficient funds on account ${acctId}: projected=${projected}`);
      }
    }

    // Commit atomically
    for (const [acctId, delta] of stagedDeltas.entries()) {
      const current = this.balancesMicro.get(acctId) ?? 0n;
      this.balancesMicro.set(acctId, current + delta);
    }

    const entry: JournalEntry = {
      entryId: `je_${randomUUID()}`,
      idempotencyKey: params.idempotencyKey,
      referenceId: params.referenceId,
      currency,
      timestampMs: Date.now(),
      postings: [...params.postings]
    };

    this.entries.push(entry);
    this.idempotencyIndex.set(params.idempotencyKey, entry);
    return { entry, deduplicated: false };
  }

  public getAllEntries(): readonly JournalEntry[] {
    return this.entries;
  }

  public getAllAccounts(): readonly LedgerAccount[] {
    return [...this.accounts.values()];
  }
}
