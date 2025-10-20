// react
import React from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import SEO from '~/components/shared/SEO';
import Terms from '~/components/shared/Terms';

function Page() {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="HEADER_TERMS_CONDITIONS" />
            </PageTitle>
            <SEO
                title={intl.formatMessage({ id: 'HEADER_TERMS_CONDITIONS' })}
                description="Read Autobutik's terms and conditions for purchasing auto parts. Learn about our policies on shipping, returns, warranties, and more."
                keywords="terms and conditions, terms of service, auto parts policies, purchase terms"
                type="website"
                noindex={false}
            />

            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block">
                <div className="container">
                    <div className="document">
                        <div className="document__header">
                            <h1 className="document__title">
                                <FormattedMessage id="HEADER_TERMS_CONDITIONS" />
                            </h1>
                            <div className="document__subtitle">
                                <FormattedMessage id="TEXT_AGREEMENT_LAST_MODIFIED" />
                            </div>
                        </div>
                        <div className="document__content card">
                            <div className="typography">
                                <Terms />

                                <div className="document__signature">
                                    <AppImage src="/images/signature.jpg" width="160" height="55" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
