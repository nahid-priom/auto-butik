// react
import React, { useEffect, useMemo } from "react";
// third-party
import { useRouter } from "next/router";
// application
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockSpace from "~/components/blocks/BlockSpace";
import BlockCatalogHero from "~/components/blocks/BlockCatalogHero";
import VehicleProductsView from "~/components/shop/VehicleProductsView";
import GraphQLProductsView from "~/components/shop/GraphQLProductsView";
import ShopSidebar from "~/components/shop/ShopSidebar";
import url from "~/services/url";
import { CurrentVehicleScopeProvider } from "~/services/current-vehicle";
import { SidebarProvider } from "~/services/sidebar";
import { useIntl } from "react-intl";
import { useCurrentActiveCar } from "~/contexts/CarContext";
import { useCategoryTree } from "~/contexts/CategoryTreeContext";
import PageTitle from "~/components/shared/PageTitle";
import { GetServerSideProps } from "next";
import { ILink } from "~/interfaces/link";

interface Props {
    slug: string | null;
}

function PageContent() {
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const { tree, loading: isLoadingTree, findCategoryById, getBreadcrumb } = useCategoryTree();
    const slug = typeof router.query.slug === "string" ? router.query.slug : null;

    // Parse the slug as category ID
    const categoryId = slug ? parseInt(slug, 10) : null;

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    // Find the current category in the tree
    const currentCategory = useMemo(() => {
        if (!categoryId || !tree) return null;
        return findCategoryById(categoryId);
    }, [categoryId, tree, findCategoryById]);

    // Build breadcrumb from tree
    const breadcrumbPath: ILink[] = useMemo(() => {
        if (!categoryId || !tree) {
            return [
                { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ];
        }

        const treeBreadcrumb = getBreadcrumb(categoryId);
        const breadcrumbLinks: ILink[] = treeBreadcrumb.map((node, index) => {
            // Last item is the current category (products page)
            const isLast = index === treeBreadcrumb.length - 1;
            return {
                title: node.name,
                url: isLast ? `/catalog/${node.id}/products` : `/catalog/${node.id}`,
            };
        });

        return [
            { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
            { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ...breadcrumbLinks,
        ];
    }, [categoryId, tree, getBreadcrumb, intl]);

    const categoryName = currentCategory?.name || "";

    const pageHeader = (
        <BlockHeader
            breadcrumb={breadcrumbPath}
        />
    );

    const sidebar = <ShopSidebar offcanvas="mobile" />;

    // If no slug (category), show regular GraphQL products view
    if (!slug) {
        return (
            <React.Fragment>
                {pageHeader}
                <div className="block-split block-split--has-sidebar block-split--catalog">
                    <div className="container">
                        <div className="block-split__row row no-gutters">
                            <div className="block-split__item block-split__item-sidebar col-auto">{sidebar}</div>
                            <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                                <div className="block">
                                    <GraphQLProductsView
                                        layout="grid"
                                        gridLayout="grid-3-sidebar"
                                        offCanvasSidebar="mobile"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BlockSpace layout="before-footer" />
            </React.Fragment>
        );
    }

    // Get car name for hero subtitle (only if active car)
    const carName = currentActiveCar?.data 
        ? `${(currentActiveCar.data as any).C_merke || ''} ${(currentActiveCar.data as any).C_modell || ''}`.trim()
        : null;

    // Show VehicleProductsView for category browsing
    // - With active car: filters products by vehicle compatibility (modelId from car)
    // - Without active car: shows all products in category (uses modelId="all")
    return (
        <React.Fragment>
            <PageTitle>{categoryName || intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
            <BlockCatalogHero 
                title={categoryName || intl.formatMessage({ id: "HEADER_SHOP" })}
                subtitle={carName || undefined}
            />
            {pageHeader}
            <div className="block-split block-split--has-sidebar block-split--catalog">
                <div className="container">
                    <div className="block-split__row row no-gutters">
                        <div className="block-split__item block-split__item-sidebar col-auto">{sidebar}</div>
                        <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                            <div className="block">
                                <VehicleProductsView
                                    layout="list"
                                    gridLayout="grid-3-sidebar"
                                    offCanvasSidebar="mobile"
                                    allowWithoutCar={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

function Page(props: Props) {
    const router = useRouter();
    const slug = typeof router.query.slug === "string" ? router.query.slug : props.slug;

    // Update router query to include collectionId or collectionSlug for VehicleProductsView
    // VehicleProductsView reads these from router.query
    useEffect(() => {
        if (slug) {
            const isNumericId = /^\d+$/.test(slug);
            const targetKey = isNumericId ? 'collectionId' : 'collectionSlug';
            const otherKey = isNumericId ? 'collectionSlug' : 'collectionId';
            
            if (router.query[targetKey] !== slug) {
                // Use replace to update query without adding to history
                const newQuery = { ...router.query };
                newQuery[targetKey] = slug;
                // Remove the other key if present to avoid confusion
                delete newQuery[otherKey];
                router.replace({
                    pathname: router.pathname,
                    query: newQuery,
                }, undefined, { shallow: true });
            }
        }
    }, [slug]);

    return (
        <SidebarProvider>
            <CurrentVehicleScopeProvider>
                <PageContent />
            </CurrentVehicleScopeProvider>
        </SidebarProvider>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const slug = typeof params?.slug === 'string' ? params.slug : null;

    return {
        props: {
            slug,
        },
    };
};

export default Page;
