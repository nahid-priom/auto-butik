// react
import React from "react";
// application
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockSpace from "~/components/blocks/BlockSpace";
import SEO from "~/components/shared/SEO";
import VehicleProductsView from "~/components/shop/VehicleProductsView";
import SearchProductsView from "~/components/shop/SearchProductsView";
import ShopSidebar from "~/components/shop/ShopSidebar";
import url from "~/services/url";
import { CurrentVehicleScopeProvider } from "~/services/current-vehicle";
import { SidebarProvider } from "~/services/sidebar";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import BlockVehicleHero from "~/components/blocks/BlockVehicleHero";
import { GetServerSideProps } from "next";

const MIN_SEARCH_LENGTH = 2;

function PageContent() {
    const intl = useIntl();
    const router = useRouter();
    const carModelID = typeof router.query.carModelID === "string" ? router.query.carModelID : null;
    const searchQuery = typeof router.query.search === "string" ? router.query.search.trim() : "";
    const isSearchPage = searchQuery.length >= MIN_SEARCH_LENGTH;

    const pageHeader = (
        <BlockHeader
            pageTitle={intl.formatMessage({ id: "HEADER_SHOP" })}
            breadcrumb={[
                { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ]}
        />
    );

    const sidebar = <ShopSidebar offcanvas="mobile" />;

    const pageTitle = searchQuery
        ? `Search Results for "${searchQuery}"`
        : intl.formatMessage({ id: "HEADER_SHOP" });
    const pageDescription = searchQuery
        ? `Products matching "${searchQuery}" for your vehicle.`
        : "Browse products for your vehicle.";

    if (!carModelID) {
        return null;
    }

    const content = isSearchPage ? (
        <SearchProductsView
            term={searchQuery}
            modelId={carModelID}
            layout="list"
            gridLayout="grid-3-sidebar"
            offCanvasSidebar="mobile"
        />
    ) : (
        <VehicleProductsView
            layout="list"
            gridLayout="grid-3-sidebar"
            offCanvasSidebar="mobile"
            modelIdOverride={carModelID}
        />
    );

    return (
        <React.Fragment>
            <SEO
                title={pageTitle}
                description={pageDescription}
                keywords="auto parts, vehicle parts, car parts"
                type="website"
            />
            <BlockVehicleHero />
            {pageHeader}

            <div className="block-split block-split--has-sidebar">
                <div className="container">
                    <div className="block-split__row row no-gutters">
                        <div className="block-split__item block-split__item-sidebar col-auto">{sidebar}</div>

                        <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                            <div className="block">{content}</div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

function Page() {
    return (
        <SidebarProvider>
            <CurrentVehicleScopeProvider>
                <PageContent />
            </CurrentVehicleScopeProvider>
        </SidebarProvider>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    return { props: {} };
};

export default Page;
