/**
 * POST /api/kco/update — update KCO order (addresses/items/comment). Accepts orderUrl.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { updateOrder } from '~/lib/kustom/kcoClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const orderUrl = typeof req.body?.orderUrl === 'string' ? req.body.orderUrl.trim() : undefined;
    if (!orderUrl) {
        res.status(400).json({ error: 'Missing orderUrl in body' });
        return;
    }

    try {
        const payload = req.body.payload ?? req.body;
        const { orderUrl: _u, ...updatePayload } = payload;
        const result = await updateOrder(orderUrl, updatePayload);
        res.status(200).json(result);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Update order failed';
        res.status(500).json({ error: message });
    }
}
