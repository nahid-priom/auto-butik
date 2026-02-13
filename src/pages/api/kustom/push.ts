/**
 * Kustom push notification endpoint. Called by Kustom when order status changes.
 * Always returns 200 quickly. No logic change yet.
 */

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const orderId =
        typeof req.query.order_id === 'string'
            ? req.query.order_id
            : Array.isArray(req.query.order_id)
              ? req.query.order_id[0]
              : undefined;

    if (orderId) {
        // Optional: log for debugging
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.info('[Kustom push] order_id:', orderId);
        }
    }

    res.status(200).end();
}
