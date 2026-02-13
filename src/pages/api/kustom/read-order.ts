/**
 * Server-side only. Reads order from Kustom and returns confirmation snippet HTML
 * for the success page.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getConfirmationSnippet } from '~/lib/kustom/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const orderId =
        typeof req.query.order_id === 'string'
            ? req.query.order_id
            : Array.isArray(req.query.order_id)
              ? req.query.order_id[0]
              : typeof req.query.orderId === 'string'
                ? req.query.orderId
                : Array.isArray(req.query.orderId)
                  ? req.query.orderId[0]
                  : undefined;

    if (!orderId) {
        res.status(400).json({ error: 'Missing order_id or orderId query parameter' });
        return;
    }

    try {
        const snippet = await getConfirmationSnippet(orderId);
        res.status(200).json({ html_snippet: snippet || null, order_id: orderId });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Read order failed';
        res.status(500).json({ error: message });
    }
}
