// react
import React from 'react';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import GraphQLProductsView from '~/components/shop/GraphQLProductsView';
import ShopSidebar from '~/components/shop/ShopSidebar';
import url from '~/services/url';
import { CurrentVehicleScopeProvider } from '~/services/current-vehicle';
import { SidebarProvider } from '~/services/sidebar';
import { useIntl } from 'react-intl';

function Page() {
    const intl = useIntl();

    const pageHeader = (
        <BlockHeader 
            pageTitle={intl.formatMessage({ id: 'HEADER_SHOP' })}
            breadcrumb={[
                { title: intl.formatMessage({ id: 'LINK_HOME' }), url: url.home() },
                { title: intl.formatMessage({ id: 'LINK_SHOP' }), url: url.shop() },
            ]}
        />
    );

    const sidebar = (
        <ShopSidebar offcanvas="mobile" />
    );

    return (
        <React.Fragment>
            <SidebarProvider>
                <CurrentVehicleScopeProvider>
                    {pageHeader}

                    <div className="block-split block-split--has-sidebar">
                        <div className="container">
                            <div className="block-split__row row no-gutters">
                                <div className="block-split__item block-split__item-sidebar col-auto">
                                    {sidebar}
                                </div>

                                <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                                    <div className="block">
                                        <GraphQLProductsView
                                            layout="grid"
                                            gridLayout="grid-4-sidebar"
                                            offCanvasSidebar="mobile"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BlockSpace layout="before-footer" />
                </CurrentVehicleScopeProvider>
            </SidebarProvider>
        </React.Fragment>
    );
}

export default Page;
