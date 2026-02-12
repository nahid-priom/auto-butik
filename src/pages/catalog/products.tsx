// react
import React, { useContext, useMemo } from "react";
// application
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockSpace from "~/components/blocks/BlockSpace";
import SEO from "~/components/shared/SEO";
import BlockCatalogHero from "~/components/blocks/BlockCatalogHero";
import GraphQLProductsView from "~/components/shop/GraphQLProductsView";
import VehicleProductsView from "~/components/shop/VehicleProductsView";
import SearchProductsView from "~/components/shop/SearchProductsView";
import ShopSidebar from "~/components/shop/ShopSidebar";
import CatalogFiltersSidebar from "~/components/catalog/CatalogFiltersSidebar";
import url from "~/services/url";
import { CurrentVehicleScopeProvider } from "~/services/current-vehicle";
import { SidebarProvider } from "~/services/sidebar";
import { SidebarContext } from "~/services/sidebar";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useCurrentActiveCar } from "~/contexts/CarContext";
import { useCategoryTree } from "~/contexts/CategoryTreeContext";
import pageStyles from "./[slug]/CatalogProductsPage.module.scss";

const MIN_SEARCH_LENGTH = 2;

/** Renders CatalogFiltersSidebar for the mobile drawer and closes drawer on category click */
function CatalogFiltersDrawerContent({ title }: { title: string }) {
    const [, setSidebarOpen] = useContext(SidebarContext);
    return (
        <CatalogFiltersSidebar
            title={title}
            embedded
            onCategoryClick={() => setSidebarOpen(false)}
        />
    );
}

function PageContent() {
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const { tree, findCategoryById } = useCategoryTree();
    const searchQuery = typeof router.query.search === "string" ? router.query.search.trim() : "";
    const hasActiveCar = !!currentActiveCar;
    const isSearchPage = searchQuery.length >= MIN_SEARCH_LENGTH;

    const collectionIdParam = typeof router.query.collectionId === "string" ? router.query.collectionId : null;
    const hasCollectionFilter =
        typeof router.query.collectionSlug === "string" || !!collectionIdParam;

    const categoryId = collectionIdParam ? parseInt(collectionIdParam, 10) : null;
    const currentCategory = useMemo(() => {
        if (!categoryId || !tree || isNaN(categoryId)) return null;
        return findCategoryById(categoryId);
    }, [categoryId, tree, findCategoryById]);

    const heroTitle = currentCategory?.name ?? intl.formatMessage({ id: "HEADER_SHOP" });
    const sidebarTitle = currentCategory?.name ?? intl.formatMessage({ id: "HEADER_CATEGORIES", defaultMessage: "Kategorier" });

    const pageHeader = (
        <BlockHeader
            pageTitle={intl.formatMessage({ id: "HEADER_SHOP" })}
            breadcrumb={[
                { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ]}
        />
    );

    const sidebar = (
        <ShopSidebar
            offcanvas="mobile"
            contentOverride={<CatalogFiltersDrawerContent title={sidebarTitle} />}
        />
    );

    const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : intl.formatMessage({ id: "HEADER_SHOP" });
    const pageDescription = searchQuery
        ? `Browse auto parts matching "${searchQuery}". Quality products with fast delivery.`
        : "Shop quality auto parts for all makes and models. Browse our extensive catalog of brake pads, filters, engine parts, and more.";

    const content =
        isSearchPage ? (
            <SearchProductsView
                term={searchQuery}
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
                useCatalogLayout
            />
        ) : hasCollectionFilter || hasActiveCar ? (
            <VehicleProductsView
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
                allowWithoutCar={hasCollectionFilter}
                useCatalogLayout
            />
        ) : (
            <GraphQLProductsView
                layout="list"
                gridLayout="grid-3-sidebar"
                offCanvasSidebar="mobile"
                useCatalogLayout
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
            <BlockCatalogHero
                title={heroTitle}
                subtitle={currentActiveCar?.data ? `${(currentActiveCar.data as any).C_merke || ""} ${(currentActiveCar.data as any).C_modell || ""}`.trim() || undefined : undefined}
            />
            <div className={pageStyles.pageWrap}>
                {pageHeader}
                <div className={pageStyles.root}>
                    {sidebar}
                    <div className={pageStyles.container}>
                        <div className={pageStyles.layout}>
                            <div className={pageStyles.sidebarCol}>
                                <CatalogFiltersSidebar title={sidebarTitle} />
                            </div>
                            <main className={pageStyles.mainCol}>{content}</main>
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
