export type CurrencyCode = "GBP" | "EUR" | "USD";

const MICRO_SCALE = 1_000_000n;

/**
 * Immutable fixed-point currency value object backed by BigInt micro-units.
 * 1.000000 GBP === 1_000_000n micro-units.
 * Eliminates all IEEE-754 floating-point drift in high-volume micro-settlements.
 */
export class Money {
  public readonly microUnits: bigint;
  public readonly currency: CurrencyCode;

  private constructor(microUnits: bigint, currency: CurrencyCode) {
    this.microUnits = microUnits;
    this.currency = currency;
  }

  public static zero(currency: CurrencyCode = "GBP"): Money {
    return new Money(0n, currency);
  }

  public static fromMicro(microUnits: bigint, currency: CurrencyCode = "GBP"): Money {
    return new Money(microUnits, currency);
  }

  public static fromMajor(majorUnits: number, currency: CurrencyCode = "GBP"): Money {
    if (!Number.isFinite(majorUnits)) {
      throw new RangeError(`Invalid major currency amount: ${majorUnits}`);
    }
    const scaled = BigInt(Math.round(majorUnits * Number(MICRO_SCALE)));
    return new Money(scaled, currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.microUnits + other.microUnits, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.microUnits - other.microUnits, this.currency);
  }

  public negate(): Money {
    return new Money(-this.microUnits, this.currency);
  }

  public isNegative(): boolean {
    return this.microUnits < 0n;
  }

  public isZero(): boolean {
    return this.microUnits === 0n;
  }

  /**
   * Multiply by a basis-point ratio (e.g., 1000 bps = 10.00%).
   * Uses half-even (banker's rounding) to avoid systematic bias.
   */
  public multiplyBps(bps: bigint): Money {
    const numerator = this.microUnits * bps;
    const denominator = 10_000n;
    const quotient = numerator / denominator;
    const remainder = numerator % denominator;
    const absRem = remainder < 0n ? -remainder : remainder;
    const half = denominator / 2n;
    let rounded = quotient;
    if (absRem > half || (absRem === half && quotient % 2n !== 0n)) {
      rounded += numerator >= 0n ? 1n : -1n;
    }
    return new Money(rounded, this.currency);
  }

  /**
   * Deterministically allocates this Money across weighted buckets so that
   * SUM(allocated) === this.microUnits with zero lost micro-units.
   * Remainders are distributed to the highest fractional residuals (Largest Remainder Method).
   */
  public allocateByWeights(weights: readonly bigint[]): Money[] {
    if (weights.length === 0) {
      throw new Error("Cannot allocate money across an empty weight list");
    }
    let totalWeight = 0n;
    for (const w of weights) {
      if (w < 0n) throw new RangeError("Allocation weights must be non-negative");
      totalWeight += w;
    }
    if (totalWeight === 0n) {
      return weights.map(() => Money.zero(this.currency));
    }

    const shares: bigint[] = [];
    const remainders: { index: number; rem: bigint }[] = [];
    let allocated = 0n;

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i]!;
      const num = this.microUnits * w;
      const base = num / totalWeight;
      const rem = num % totalWeight;
      shares.push(base);
      allocated += base;
      remainders.push({ index: i, rem: rem < 0n ? -rem : rem });
    }

    let leftover = this.microUnits - allocated;
    const step = leftover >= 0n ? 1n : -1n;
    remainders.sort((a, b) => (b.rem > a.rem ? 1 : b.rem < a.rem ? -1 : a.index - b.index));

    let idx = 0;
    while (leftover !== 0n && idx < remainders.length) {
      const target = remainders[idx]!.index;
      shares[target] = shares[target]! + step;
      leftover -= step;
      idx++;
    }

    return shares.map((s) => new Money(s, this.currency));
  }

  public format(): string {
    const sign = this.microUnits < 0n ? "-" : "";
    const abs = this.microUnits < 0n ? -this.microUnits : this.microUnits;
    const whole = abs / MICRO_SCALE;
    const frac = (abs % MICRO_SCALE).toString().padStart(6, "0");
    return `${sign}${this.currency} ${whole}.${frac}`;
  }
}
