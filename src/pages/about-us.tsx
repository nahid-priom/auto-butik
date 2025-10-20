// react
import React from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import BlockReviews from '~/components/blocks/BlockReviews';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockTeammates from '~/components/blocks/BlockTeammates';
import Decor from '~/components/shared/Decor';
import PageTitle from '~/components/shared/PageTitle';
import SEO from '~/components/shared/SEO';
import { baseUrl } from '~/services/utils';

function Page() {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="LINK_ABOUT_US" />
            </PageTitle>
            <SEO
                title={intl.formatMessage({ id: 'HEADER_ABOUT_US' })}
                description="Learn about Autobutik - your trusted source for quality auto parts. We provide fast delivery, competitive prices, and expert service for all your vehicle needs."
                keywords="about autobutik, auto parts supplier, car parts company, automotive parts store"
                type="website"
            />

            <div className="about">
                <div className="about__body">
                    <div className="about__image">
                        <div
                            className="about__image-bg"
                            style={{
                                backgroundImage: `url(${baseUrl('/images/about.jpg')})`,
                            }}
                        />
                        <Decor className="about__image-decor" type="bottom" />
                    </div>

                    <div className="about__card">
                        <div className="about__card-title">
                            <FormattedMessage id="HEADER_ABOUT_US" />
                        </div>
                        <div className="about__card-text">
                            <FormattedMessage id="TEXT_ABOUT_AUTOBUTIK_DESC" />
                        </div>
                        <div className="about__card-author">
                            <FormattedMessage id="TEXT_ABOUT_CEO_SIGNATURE" />
                        </div>
                        <div className="about__card-signature">
                            <AppImage src="/images/signature.jpg" width="160" height="55" />
                        </div>
                    </div>

                    <div className="about__indicators">
                        <div className="about__indicators-body">
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">350</div>
                                <div className="about__indicators-item-title">
                                    <FormattedMessage id="TEXT_STORES_AROUND_WORLD" />
                                </div>
                            </div>
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">80 000</div>
                                <div className="about__indicators-item-title">
                                    <FormattedMessage id="TEXT_ORIGINAL_AUTO_PARTS" />
                                </div>
                            </div>
                            <div className="about__indicators-item">
                                <div className="about__indicators-item-value">5 000</div>
                                <div className="about__indicators-item-title">
                                    <FormattedMessage id="TEXT_SATISFIED_CUSTOMERS" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="divider-xl" />

            <BlockTeammates />

            <BlockSpace layout="divider-xl" />

            <BlockReviews />

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
