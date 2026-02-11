// react
import React from "react";
// application
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockSpace from "~/components/blocks/BlockSpace";
import SEO from "~/components/shared/SEO";
import GraphQLProductsView from "~/components/shop/GraphQLProductsView";
import VehicleProductsView from "~/components/shop/VehicleProductsView";
import SearchProductsView from "~/components/shop/SearchProductsView";
import ShopSidebar from "~/components/shop/ShopSidebar";
import url from "~/services/url";
import { CurrentVehicleScopeProvider } from "~/services/current-vehicle";
import { SidebarProvider } from "~/services/sidebar";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import BlockVehicleHero from "~/components/blocks/BlockVehicleHero";
import { useCurrentActiveCar } from "~/contexts/CarContext";

const MIN_SEARCH_LENGTH = 2;

function PageContent() {
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const searchQuery = typeof router.query.search === "string" ? router.query.search.trim() : "";
    const hasActiveCar = !!currentActiveCar;
    const isSearchPage = searchQuery.length >= MIN_SEARCH_LENGTH;
    
    // Check if there's a collection filter from megamenu (collectionSlug or collectionId)
    const hasCollectionFilter = 
        typeof router.query.collectionSlug === "string" || 
        typeof router.query.collectionId === "string";

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

    // Dynamic title and description based on search
    const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : intl.formatMessage({ id: "HEADER_SHOP" });

    const pageDescription = searchQuery
        ? `Browse auto parts matching "${searchQuery}". Quality products with fast delivery.`
        : "Shop quality auto parts for all makes and models. Browse our extensive catalog of brake pads, filters, engine parts, and more.";

    // Determine which view to use:
    // 1. Search query present → SearchProductsView (REST API)
    // 2. Collection filter from megamenu → VehicleProductsView (REST API, with or without car)
    // 3. Active car → VehicleProductsView (REST API, filtered by car)
    // 4. No car, no collection → GraphQLProductsView (fallback)
    const content =
        isSearchPage ? (
            <SearchProductsView
                term={searchQuery}
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
            />
        ) : hasCollectionFilter || hasActiveCar ? (
            // Use REST API for collection browsing (with or without car)
            // If car is active, products are filtered by vehicle compatibility
            // If no car, allowWithoutCar=true uses "all" to show all products in collection
            <VehicleProductsView
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
                allowWithoutCar={hasCollectionFilter}
            />
        ) : (
            <GraphQLProductsView
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
            />
        );

    return (
        <React.Fragment>
            <SEO
                title={pageTitle}
                description={pageDescription}
                keywords="auto parts catalog, car parts shop, vehicle parts, automotive parts, brake pads, filters, engine parts"
                type="website"
            />
            <BlockVehicleHero />
            {pageHeader}

            <div className="block-split block-split--has-sidebar block-split--catalog">
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

export default Page;
