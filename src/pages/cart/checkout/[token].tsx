// react
import React, { useEffect, useRef, useState } from 'react';
// third-party
import { useRouter } from 'next/router';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';
import url from '~/services/url';
import { renderKcoSnippet } from '~/utils/renderKcoSnippet';

function Page() {
    const router = useRouter();
    const [snippet, setSnippet] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const confirmationContainerRef = useRef<HTMLDivElement>(null);
    const orderId = typeof router.query.token === 'string' ? router.query.token : typeof router.query.order_id === 'string' ? router.query.order_id : undefined;

    useEffect(() => {
        let canceled = false;

        if (!orderId) {
            setLoading(false);
            return;
        }

        fetch(`/api/kustom/read-order?order_id=${encodeURIComponent(orderId)}`)
            .then((res) => {
                if (canceled) return;
                if (!res.ok) {
                    throw new Error(res.status === 404 ? 'Order not found' : 'Failed to load order');
                }
                return res.json();
            })
            .then((data) => {
                if (canceled) return;
                const html = data.html_snippet ?? null;
                setSnippet(html);
                setError(html ? null : 'No confirmation content');
            })
            .catch((err) => {
                if (!canceled) {
                    setError(err instanceof Error ? err.message : 'Failed to load order');
                }
            })
            .finally(() => {
                if (!canceled) setLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [orderId]);

    useEffect(() => {
        if (loading || error || !snippet || !confirmationContainerRef.current) return;
        renderKcoSnippet(confirmationContainerRef.current, snippet);
    }, [loading, error, snippet]);

    return (
        <>
            <PageTitle>
                <FormattedMessage id="HEADER_ORDER_CONFIRMATION" defaultMessage="Order confirmation" />
            </PageTitle>
            <BlockHeader
                pageTitle={<FormattedMessage id="HEADER_ORDER_CONFIRMATION" defaultMessage="Order confirmation" />}
                breadcrumb={[
                    { title: <FormattedMessage id="LINK_HOME" />, url: url.home() },
                    { title: <FormattedMessage id="LINK_CART" />, url: url.cart() },
                    { title: <FormattedMessage id="HEADER_ORDER_CONFIRMATION" defaultMessage="Order confirmation" /> },
                ]}
            />
            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block order-confirmation">
                <div className="container container--max--xl">
                    {loading && (
                        <div className="text-muted text-center py-5">
                            <FormattedMessage id="TEXT_LOADING" defaultMessage="Loading..." />
                        </div>
                    )}
                    {error && !loading && (
                        <div className="alert alert-danger">
                            {error}
                            <div className="mt-2">
                                <AppLink href={url.home()} className="btn btn-sm btn-secondary">
                                    <FormattedMessage id="BUTTON_GO_TO_HOMEPAGE" />
                                </AppLink>
                            </div>
                        </div>
                    )}
                    {snippet && !loading && !error && (
                        <div
                            id="kco-confirmation-container"
                            ref={confirmationContainerRef}
                            className="order-confirmation__snippet"
                        />
                    )}
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </>
    );
}

export default Page;
