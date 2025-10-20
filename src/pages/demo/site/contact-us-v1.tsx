// react
import React from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockMap from '~/components/blocks/BlockMap';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
// data
import theme from '~/data/theme';

function Page() {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="LINK_CONTACT_US" />
            </PageTitle>

            <BlockMap />

            <BlockHeader
                pageTitle={intl.formatMessage({ id: 'LINK_CONTACT_US' })}
                breadcrumb={[
                    { title: intl.formatMessage({ id: 'TEXT_HOME' }), url: '' },
                    { title: intl.formatMessage({ id: 'TEXT_BREADCRUMB' }), url: '' },
                    { title: intl.formatMessage({ id: 'TEXT_CURRENT_PAGE' }), url: '' },
                ]}
                afterHeader={false}
            />

            <div className="block">
                <div className="container container--max--lg">
                    <div className="card">
                        <div className="card-body card-body--padding--2">
                            <div className="row">
                                <div className="col-12 col-lg-6 pb-4 pb-lg-0">
                                    <div className="mr-1">
                                        <h4 className="contact-us__header card-title">
                                            <FormattedMessage id="HEADER_CONTACT_OUR_ADDRESS" />
                                        </h4>

                                        <div className="contact-us__address">
                                            <p>
                                                <FormattedMessage id="TEXT_CONTACT_ADDRESS_PLACEHOLDER" />
                                                <br />
                                                {`Email: ${theme.contacts.email[0]}`}
                                                <br />
                                                <FormattedMessage id="TEXT_CONTACT_PHONE_LABEL" />
                                            </p>

                                            <p>
                                                <strong>
                                                    <FormattedMessage id="HEADER_OPENING_HOURS" />
                                                </strong>
                                                <br />
                                                <FormattedMessage id="TEXT_MONDAY_TO_FRIDAY" />
                                                <br />
                                                <FormattedMessage id="TEXT_SATURDAY" />
                                                <br />
                                                <FormattedMessage id="TEXT_SUNDAY" />
                                            </p>

                                            <p>
                                                <strong>
                                                    <FormattedMessage id="TEXT_COMMENT" />
                                                </strong>
                                                <br />
                                                <FormattedMessage id="TEXT_LOREM_PLACEHOLDER" />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="ml-1">
                                        <h4 className="contact-us__header card-title">
                                            <FormattedMessage id="HEADER_CONTACT_LEAVE_MESSAGE" />
                                        </h4>

                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-name">
                                                        <FormattedMessage id="INPUT_YOUR_NAME_LABEL" />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="form-name"
                                                        className="form-control"
                                                        placeholder={intl.formatMessage({ id: 'INPUT_YOUR_NAME_PLACEHOLDER' })}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-email">
                                                        <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="form-email"
                                                        className="form-control"
                                                        placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_ADDRESS_PLACEHOLDER' })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-subject">
                                                    <FormattedMessage id="INPUT_SUBJECT_LABEL" />
                                                </label>
                                                <input
                                                    type="text"
                                                    id="form-subject"
                                                    className="form-control"
                                                    placeholder={intl.formatMessage({ id: 'INPUT_SUBJECT_PLACEHOLDER' })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-message">
                                                    <FormattedMessage id="INPUT_MESSAGE_LABEL" />
                                                </label>
                                                <textarea
                                                    id="form-message"
                                                    className="form-control"
                                                    rows={4}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                <FormattedMessage id="BUTTON_SEND_MESSAGE" />
                                            </button>
                                        </form>
                                    </div>
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
