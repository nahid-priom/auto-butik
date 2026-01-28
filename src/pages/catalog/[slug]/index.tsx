// react
import React, { useEffect, useState } from 'react';
// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
// application
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import SitePageNotFound from '~/components/site/SitePageNotFound';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useVehicleCatalog } from '~/hooks/useVehicleCatalog';
import { carApi } from '~/api/car.api';
import { IVehicleCategory } from '~/api/car.api';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import { useIntl } from 'react-intl';
import url from '~/services/url';
import { buildCategoryBreadcrumb } from '~/utils/categoryBreadcrumb';
import { ILink } from '~/interfaces/link';

interface Props {
    slug: string | null;
}

// Convert vehicle category to IShopCategory format
const convertVehicleCategoryToShopCategory = (vc: IVehicleCategory): IShopCategory & { hasChildren?: boolean } => {
    return {
        id: parseInt(vc.id, 10) || 0,
        type: 'shop',
        name: vc.name,
        slug: vc.slug,
        image: vc.image,
        items: vc.productCount,
        layout: vc.hasChildren ? 'categories' : 'products',
        parent: null,
        children: [],
        customFields: {},
        hasChildren: vc.hasChildren,
    };
};

function CatalogSlugPage(props: Props) {
    const { slug } = props;
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const [subcategories, setSubcategories] = useState<IShopCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState<IVehicleCategory | null>(null);
    const [parentId, setParentId] = useState<number | null>(null);
    const [allCategories, setAllCategories] = useState<IVehicleCategory[]>([]);
    const [breadcrumb, setBreadcrumb] = useState<ILink[]>([]);

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    // Find parent category ID by slug
    useEffect(() => {
        if (!slug || !modelId) {
            setLoading(false);
            return;
        }

        const findCategoryAndLoadSubcategories = async () => {
            try {
                setLoading(true);
                // First, get all categories (flat list) to build breadcrumb path
                const allCategoriesResponse = await carApi.getCategoriesForVehicle(modelId, 'all');
                setAllCategories(allCategoriesResponse.categories);
                
                // Find the category matching the slug
                const matchingCategory = allCategoriesResponse.categories.find(cat => cat.slug === slug);
                
                if (!matchingCategory) {
                    setLoading(false);
                    return;
                }

                setCategoryInfo(matchingCategory);
                setParentId(parseInt(matchingCategory.id, 10));

                // Build breadcrumb path
                const breadcrumbPath = buildCategoryBreadcrumb(allCategoriesResponse.categories, matchingCategory);
                setBreadcrumb([
                    { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                    { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
                    ...breadcrumbPath,
                ]);

                // If category has children, fetch subcategories
                if (matchingCategory.hasChildren) {
                    const subcategoriesResponse = await carApi.getCategoriesForVehicle(modelId, matchingCategory.id);
                    const converted = subcategoriesResponse.categories.map(convertVehicleCategoryToShopCategory);
                    setSubcategories(converted);
                } else {
                    // No children, redirect to products page
                    router.replace(`/catalog/${slug}/products`);
                    return;
                }
            } catch (error) {
                console.error('Error loading category:', error);
            } finally {
                setLoading(false);
            }
        };

        findCategoryAndLoadSubcategories();
    }, [slug, modelId, router]);

    // If no active car, show 404
    if (!modelId) {
        return <SitePageNotFound />;
    }

    // Show loading state
    if (loading) {
        return (
            <React.Fragment>
                <PageTitle>{categoryInfo?.name || intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
                <BlockHeader
                    pageTitle={categoryInfo?.name || intl.formatMessage({ id: "HEADER_SHOP" })}
                    breadcrumb={breadcrumb.length > 0 ? breadcrumb : [
                        { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                        { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
                    ]}
                />
                <div className="block">
                    <div className="container">
                        <div className="block-categories block-categories--loading-catalog" style={{ position: 'relative', minHeight: '500px' }}>
                            <div className="block-categories__loader-overlay">
                                <div className="block-categories__loader-spinner" />
                            </div>
                        </div>
                    </div>
                </div>
                <BlockSpace layout="before-footer" />
            </React.Fragment>
        );
    }

    // If category not found or has no children (should have redirected)
    if (!categoryInfo || (!categoryInfo.hasChildren && subcategories.length === 0)) {
        return <SitePageNotFound />;
    }

    // Ensure breadcrumb is set (fallback if not set yet)
    const finalBreadcrumb = breadcrumb.length > 0 ? breadcrumb : [
        { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
        { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
        { title: categoryInfo.name, url: `/catalog/${categoryInfo.slug}` },
    ];

    // Only render content if we have subcategories loaded (prevent dummy data flash)
    // If category has children but we don't have subcategories yet, show loader
    if (loading || (categoryInfo.hasChildren && subcategories.length === 0)) {
        return (
            <React.Fragment>
                <PageTitle>{categoryInfo.name}</PageTitle>
                <BlockHeader
                    pageTitle={categoryInfo.name}
                    breadcrumb={finalBreadcrumb}
                />
                <div className="block">
                    <div className="container">
                        <div className="block-categories block-categories--loading-catalog" style={{ position: 'relative', minHeight: '500px' }}>
                            <div className="block-categories__loader-overlay">
                                <div className="block-categories__loader-spinner" />
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
            <PageTitle>{categoryInfo.name}</PageTitle>
            <BlockHeader
                pageTitle={categoryInfo.name}
                breadcrumb={finalBreadcrumb}
            />
            <ShopPageCategory
                layout="columns-4-sidebar"
                category={{
                    id: parseInt(categoryInfo.id, 10),
                    type: 'shop',
                    name: categoryInfo.name,
                    slug: categoryInfo.slug,
                    image: categoryInfo.image,
                    items: categoryInfo.productCount,
                    layout: 'categories',
                    parent: null,
                    children: [],
                    customFields: {},
                }}
                subcategories={subcategories}
                hideHeader={true}
            />
        </React.Fragment>
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

export default CatalogSlugPage;
