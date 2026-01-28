// react
import React, { useEffect, useState } from 'react';
// application
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useVehicleCatalog } from '~/hooks/useVehicleCatalog';
import { IVehicleCategory } from '~/api/car.api';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import { GetServerSideProps } from 'next';
import { useIntl } from 'react-intl';
import url from '~/services/url';

interface Props {
    subcategories: IShopCategory[];
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
        layout: vc.hasChildren ? 'categories' : 'products', // Show categories if hasChildren, products if leaf
        parent: null,
        children: [],
        customFields: {},
        hasChildren: vc.hasChildren, // Store hasChildren for navigation logic
    };
};

function CatalogPage(props: Props) {
    const { subcategories: defaultSubcategories } = props;
    const intl = useIntl();
    const { currentActiveCar } = useCurrentActiveCar();
    const [vehicleSubcategories, setVehicleSubcategories] = useState<IShopCategory[] | null>(null);
    
    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    const { categories: vehicleCategoriesResponse, loading: isLoadingCategories, hasActiveCar } = useVehicleCatalog({});

    // Convert vehicle categories to shop categories format
    useEffect(() => {
        if (vehicleCategoriesResponse && vehicleCategoriesResponse.categories.length > 0) {
            const converted = vehicleCategoriesResponse.categories.map(convertVehicleCategoryToShopCategory);
            setVehicleSubcategories(converted);
        } else if (vehicleCategoriesResponse && vehicleCategoriesResponse.categories.length === 0) {
            // Explicitly set empty array if API returned empty categories
            setVehicleSubcategories([]);
        } else if (!hasActiveCar) {
            // No active car, clear vehicle categories
            setVehicleSubcategories(null);
        }
    }, [vehicleCategoriesResponse, hasActiveCar]);

    // Determine which categories to show
    // - If there's an active car and we're loading, show nothing (will show loader)
    // - If there's an active car and loading is done, show vehicle categories (or empty array)
    // - If no active car, show default categories
    const shouldShowLoader = hasActiveCar && isLoadingCategories;
    const subcategories = hasActiveCar 
        ? (vehicleSubcategories !== null ? vehicleSubcategories : []) 
        : defaultSubcategories;

    const pageHeader = (
        <BlockHeader
            pageTitle={intl.formatMessage({ id: "HEADER_SHOP" })}
            breadcrumb={[
                { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
                { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
            ]}
        />
    );

    // Show loader while fetching vehicle categories
    // Also prevent rendering ShopPageCategory if we have an active car but categories are still loading
    if (shouldShowLoader || (hasActiveCar && vehicleSubcategories === null)) {
        return (
            <React.Fragment>
                <PageTitle>{intl.formatMessage({ id: "HEADER_SHOP" })}</PageTitle>
                {pageHeader}
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
        <ShopPageCategory
            layout="columns-4-sidebar"
            category={null}
            subcategories={subcategories}
        />
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
