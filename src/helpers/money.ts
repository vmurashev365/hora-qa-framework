/**
 * Money helpers.
 *
 * Rules:
 * - Represent money as integer cents internally.
 * - Round half-up to 2 decimals when converting from decimal dollars.
 * - Tolerance for comparisons is typically ±1 cent.
 */

/** Round half-up (away from zero) to a fixed number of decimals. */
export function roundHalfUp(value: number, decimals: number = 2): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number for rounding: ${String(value)}`);
  }
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const sign = Math.sign(scaled) || 1;
  const rounded = Math.floor(Math.abs(scaled) + 0.5);
  return (sign * rounded) / factor;
}

/** Convert a decimal-dollar amount to integer cents using half-up rounding. */
export function dollarsToCents(amountDollars: number): number {
  const rounded = roundHalfUp(amountDollars, 2);
  const cents = rounded * 100;
  // cents should be an integer after rounding; guard against floating drift.
  return Math.trunc(Math.round(cents));
}

/** Round a "cents" float to an integer cent using half-up rounding. */
export function roundToCentsInt(valueInCents: number): number {
  if (!Number.isFinite(valueInCents)) {
    throw new Error(`Invalid cents value: ${String(valueInCents)}`);
  }
  const sign = Math.sign(valueInCents) || 1;
  return sign * Math.floor(Math.abs(valueInCents) + 0.5);
}

export function centsDelta(aCents: number, bCents: number): number {
  return Math.abs(aCents - bCents);
}

export function isWithinCentsTolerance(actualCents: number, expectedCents: number, toleranceCents: number = 1): boolean {
  return centsDelta(actualCents, expectedCents) <= toleranceCents;
}
