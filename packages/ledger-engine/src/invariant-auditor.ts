import type { DoubleEntryLedger } from "./double-entry.js";

export interface AuditReport {
  readonly passed: boolean;
  readonly entriesAudited: number;
  readonly accountsAudited: number;
  readonly globalDebitMicro: bigint;
  readonly globalCreditMicro: bigint;
  readonly violations: readonly string[];
  readonly auditedAtMs: number;
}

/**
 * Continuous financial invariant verifier.
 * Proves global trial balance == 0 and zero unauthorized negative balances.
 */
export class LedgerInvariantAuditor {
  public static audit(ledger: DoubleEntryLedger): AuditReport {
    const violations: string[] = [];
    const entries = ledger.getAllEntries();
    const accounts = ledger.getAllAccounts();

    let globalDebits = 0n;
    let globalCredits = 0n;
    const recomputed = new Map<string, bigint>();

    for (const entry of entries) {
      let entryDebits = 0n;
      let entryCredits = 0n;
      for (const p of entry.postings) {
        entryDebits += p.debitMicro;
        entryCredits += p.creditMicro;
        recomputed.set(p.accountId, (recomputed.get(p.accountId) ?? 0n) + (p.creditMicro - p.debitMicro));
      }
      if (entryDebits !== entryCredits) {
        violations.push(`Entry ${entry.entryId} is unbalanced: ${entryDebits} != ${entryCredits}`);
      }
      globalDebits += entryDebits;
      globalCredits += entryCredits;
    }

    if (globalDebits !== globalCredits) {
      violations.push(`Global trial balance mismatch: debits=${globalDebits} credits=${globalCredits}`);
    }

    for (const acct of accounts) {
      const liveBal = ledger.getBalance(acct.accountId).microUnits;
      const calcBal = recomputed.get(acct.accountId) ?? 0n;
      if (liveBal !== calcBal) {
        violations.push(`Balance drift on ${acct.accountId}: live=${liveBal} recomputed=${calcBal}`);
      }
      if (!acct.allowNegativeBalance && liveBal < 0n) {
        violations.push(`Unauthorized negative balance on ${acct.accountId}: ${liveBal}`);
      }
    }

    return {
      passed: violations.length === 0,
      entriesAudited: entries.length,
      accountsAudited: accounts.length,
      globalDebitMicro: globalDebits,
      globalCreditMicro: globalCredits,
      violations,
      auditedAtMs: Date.now()
    };
  }
}
