// react
import React, { useEffect, useState } from "react";
// third-party
import { useRouter } from "next/router";
// application
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockSpace from "~/components/blocks/BlockSpace";
import VehicleProductsView from "~/components/shop/VehicleProductsView";
import GraphQLProductsView from "~/components/shop/GraphQLProductsView";
import ShopSidebar from "~/components/shop/ShopSidebar";
import url from "~/services/url";
import { CurrentVehicleScopeProvider } from "~/services/current-vehicle";
import { SidebarProvider } from "~/services/sidebar";
import { useIntl } from "react-intl";
import { useCurrentActiveCar } from "~/contexts/CarContext";
import { carApi } from "~/api/car.api";
import { IVehicleCategory } from "~/api/car.api";
import PageTitle from "~/components/shared/PageTitle";
import SitePageNotFound from "~/components/site/SitePageNotFound";
import { GetServerSideProps } from "next";
import { buildCategoryBreadcrumb } from "~/utils/categoryBreadcrumb";
import { ILink } from "~/interfaces/link";

interface Props {
    slug: string | null;
}

function PageContent() {
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const [categoryName, setCategoryName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [breadcrumb, setBreadcrumb] = useState<ILink[]>([]);
    const slug = typeof router.query.slug === "string" ? router.query.slug : null;

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    // Fetch category name for breadcrumb
    useEffect(() => {
        if (!slug || !modelId) {
            setLoading(false);
            return;
        }

        const fetchCategoryName = async () => {
            try {
                // Get all categories to build breadcrumb path
                const allCategoriesResponse = await carApi.getCategoriesForVehicle(modelId, 'all');
                const matchingCategory = allCategoriesResponse.categories.find(cat => cat.slug === slug);
                if (matchingCategory) {
                    setCategoryName(matchingCategory.name);
                    
                    // Build breadcrumb path
                    const breadcrumbPath = buildCategoryBreadcrumb(allCategoriesResponse.categories, matchingCategory);
                    setBreadcrumb([
                        { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                        { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
                        ...breadcrumbPath,
                    ]);
                }
            } catch (error) {
                console.error('Error fetching category name:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryName();
    }, [slug, modelId]);

    // Build breadcrumb with full category path
    const finalBreadcrumb = breadcrumb.length > 0 ? breadcrumb : [
        { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
        { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
        ...(categoryName ? [{ title: categoryName, url: `/catalog/${slug}/products` }] : []),
    ];

    const pageHeader = (
        <BlockHeader
            pageTitle={categoryName || intl.formatMessage({ id: "HEADER_SHOP" })}
            breadcrumb={finalBreadcrumb}
        />
    );

    const sidebar = <ShopSidebar offcanvas="mobile" />;

    // If no active car, show regular products view
    if (!modelId || !slug) {
        return (
            <React.Fragment>
                {pageHeader}
                <div className="block-split block-split--has-sidebar">
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

    return (
        <React.Fragment>
            <PageTitle>{categoryName || intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
            {pageHeader}
            <div className="block-split block-split--has-sidebar">
                <div className="container">
                    <div className="block-split__row row no-gutters">
                        <div className="block-split__item block-split__item-sidebar col-auto">{sidebar}</div>
                        <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                            <div className="block">
                                <VehicleProductsView
                                    layout="list"
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

function Page(props: Props) {
    const router = useRouter();
    const slug = typeof router.query.slug === "string" ? router.query.slug : props.slug;

    // Update router query to include collectionSlug for VehicleProductsView
    // VehicleProductsView reads collectionSlug from router.query
    useEffect(() => {
        if (slug && router.query.collectionSlug !== slug) {
            // Use replace to update query without adding to history
            const newQuery = { ...router.query };
            newQuery.collectionSlug = slug;
            router.replace({
                pathname: router.pathname,
                query: newQuery,
            }, undefined, { shallow: true });
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
