// react
import React from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import SEO from '~/components/shared/SEO';
import theme from '~/data/theme';

function Page() {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="BUTTON_CONTACT_US" />
            </PageTitle>
            <SEO
                title={intl.formatMessage({ id: 'HEADER_CONTACT_US' })}
                description="Get in touch with Autobutik. We're here to help with your auto parts needs. Contact us by phone, email, or visit our location."
                keywords="contact autobutik, auto parts support, customer service"
                type="website"
            />

            <div className="block block--divider">
                <div className="container">
                    <div className="contacts">
                        <div className="contacts__text block">
                            <h1 className="contacts__title">
                                <FormattedMessage id="HEADER_CONTACT_US" />
                            </h1>
                            <div className="contacts__message">
                                <FormattedMessage id="TEXT_CONTACT_US_MESSAGE" />
                            </div>
                            <address className="footer-contacts__contacts">
                                <dl>
                                    <dt>
                                        <FormattedMessage id="TEXT_PHONE_NUMBER" />
                                    </dt>
                                    {theme.contacts.phone.map((item, index) => (
                                        <dd key={index}>{item}</dd>
                                    ))}
                                </dl>
                                <dl>
                                    <dt>
                                        <FormattedMessage id="TEXT_EMAIL_ADDRESS" />
                                    </dt>
                                    {theme.contacts.email.map((item, index) => (
                                        <dd key={index}>
                                            <a href={`mailto:${item}`}>{item}</a>
                                        </dd>
                                    ))}
                                </dl>
                                <dl>
                                    <dt>
                                        <FormattedMessage id="TEXT_OUR_LOCATION" />
                                    </dt>
                                    {theme.contacts.address.map((item, index) => (
                                        <dd key={index}>{item}</dd>
                                    ))}
                                </dl>
                                <dl>
                                    <dt>
                                        <FormattedMessage id="TEXT_WORKING_HOURS" />
                                    </dt>
                                    {theme.contacts.hours.map((item, index) => (
                                        <dd key={index}>{item}</dd>
                                    ))}
                                </dl>
                            </address>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
