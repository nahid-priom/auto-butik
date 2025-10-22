import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import AppLink, { resolveAppLinkHref } from '~/components/shared/AppLink';
import url from '~/services/url';
import PageTitle from '~/components/shared/PageTitle';
import AuthLayout from '~/components/account/AuthLayout';
import BlockSpace from '~/components/blocks/BlockSpace';
import { useUser } from '~/store/user/userHooks';

function VerifyEmailPage() {
    const intl = useIntl();
    const router = useRouter();
    const user = useUser();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorCode, setErrorCode] = useState<string | null>(null);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const { token } = router.query;

        if (!token || typeof token !== 'string') {
            setStatus('error');
            setErrorCode('INVALID_VERIFICATION_TOKEN');
            return;
        }

        const verify = async () => {
            try {
                // TODO: integrate actual verification API when available.
                // await customerApi.verifyEmail(token);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setErrorCode('VERIFICATION_FAILED');
            }
        };

        verify();
    }, [router.isReady, router.query]);

    if (user) {
        router.push(resolveAppLinkHref(url.accountDashboard()));
        return null;
    }

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="card-body text-center">
                    <div className="mb-4">
                        <div className="spinner-border text-primary" role="status" aria-hidden="true" />
                    </div>
                    <h1 className="card-title">
                        <FormattedMessage id="VERIFYING_EMAIL" defaultMessage="Verifying your email..." />
                    </h1>
                </div>
            );
        }

        if (status === 'success') {
            return (
                <div className="card-body text-center">
                    <div className="mb-4">
                        <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }} />
                    </div>
                    <h1 className="card-title text-success">
                        <FormattedMessage id="EMAIL_VERIFIED" defaultMessage="Email Verified!" />
                    </h1>
                    <p className="lead">
                        <FormattedMessage
                            id="EMAIL_VERIFIED_MESSAGE"
                            defaultMessage="Your email has been successfully verified. You can now log in to your account."
                        />
                    </p>
                    <div className="mt-4">
                        <AppLink href={url.signIn()} className="btn btn-primary">
                            <FormattedMessage id="GO_TO_LOGIN" defaultMessage="Go to Login" />
                        </AppLink>
                    </div>
                </div>
            );
        }

        return (
            <div className="card-body text-center">
                <div className="mb-4">
                    <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '4rem' }} />
                </div>
                <h1 className="card-title text-danger">
                    <FormattedMessage id="VERIFICATION_ERROR" defaultMessage="Verification Failed" />
                </h1>
                <p className="lead">
                    <FormattedMessage
                        id={errorCode || 'VERIFICATION_ERROR_MESSAGE'}
                        defaultMessage="We couldn't verify your email address. The verification link may have expired or is invalid."
                    />
                </p>
                <div className="mt-4">
                    <AppLink href={url.home()} className="btn btn-secondary mr-2">
                        <FormattedMessage id="GO_TO_HOMEPAGE" defaultMessage="Go to Homepage" />
                    </AppLink>
                    <AppLink href={url.signIn()} className="btn btn-primary">
                        <FormattedMessage id="GO_TO_LOGIN" defaultMessage="Go to Login" />
                    </AppLink>
                </div>
            </div>
        );
    };

    return (
        <AuthLayout>
            <PageTitle>{intl.formatMessage({ id: 'VERIFYING_EMAIL' })}</PageTitle>
            <BlockSpace layout="after-header" />
            <div className="block" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BlockSpace layout="before-footer" />
        </AuthLayout>
    );
}

export default VerifyEmailPage;
