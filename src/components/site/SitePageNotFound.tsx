// react
import React from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import SEO from '~/components/shared/SEO';
import url from '~/services/url';

function SitePageNotFound() {
    const intl = useIntl();

    return (
        <React.Fragment>
            <PageTitle>
                <FormattedMessage id="HEADER_PAGE_NOT_FOUND" />
            </PageTitle>
            <SEO
                title={intl.formatMessage({ id: 'HEADER_PAGE_NOT_FOUND' })}
                description="The page you are looking for could not be found. Browse our auto parts catalog or use the search to find what you need."
                noindex={true}
            />

            <BlockSpace layout="spaceship-ledge-height" />

            <div className="block">
                <div className="container">
                    <div className="not-found">
                        <div className="not-found__404">
                            <FormattedMessage id="TEXT_ERROR_404" />
                        </div>

                        <div className="not-found__content">
                            <h1 className="not-found__title">
                                <FormattedMessage id="HEADER_PAGE_NOT_FOUND" />
                            </h1>

                            <p className="not-found__text">
                                <FormattedMessage id="TEXT_PAGE_NOT_FOUND_DESC" />
                                <br />
                                <FormattedMessage id="TEXT_TRY_USE_SEARCH" />
                            </p>

                            <form className="not-found__search">
                                <input
                                    type="text"
                                    className="not-found__search-input form-control"
                                    placeholder={intl.formatMessage({ id: 'INPUT_SEARCH_QUERY_PLACEHOLDER' })}
                                />
                                <button type="submit" className="not-found__search-button btn btn-primary">
                                    <FormattedMessage id="BUTTON_SEARCH" />
                                </button>
                            </form>

                            <p className="not-found__text">
                                <FormattedMessage id="TEXT_GO_HOME_TO_START_OVER" />
                            </p>

                            <AppLink href={url.home()} className="btn btn-secondary btn-sm">
                                <FormattedMessage id="BUTTON_GO_TO_HOME_PAGE" />
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>
            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default SitePageNotFound;
