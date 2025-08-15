import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import PageTitle from '~/components/shared/PageTitle';
import AuthLayout from '~/components/account/AuthLayout';
import BlockSpace from '~/components/blocks/BlockSpace';
import { useUser } from '~/store/user/userHooks';
import { customerApi } from '~/api/graphql/account.api';

function VerifyEmailPage() {
    const intl = useIntl();
    const router = useRouter();
    const user = useUser();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const { token } = router.query;
            
            if (!token || typeof token !== 'string') {
                setError('INVALID_VERIFICATION_TOKEN');
                setIsLoading(false);
                return;
            }

            try {
                // Call your verification endpoint here
                // This is a placeholder - you'll need to implement the actual verification API call
                // await customerApi.verifyEmail(token);
                setIsVerified(true);
            } catch (e) {
                setError('VERIFICATION_FAILED');
            } finally {
                setIsLoading(false);
            }
        };

        if (router.isReady) {
            verifyEmail();
        }
    }, [router.isReady, router.query]);

    if (user) {
        router.push(url.accountDashboard());
        return null;
    }

    if (isLoading) {
        return (
            <AuthLayout>
                <PageTitle>{intl.formatMessage({ id: 'VERIFYING_EMAIL' })}</PageTitle>
                <BlockSpace layout="after-header" />
                <div className="block" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h1 className="card-title">
                                            <FormattedMessage id="VERIFYING_EMAIL" defaultMessage="Verifying your email..." />
                                        </h1>
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">
                                                    <FormattedMessage id="LOADING" defaultMessage="Loading..." />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BlockSpace layout="before-footer" />
            </AuthLayout>
        );
    }

    if (isVerified) {
        return (
            <AuthLayout>
                <PageTitle>
                    <FormattedMessage id="EMAIL_VERIFIED" defaultMessage="Email Verified" />
                </PageTitle>
                <BlockSpace layout="after-header" />
                <div className="block" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="mb-4">
                                            <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
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
                                            <AppLink href={url.accountLogin()} className="btn btn-primary">
                                                <FormattedMessage id="GO_TO_LOGIN" defaultMessage="Go to Login" />
                                            </AppLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BlockSpace layout="before-footer" />
            </AuthLayout>
        );
    }

    // Error state
    return (
        <AuthLayout>
            <PageTitle>
                <FormattedMessage id="VERIFICATION_ERROR" defaultMessage="Verification Error" />
            </PageTitle>
            <BlockSpace layout="after-header" />
            <div className="block" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="mb-4">
                                        <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <h1 className="card-title text-danger">
                                        <FormattedMessage id="VERIFICATION_ERROR" defaultMessage="Verification Failed" />
                                    </h1>
                                    <p className="lead">
                                        <FormattedMessage 
                                            id={error || 'VERIFICATION_ERROR_MESSAGE'} 
                                            defaultMessage="We couldn't verify your email address. The verification link may have expired or is invalid." 
                                        />
                                    </p>
                                    <div className="mt-4">
                                        <AppLink href={url.home()} className="btn btn-secondary mr-2">
                                            <FormattedMessage id="GO_TO_HOMEPAGE" defaultMessage="Go to Homepage" />
                                        </AppLink>
                                        <AppLink href={url.accountLogin()} className="btn btn-primary">
                                            <FormattedMessage id="GO_TO_LOGIN" defaultMessage="Go to Login" />
                                        </AppLink>
                                    </div>
                                </div>
                                            >
                                                <FormattedMessage id="I_HAVE_VERIFIED" defaultMessage="I've verified my email" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
