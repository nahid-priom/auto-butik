/**
 * Server-side only. Creates a Kustom checkout authorization and returns
 * html_snippet + order_id for the frontend to render the iframe and redirect on success.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuthorization } from '~/lib/kustom/client';
import type { IAddressData } from '~/interfaces/address';

interface ICheckoutItemRequest {
    productId: number;
    name: string;
    quantity: number;
    unit_price: number;
    options?: { name: string; value: string }[];
}

interface ICreateOrderBody {
    items: ICheckoutItemRequest[];
    billingAddress: IAddressData;
    shippingAddress?: IAddressData;
    comment?: string;
}

function mapAddress(addr: IAddressData): import('~/lib/kustom/client').IKustomAddress {
    return {
        given_name: addr.firstName,
        family_name: addr.lastName,
        email: addr.email,
        phone: addr.phone || undefined,
        street_address: addr.address1 || undefined,
        street_address2: addr.address2 || undefined,
        postal_code: addr.postcode || undefined,
        city: addr.city || undefined,
        region: addr.state || undefined,
        country: addr.country || undefined,
    };
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
        const body = req.body as ICreateOrderBody;
        if (
            !body?.items?.length ||
            !body?.billingAddress?.firstName ||
            !body?.billingAddress?.lastName ||
            !body?.billingAddress?.email
        ) {
            res.status(400).json({
                error: 'Missing required fields: items, billingAddress (firstName, lastName, email)',
            });
            return;
        }

        const order_lines = body.items.map((item) => {
            const total_amount = item.unit_price * item.quantity;
            return {
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_amount,
                product_id: String(item.productId),
            };
        });

        const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
        if (!APP_URL) {
            res.status(500).json({
                error: 'NEXT_PUBLIC_APP_URL is not set. Required for Kustom merchant_urls.',
            });
            return;
        }

        const merchant_urls = {
            terms: `${APP_URL}/terms`,
            checkout: `${APP_URL}/cart/checkout?order_id={checkout.order.id}`,
            confirmation: `${APP_URL}/cart/checkout/confirmation?order_id={checkout.order.id}`,
            push: `${APP_URL}/api/kustom/push?order_id={checkout.order.id}`,
        };

        const payload = {
            order_lines,
            billing_address: mapAddress(body.billingAddress),
            shipping_address: body.shippingAddress
                ? mapAddress(body.shippingAddress)
                : undefined,
            comment: body.comment || undefined,
            merchant_urls,
        };

        const result = await createAuthorization(payload);

        res.status(200).json({
            order_id: result.order_id,
            client_token: result.client_token ?? undefined,
            html_snippet: result.html_snippet,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Create order failed';
        res.status(500).json({ error: message });
    }
}
