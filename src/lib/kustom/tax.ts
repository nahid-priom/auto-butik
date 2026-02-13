/**
 * KCO tax helpers. API expects minor units (öre) integers everywhere.
 */

/** Convert amount to minor units (e.g. SEK → öre). Returns integer. */
export function toMinorUnits(amount: number): number {
    const n = Math.round(Number(amount) * 100);
    if (Number.isNaN(n)) {
        throw new Error('Kustom tax: toMinorUnits got NaN');
    }
    return n;
}

/** VAT rate in basis points (bps). From env KCO_TAX_RATE_BPS (e.g. 2000 = 20%), default 2500. */
export function getTaxRateBps(): number {
    const bps = Number(process.env.KCO_TAX_RATE_BPS ?? 2500);
    if (Number.isNaN(bps)) {
        throw new Error('Kustom tax: KCO_TAX_RATE_BPS must be a number');
    }
    return bps;
}

/**
 * Kustom gross-price formula: tax from tax-inclusive total, in minor units (integer-safe).
 * total_tax_amount = total_amount - Math.round((total_amount * 10000) / (10000 + tax_rate))
 */
export function calcTotalTaxAmountMinor(totalAmountMinor: number, taxRateBps: number): number {
    const total = Number(totalAmountMinor);
    const rate = Number(taxRateBps);
    if (Number.isNaN(total) || Number.isNaN(rate)) {
        throw new Error('Kustom tax: calcTotalTaxAmountMinor got NaN');
    }
    const totalTaxAmount = total - Math.round((total * 10000) / (10000 + rate));
    if (Number.isNaN(totalTaxAmount)) {
        throw new Error('Kustom tax: calcTotalTaxAmountMinor result NaN');
    }
    return totalTaxAmount;
}
