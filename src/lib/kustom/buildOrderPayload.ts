/**
 * Single payload builder for KCO create. No duplicate mapping in API routes.
 * Inputs: cart items + billing + shipping + comment → KCO create payload.
 */

import type { ICreateAuthorizationPayload, IKustomAddress, IKustomOrderLine } from '~/lib/kustom/client';
import { toMinorUnits, getTaxRateBps, calcTotalTaxAmountMinor } from '~/lib/kustom/tax';
import type { IAddressData } from '~/interfaces/address';

export interface BuildOrderPayloadItem {
    productId: number;
    name: string;
    quantity: number;
    unit_price: number;
    options?: { name: string; value: string }[];
}

export interface BuildOrderPayloadInput {
    items: BuildOrderPayloadItem[];
    billingAddress: IAddressData;
    shippingAddress?: IAddressData;
    comment?: string;
}

function mapAddress(addr: IAddressData): IKustomAddress {
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

/**
 * Build KCO create payload. Tax and totals in minor units (integers).
 * Throws on invalid input or missing NEXT_PUBLIC_APP_URL.
 */
export function buildOrderPayload(input: BuildOrderPayloadInput): ICreateAuthorizationPayload {
    const { items, billingAddress, shippingAddress, comment } = input;
    if (!items?.length || !billingAddress?.firstName || !billingAddress?.lastName || !billingAddress?.email) {
        throw new Error('Missing required fields: items, billingAddress (firstName, lastName, email)');
    }

    const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
    if (!APP_URL) {
        throw new Error('NEXT_PUBLIC_APP_URL is not set. Required for merchant_urls.');
    }

    const taxRateBps = getTaxRateBps();
    const order_lines: IKustomOrderLine[] = [];
    let order_amount_minor = 0;
    let order_tax_amount_minor = 0;

    for (const item of items) {
        const unit_price = Number(item.unit_price);
        const quantity = Number(item.quantity);
        if (Number.isNaN(unit_price) || Number.isNaN(quantity)) {
            throw new Error('Invalid unit_price or quantity (NaN)');
        }
        const unit_price_minor = toMinorUnits(unit_price);
        const total_amount_minor = unit_price_minor * quantity;
        const total_tax_amount_minor = calcTotalTaxAmountMinor(total_amount_minor, taxRateBps);

        if (
            Number.isNaN(unit_price_minor) ||
            Number.isNaN(total_amount_minor) ||
            Number.isNaN(total_tax_amount_minor)
        ) {
            throw new Error('Tax computation produced NaN');
        }

        order_lines.push({
            name: item.name,
            quantity,
            unit_price: unit_price_minor,
            total_amount: total_amount_minor,
            tax_rate: taxRateBps,
            total_tax_amount: total_tax_amount_minor,
            product_id: String(item.productId),
        });
        order_amount_minor += total_amount_minor;
        order_tax_amount_minor += total_tax_amount_minor;
    }

    const merchant_urls = {
        terms: `${APP_URL}/terms`,
        checkout: `${APP_URL}/cart/checkout?order_id={checkout.order.id}`,
        confirmation: `${APP_URL}/cart/checkout/confirmation?order_id={checkout.order.id}`,
        push: `${APP_URL}/api/kustom/push?order_id={checkout.order.id}`,
    };

    const payload: ICreateAuthorizationPayload = {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-se',
        order_lines,
        order_amount: order_amount_minor,
        order_tax_amount: order_tax_amount_minor,
        billing_address: mapAddress(billingAddress),
        shipping_address: shippingAddress ? mapAddress(shippingAddress) : undefined,
        comment: comment || undefined,
        merchant_urls,
    };
    return payload;
}
