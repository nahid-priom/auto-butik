/**
 * POST /api/kco/create — create KCO order. Returns orderId, orderUrl, htmlSnippet; optional warnings.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '~/lib/kustom/kcoClient';
import { buildOrderPayload } from '~/lib/kustom/buildOrderPayload';
import type { IAddressData } from '~/interfaces/address';

interface CreateBodyItem {
    productId: number;
    name: string;
    quantity: number;
    unit_price: number;
    options?: { name: string; value: string }[];
}

interface CreateBody {
    items: CreateBodyItem[];
    billingAddress: IAddressData;
    shippingAddress?: IAddressData;
    comment?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const body = req.body as CreateBody;
        const payload = buildOrderPayload({
            items: body.items,
            billingAddress: body.billingAddress,
            shippingAddress: body.shippingAddress,
            comment: body.comment,
        });
        const result = await createOrder(payload);
        const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
        const warnings: Array<{ code: string; message: string; details?: { merchantBaseUrl: string; requestOrigin: string } }> = [];
        if (APP_URL) {
            const protoRaw = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim();
            const host = (req.headers['x-forwarded-host'] as string)?.split(',')[0]?.trim() || (req.headers.host as string) || '';
            const proto = protoRaw || (host?.startsWith('localhost') ? 'http' : 'https');
            const requestOrigin = host ? `${proto}://${host}`.replace(/\/$/, '') : '';
            const reqNorm = requestOrigin.toLowerCase();
            const baseNorm = APP_URL.toLowerCase();
            if (reqNorm !== baseNorm || baseNorm.includes('.vercel.app')) {
                warnings.push({
                    code: 'MERCHANT_URL_MISMATCH',
                    message: 'Merchant URLs are using a different domain than the current request origin. Update NEXT_PUBLIC_APP_URL to your real domain before going live.',
                    details: { merchantBaseUrl: APP_URL, requestOrigin },
                });
            }
        }
        res.status(200).json({
            orderId: result.orderId,
            orderUrl: result.orderUrl,
            htmlSnippet: result.htmlSnippet,
            ...(warnings.length > 0 && { warnings }),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Create order failed';
        const isValidation =
            message.includes('Missing required') ||
            message.includes('Invalid ') ||
            message.includes('NEXT_PUBLIC_APP_URL');
        res.status(isValidation ? 400 : 500).json({ error: message });
    }
}
