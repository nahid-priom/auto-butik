/**
 * Kustom Checkout (KCO) API client.
 * All requests run server-side only. Do not expose credentials to the frontend.
 * Config from .env.local: KUSTOM_BASE_URL, KUSTOM_KEY_ID, KUSTOM_SHARED_SECRET.
 *
 * Base URL:
 * - Credentials starting with kco_live_ → https://api.kustom.co
 * - Playground credentials → https://api.playground.kustom.co
 */

const getBaseUrl = (): string => {
    const url = (process.env.KUSTOM_BASE_URL ?? '').trim();
    if (!url) {
        throw new Error(
            'KUSTOM_BASE_URL is not set in .env.local. Use https://api.kustom.co for live (kco_live_*) or https://api.playground.kustom.co for playground.',
        );
    }
    return url.replace(/\/$/, '');
};

/** Basic Auth: username = KUSTOM_KEY_ID, password = KUSTOM_SHARED_SECRET. No Bearer. */
const getAuthHeader = (): string => {
    const keyId = (process.env.KUSTOM_KEY_ID ?? '').trim();
    const secret = (process.env.KUSTOM_SHARED_SECRET ?? '').trim();
    if (!keyId || !secret) {
        throw new Error('KUSTOM_KEY_ID and KUSTOM_SHARED_SECRET must be set in .env.local');
    }
    const auth = Buffer.from(`${keyId}:${secret}`).toString('base64');
    return `Basic ${auth}`;
};

export interface IKustomAddress {
    given_name: string;
    family_name: string;
    email: string;
    phone?: string;
    street_address?: string;
    street_address2?: string;
    postal_code?: string;
    city?: string;
    region?: string;
    country?: string;
}

export interface IKustomOrderLine {
    name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    product_id?: string;
}

export interface IMerchantUrls {
    checkout: string;
    confirmation: string;
}

export interface ICreateAuthorizationPayload {
    order_lines: IKustomOrderLine[];
    billing_address: IKustomAddress;
    shipping_address?: IKustomAddress;
    purchase_country?: string;
    purchase_currency?: string;
    locale?: string;
    merchant_reference?: string;
    comment?: string;
    /** Must include order_id={checkout.order.id} so Kustom can redirect with order_id */
    merchant_urls?: IMerchantUrls;
}

export interface ICreateAuthorizationResponse {
    order_id: string;
    client_token?: string;
    html_snippet: string;
}

export interface IReadOrderResponse {
    html_snippet?: string;
    confirmation_snippet?: string;
    order_id?: string;
    [key: string]: unknown;
}

/**
 * Create a payment authorization (checkout session).
 * Uses POST /checkout/v3/orders. Returns HTML snippet and order_id for confirmation redirect.
 */
export async function createAuthorization(
    payload: ICreateAuthorizationPayload,
): Promise<ICreateAuthorizationResponse> {
    const baseUrl = getBaseUrl();
    const requestUrl = `${baseUrl}/checkout/v3/orders`;
    const auth = getAuthHeader();

    const body = {
        purchase_country: payload.purchase_country ?? 'SE',
        purchase_currency: payload.purchase_currency ?? 'SEK',
        locale: payload.locale ?? 'sv-se',
        order_lines: payload.order_lines,
        billing_address: payload.billing_address,
        ...(payload.shipping_address && { shipping_address: payload.shipping_address }),
        ...(payload.merchant_reference && { merchant_reference: payload.merchant_reference }),
        ...(payload.comment && { comment: payload.comment }),
        ...(payload.merchant_urls && { merchant_urls: payload.merchant_urls }),
    };

    const res = await fetch(requestUrl, {
        method: 'POST',
        headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Kustom create authorization failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as ICreateAuthorizationResponse;
    if (!data.order_id || !data.html_snippet) {
        throw new Error('Kustom response missing order_id or html_snippet');
    }
    return data;
}

/**
 * Read order details from Kustom (GET /checkout/v3/orders/{order_id}).
 * Returns HTML snippet for confirmation UI if available.
 */
export async function readOrder(orderId: string): Promise<IReadOrderResponse> {
    const baseUrl = getBaseUrl();
    const requestUrl = `${baseUrl}/checkout/v3/orders/${encodeURIComponent(orderId)}`;
    const auth = getAuthHeader();

    const res = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            Authorization: auth,
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Kustom read order failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as IReadOrderResponse;
    return data;
}

/**
 * Read order confirmation snippet (HTML) for display on success page.
 * Some APIs return confirmation in a separate endpoint; if readOrder already returns
 * html_snippet or confirmation_snippet, use that. Otherwise this can call a dedicated
 * confirmation endpoint if Kustom provides one.
 */
export async function getConfirmationSnippet(orderId: string): Promise<string> {
    const order = await readOrder(orderId);
    const snippet =
        (order.html_snippet as string) ||
        (order.confirmation_snippet as string) ||
        '';
    return snippet;
}
