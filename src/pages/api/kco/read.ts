/**
 * GET /api/kco/read — read KCO order. Accepts orderUrl (or order_id for redirect fallback).
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { readOrder, getOrderUrlByOrderId } from '~/lib/kustom/kcoClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const orderUrl =
        typeof req.query.orderUrl === 'string'
            ? req.query.orderUrl.trim()
            : Array.isArray(req.query.orderUrl)
              ? req.query.orderUrl[0]?.trim()
              : undefined;
    const orderId =
        typeof req.query.order_id === 'string'
            ? req.query.order_id.trim()
            : Array.isArray(req.query.order_id)
              ? req.query.order_id[0]?.trim()
              : undefined;

    const resolvedUrl = orderUrl || (orderId ? getOrderUrlByOrderId(orderId) : undefined);
    if (!resolvedUrl) {
        res.status(400).json({
            error: orderId
                ? 'Order not found or session expired. Complete checkout from the same browser.'
                : 'Missing orderUrl or order_id query parameter',
        });
        return;
    }

    try {
        const order = await readOrder(resolvedUrl);
        res.status(200).json(order);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Read order failed';
        res.status(500).json({ error: message });
    }
}
