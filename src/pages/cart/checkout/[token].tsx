// react
import React, { useEffect, useState } from 'react';
// third-party
import { useRouter } from 'next/router';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';
import url from '~/services/url';

function Page() {
    const router = useRouter();
    const [snippet, setSnippet] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = router.query.token;

    useEffect(() => {
        let canceled = false;

        if (typeof token !== 'string') {
            setLoading(false);
            return;
        }

        fetch(`/api/kustom/read-order?orderId=${encodeURIComponent(token)}`)
            .then((res) => {
                if (canceled) return;
                if (!res.ok) {
                    throw new Error(res.status === 404 ? 'Order not found' : 'Failed to load order');
                }
                return res.json();
            })
            .then((data) => {
                if (canceled) return;
                setSnippet(data.html_snippet || null);
                setError(data.html_snippet ? null : 'No confirmation content');
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
    }, [token]);

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
                    {snippet && !loading && (
                        <div
                            className="order-confirmation__snippet"
                            dangerouslySetInnerHTML={{ __html: snippet }}
                        />
                    )}
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </>
    );
}

export default Page;
