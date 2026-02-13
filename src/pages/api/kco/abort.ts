/**
 * POST /api/kco/abort — abort KCO order. Accepts orderUrl. Non-blocking and safe.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { abortOrder } from '~/lib/kustom/kcoClient';

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
        await abortOrder(orderUrl);
        res.status(200).json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Abort failed';
        res.status(500).json({ error: message });
    }
}
