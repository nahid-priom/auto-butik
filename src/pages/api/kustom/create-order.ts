/**
 * Server-side only. Creates a Kustom checkout authorization and returns
 * html_snippet + order_id for the frontend to render the iframe and redirect on success.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuthorization } from '~/lib/kustom/client';
import { toMinorUnits, getVatRateBps, calcTotalTaxAmount } from '~/lib/kustom/tax';
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

        const VAT_BPS = getVatRateBps();
        const order_lines: import('~/lib/kustom/client').IKustomOrderLine[] = [];
        let order_amount_minor = 0;
        let order_tax_amount_minor = 0;

        for (const item of body.items) {
            const unit_price = Number(item.unit_price);
            const quantity = Number(item.quantity);
            const total_amount_major = unit_price * quantity;
            if (Number.isNaN(unit_price) || Number.isNaN(quantity) || Number.isNaN(total_amount_major)) {
                res.status(400).json({
                    error: 'Kustom create order: invalid unit_price or quantity (NaN).',
                });
                return;
            }
            const total_tax_major = calcTotalTaxAmount(total_amount_major, VAT_BPS);
            const unit_price_minor = toMinorUnits(unit_price);
            const total_amount_minor = toMinorUnits(total_amount_major);
            const total_tax_amount_minor = toMinorUnits(total_tax_major);
            if (Number.isNaN(unit_price_minor) || Number.isNaN(total_amount_minor) || Number.isNaN(total_tax_amount_minor)) {
                res.status(400).json({
                    error: 'Kustom create order: tax computation produced NaN.',
                });
                return;
            }
            order_lines.push({
                name: item.name,
                quantity,
                unit_price: unit_price_minor,
                total_amount: total_amount_minor,
                tax_rate: VAT_BPS,
                total_tax_amount: total_tax_amount_minor,
                product_id: String(item.productId),
            });
            order_amount_minor += total_amount_minor;
            order_tax_amount_minor += total_tax_amount_minor;
        }

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
            order_amount: order_amount_minor,
            order_tax_amount: order_tax_amount_minor,
            billing_address: mapAddress(body.billingAddress),
            shipping_address: body.shippingAddress
                ? mapAddress(body.shippingAddress)
                : undefined,
            comment: body.comment || undefined,
            merchant_urls,
        };

        const result = await createAuthorization(payload);

        const merchantBaseUrl = APP_URL;
        const protoRaw = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim();
        const host = (req.headers['x-forwarded-host'] as string)?.split(',')[0]?.trim() || (req.headers.host as string) || '';
        const proto = protoRaw || (host && host.startsWith('localhost') ? 'http' : 'https');
        const requestOrigin = host ? `${proto}://${host}`.replace(/\/$/, '') : '';

        const warnings: Array<{ code: string; message: string; details?: { merchantBaseUrl: string; requestOrigin: string } }> = [];
        if (requestOrigin && merchantBaseUrl) {
            const reqNorm = requestOrigin.toLowerCase();
            const baseNorm = merchantBaseUrl.toLowerCase();
            const mismatch = reqNorm !== baseNorm;
            const isVercelBase = baseNorm.includes('.vercel.app');
            if (mismatch || isVercelBase) {
                warnings.push({
                    code: 'MERCHANT_URL_MISMATCH',
                    message: 'Merchant URLs are using a different domain than the current request origin. Update NEXT_PUBLIC_APP_URL to your real domain before going live.',
                    details: { merchantBaseUrl, requestOrigin },
                });
            }
        }

        res.status(200).json({
            order_id: result.order_id,
            client_token: result.client_token ?? undefined,
            html_snippet: result.html_snippet,
            warnings,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Create order failed';
        res.status(500).json({ error: message });
    }
}
