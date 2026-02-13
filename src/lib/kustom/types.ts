/**
 * Single source of truth for KCO order state. Use everywhere instead of
 * passing multiple competing identifiers (token / order_id / url).
 */
export type KcoSession = {
    orderId: string;
    /** From Kustom Location header after create; use for update/read/abort. */
    orderUrl: string;
    htmlSnippet: string;
};
