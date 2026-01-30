// react
import React, { useEffect, useMemo } from 'react';
// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
// application
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import SitePageNotFound from '~/components/site/SitePageNotFound';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockCatalogHero from '~/components/blocks/BlockCatalogHero';
import PageTitle from '~/components/shared/PageTitle';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useCategoryTree } from '~/contexts/CategoryTreeContext';
import { ICategoryTreeNode } from '~/api/car.api';
import { IShopCategory } from '~/interfaces/category';
import { useIntl } from 'react-intl';
import url from '~/services/url';
import { ILink } from '~/interfaces/link';

interface Props {
    slug: string | null;
}

// Convert tree category node to IShopCategory format
const convertTreeNodeToShopCategory = (node: ICategoryTreeNode): IShopCategory & { hasChildren?: boolean } => {
    return {
        id: node.id,
        type: 'shop',
        name: node.name,
        slug: node.slug || String(node.id),
        image: node.image,
        items: node.productCount || 0,
        layout: node.children.length > 0 ? 'categories' : 'products',
        parent: null,
        children: [],
        customFields: {},
        hasChildren: node.children.length > 0,
    };
};

function CatalogSlugPage(props: Props) {
    const { slug } = props;
    const intl = useIntl();
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const { tree, loading: isLoadingTree, findCategoryById, getBreadcrumb } = useCategoryTree();

    // Parse the slug as category ID
    const categoryId = slug ? parseInt(slug, 10) : null;

    // Find the current category in the tree
    const currentCategory = useMemo(() => {
        if (!categoryId || !tree) return null;
        return findCategoryById(categoryId);
    }, [categoryId, tree, findCategoryById]);

    // Get subcategories (children of current category)
    const subcategories: IShopCategory[] = useMemo(() => {
        if (!currentCategory) return [];
        return currentCategory.children.map(convertTreeNodeToShopCategory);
    }, [currentCategory]);

    // Build breadcrumb from tree
    const breadcrumbPath: ILink[] = useMemo(() => {
        if (!categoryId || !tree) {
            return [
                { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ];
        }

        const treeBreadcrumb = getBreadcrumb(categoryId);
        const breadcrumbLinks: ILink[] = treeBreadcrumb.map((node, index) => ({
            title: node.name,
            url: `/catalog/${node.id}`,
        }));

        return [
            { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
            { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ...breadcrumbLinks,
        ];
    }, [categoryId, tree, getBreadcrumb, intl]);

    // Redirect to products page if this is a leaf category (no children)
    useEffect(() => {
        if (!isLoadingTree && currentCategory && currentCategory.children.length === 0) {
            // This is a leaf category, redirect to products
            router.replace(`/catalog/${slug}/products`);
        }
    }, [isLoadingTree, currentCategory, slug, router]);

    // Show loading state
    const isLoadingContent = isLoadingTree;

    // If loading is complete and category not found
    if (!isLoadingTree && !currentCategory) {
        return <SitePageNotFound />;
    }

    // Get car name for hero subtitle
    const carName = currentActiveCar?.data 
        ? `${(currentActiveCar.data as any).C_merke || ''} ${(currentActiveCar.data as any).C_modell || ''}`.trim()
        : null;

    return (
        <React.Fragment>
            <PageTitle>{currentCategory?.name || intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
            <BlockCatalogHero 
                title={currentCategory?.name || intl.formatMessage({ id: "HEADER_SHOP" })}
                subtitle={carName || undefined}
            />
            <BlockHeader breadcrumb={breadcrumbPath} />
            {isLoadingContent ? (
                <div className="block block-split block-split--has-sidebar">
                    <div className="container">
                        <div className="block-split__row row no-gutters">
                            {/* Sidebar */}
                            <div className="block-split__item block-split__item-sidebar col-auto">
                                {subcategories.length > 0 && (
                                    <WidgetCategoriesList categories={subcategories} />
                                )}
                            </div>
                            {/* Content area with loader */}
                            <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                                <div className="block">
                                    <div className="container">
                                        <div className="block-categories block-categories--loading-catalog" style={{ position: 'relative', minHeight: '500px' }}>
                                            <div className="block-categories__loader-overlay">
                                                <div className="block-categories__loader-spinner" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : currentCategory && currentCategory.children.length > 0 ? (
                <ShopPageCategory
                    layout="columns-4-sidebar"
                    category={{
                        id: currentCategory.id,
                        type: 'shop',
                        name: currentCategory.name,
                        slug: String(currentCategory.id),
                        image: null,
                        items: 0,
                        layout: 'categories',
                        parent: null,
                        children: [],
                        customFields: {},
                    }}
                    subcategories={subcategories}
                    hideHeader={true}
                />
            ) : null}
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
