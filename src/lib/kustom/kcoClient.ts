/**
 * Single KCO API client. Server-side only.
 * Uses Location header order URL for all post-create interactions; does not reconstruct URLs.
 * Config: KUSTOM_BASE_URL (default https://api.kustom.co), KUSTOM_KEY_ID, KUSTOM_SHARED_SECRET.
 */

import type {
    ICreateAuthorizationPayload,
    IKustomAddress,
    IKustomOrderLine,
} from '~/lib/kustom/client';

const DEFAULT_BASE_URL = 'https://api.kustom.co';

const getBaseUrl = (): string => {
    const url = (process.env.KUSTOM_BASE_URL ?? DEFAULT_BASE_URL).trim();
    return url.replace(/\/$/, '');
};

const getAuthHeader = (): string => {
    const keyId = (process.env.KUSTOM_KEY_ID ?? '').trim();
    const secret = (process.env.KUSTOM_SHARED_SECRET ?? '').trim();
    if (!keyId || !secret) {
        throw new Error('KUSTOM_KEY_ID and KUSTOM_SHARED_SECRET must be set');
    }
    const auth = Buffer.from(`${keyId}:${secret}`).toString('base64');
    return `Basic ${auth}`;
};

interface FetchResult<T = unknown> {
    data: T;
    headers: Headers;
}

async function fetchKco<T>(
    url: string,
    options: RequestInit & { parseJson?: boolean },
): Promise<FetchResult<T>> {
    const { parseJson = true, ...init } = options;
    const hasBody = init.body != null;
    const res = await fetch(url, {
        ...init,
        headers: {
            Authorization: getAuthHeader(),
            ...(hasBody && { 'Content-Type': 'application/json' }),
            Accept: 'application/json',
            ...init.headers,
        },
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`KCO request failed: ${res.status} ${text}`);
    }
    const data = (parseJson ? (JSON.parse(text) as T) : text) as T;
    return { data, headers: res.headers };
}

/** In-memory cache so read can resolve order_id when user lands from Kustom redirect with only order_id. */
const orderUrlByOrderId = new Map<string, string>();

export function setOrderUrlForOrderId(orderId: string, orderUrl: string): void {
    orderUrlByOrderId.set(orderId, orderUrl);
}

export function getOrderUrlByOrderId(orderId: string): string | undefined {
    return orderUrlByOrderId.get(orderId);
}

export interface CreateOrderResult {
    orderId: string;
    orderUrl: string;
    htmlSnippet: string;
}

/**
 * POST /checkout/v3/orders. Uses Location header as orderUrl; does not build URL from order_id.
 */
export async function createOrder(
    payload: ICreateAuthorizationPayload,
): Promise<CreateOrderResult> {
    const baseUrl = getBaseUrl();
    const requestUrl = `${baseUrl}/checkout/v3/orders`;
    const body = {
        purchase_country: payload.purchase_country ?? 'SE',
        purchase_currency: payload.purchase_currency ?? 'SEK',
        locale: payload.locale ?? 'sv-se',
        order_amount: payload.order_amount,
        order_tax_amount: payload.order_tax_amount,
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
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
        throw new Error(`KCO create failed: ${res.status} ${text}`);
    }
    const data = JSON.parse(text) as { order_id?: string; html_snippet?: string };
    const orderId = data.order_id;
    const htmlSnippet = data.html_snippet;
    if (!orderId || !htmlSnippet) {
        throw new Error('KCO response missing order_id or html_snippet');
    }

    const location = res.headers.get('Location');
    const orderUrl = location?.trim() || '';
    if (!orderUrl) {
        throw new Error('KCO response missing Location header; cannot use order URL for future calls');
    }
    setOrderUrlForOrderId(orderId, orderUrl);

    return { orderId, orderUrl, htmlSnippet };
}

export interface UpdateOrderResult {
    htmlSnippet?: string;
    status?: string;
    [key: string]: unknown;
}

/**
 * POST /checkout/v3/orders/{order_id} using the exact orderUrl (no reconstruction).
 */
export async function updateOrder(
    orderUrl: string,
    payload: Partial<{
        order_lines: IKustomOrderLine[];
        billing_address: IKustomAddress;
        shipping_address: IKustomAddress;
        comment: string;
    }>,
): Promise<UpdateOrderResult> {
    const { data } = await fetchKco<UpdateOrderResult>(orderUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return data;
}

export interface ReadOrderResult {
    html_snippet?: string;
    status?: string;
    [key: string]: unknown;
}

/**
 * GET /checkout/v3/orders/{order_id} using the exact orderUrl.
 */
export async function readOrder(orderUrl: string): Promise<ReadOrderResult> {
    const { data } = await fetchKco<ReadOrderResult>(orderUrl, { method: 'GET' });
    return data;
}

/**
 * POST /checkout/v3/orders/{order_id}/abort using the exact orderUrl.
 */
export async function abortOrder(orderUrl: string): Promise<void> {
    const abortUrl = orderUrl.endsWith('/abort') ? orderUrl : `${orderUrl.replace(/\/$/, '')}/abort`;
    await fetchKco(abortUrl, { method: 'POST', parseJson: false });
}
