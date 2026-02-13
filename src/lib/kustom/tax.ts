/**
 * KCO tax helpers. Amounts in major units (SEK) unless stated; API expects minor units (öre).
 */

/** Convert amount to minor units (e.g. SEK → öre). */
export function toMinorUnits(amount: number): number {
    const n = Math.round(Number(amount) * 100);
    if (Number.isNaN(n)) {
        throw new Error('Kustom tax: toMinorUnits got NaN');
    }
    return n;
}

/** VAT rate in basis points (bps). Default 2500 = 25% (Sweden). */
export function getVatRateBps(_lineOrProduct?: unknown): number {
    return 2500;
}

/**
 * Tax amount from tax-inclusive total.
 * total_tax_amount = total_amount - round(total_amount * 10000 / (10000 + tax_rate))
 */
export function calcTotalTaxAmount(totalAmount: number, taxRateBps: number): number {
    const total = Number(totalAmount);
    const rate = Number(taxRateBps);
    if (Number.isNaN(total) || Number.isNaN(rate)) {
        throw new Error('Kustom tax: calcTotalTaxAmount got NaN');
    }
    const exclusive = Math.round((total * 10000) / (10000 + rate));
    const tax = total - exclusive;
    if (Number.isNaN(tax)) {
        throw new Error('Kustom tax: calcTotalTaxAmount result NaN');
    }
    return tax;
}
