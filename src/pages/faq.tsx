// react
import React from 'react';
// third-party
import { FormattedMessage } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import url from '~/services/url';

function Page() {
    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="HEADER_FAQ" />
            </PageTitle>

            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block faq">
                <div className="container container--max--xl">
                    <div className="faq__header">
                        <h1 className="faq__header-title">
                            <FormattedMessage id="HEADER_FAQ" />
                        </h1>
                    </div>

                    <div className="faq__section">
                        <h3 className="faq__section-title">
                            <FormattedMessage id="HEADER_FAQ_SHIPPING" />
                        </h3>
                        <div className="faq__section-body">

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_SHIPPING_METHODS" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_INTERNATIONAL_SHIPPING" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_DELIVERY_DATE" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_SPLIT_ORDER" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="faq__section">
                        <h3 className="faq__section-title">
                            <FormattedMessage id="HEADER_FAQ_PAYMENT" />
                        </h3>
                        <div className="faq__section-body">
                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_PAYMENT_METHODS" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_SPLIT_PAYMENT" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="faq__section">
                        <h3 className="faq__section-title">
                            <FormattedMessage id="HEADER_FAQ_ORDERS_RETURNS" />
                        </h3>
                        <div className="faq__section-body">
                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_RETURN_EXCHANGE" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="faq__question">
                                <h5 className="faq__question-title">
                                    <FormattedMessage id="FAQ_Q_CANCEL_ORDER" />
                                </h5>
                                <div className="faq__question-answer">
                                    <div className="typography">
                                        <p>
                                            <FormattedMessage id="FAQ_A_PLACEHOLDER" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="faq__footer">
                        <div className="faq__footer-title">
                            <FormattedMessage id="TEXT_STILL_HAVE_QUESTIONS" />
                        </div>
                        <div className="faq__footer-subtitle">
                            <FormattedMessage id="TEXT_HAPPY_TO_ANSWER" />
                        </div>
                        <AppLink href={url.pageContactUs()} className="btn btn-primary">
                            <FormattedMessage id="LINK_CONTACT_US" />
                        </AppLink>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
