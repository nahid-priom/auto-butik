/**
 * Legacy route: /cart/checkout/[token]. Redirects to single confirmation page.
 */

import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Page() {
    const router = useRouter();
    const token = typeof router.query.token === 'string' ? router.query.token : undefined;

    useEffect(() => {
        if (!router.isReady) return;
        if (token) {
            router.replace(`/cart/checkout/confirmation?order_id=${encodeURIComponent(token)}`);
        } else {
            router.replace('/cart/checkout');
        }
    }, [router, token]);

    return null;
}

export default Page;
