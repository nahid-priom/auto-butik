// react
import React from 'react';
// application
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockCatalogHero from '~/components/blocks/BlockCatalogHero';
import PageTitle from '~/components/shared/PageTitle';
import WidgetCategoriesList from '~/components/widgets/WidgetCategoriesList';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useCategoryTree } from '~/contexts/CategoryTreeContext';
import { ICategoryTreeNode } from '~/api/car.api';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import { GetServerSideProps } from 'next';
import { useIntl } from 'react-intl';
import url from '~/services/url';

interface Props {
    subcategories: IShopCategory[];
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

function CatalogPage(props: Props) {
    const { subcategories: defaultSubcategories } = props;
    const intl = useIntl();
    const { currentActiveCar } = useCurrentActiveCar();
    const { tree, loading: isLoadingTree, error: treeError } = useCategoryTree();

    // Check if we have an active car
    const hasActiveCar = !!currentActiveCar?.data;

    // Convert tree root categories to shop categories format
    const treeCategories: IShopCategory[] = tree 
        ? tree.map(convertTreeNodeToShopCategory) 
        : [];

    // Always use the TecDoc category tree - fall back to default only if tree fails to load
    const subcategories = treeCategories.length > 0 ? treeCategories : defaultSubcategories;

    // Show loader while loading tree
    const isLoadingContent = isLoadingTree && treeCategories.length === 0;

    // Get car name for hero subtitle
    const carName = currentActiveCar?.data 
        ? `${(currentActiveCar.data as any).C_merke || ''} ${(currentActiveCar.data as any).C_modell || ''}`.trim()
        : null;

    return (
        <React.Fragment>
            <PageTitle>{intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
            <BlockCatalogHero 
                title={intl.formatMessage({ id: "HEADER_SHOP" })}
                subtitle={carName || undefined}
            />
            <BlockHeader
                breadcrumb={[
                    { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                    { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
                ]}
            />
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
            ) : treeError && subcategories.length === 0 ? (
                <div className="block block-split">
                    <div className="container">
                        <div className="alert alert-danger">
                            {intl.formatMessage({ id: "ERROR_LOADING_CATEGORIES" }, { defaultMessage: "Failed to load categories. Please try again." })}
                        </div>
                    </div>
                </div>
            ) : (
                <ShopPageCategory
                    layout="columns-4-sidebar"
                    category={null}
                    subcategories={subcategories}
                    hideHeader={true}
                />
            )}
        </React.Fragment>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    // Fetch default categories for fallback (when no car is selected)
    const subcategories = await shopApi.getCategories({ depth: 1 });

    return {
        props: {
            subcategories,
        },
    };
};

export default CatalogPage;
