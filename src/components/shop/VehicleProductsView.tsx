// react
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
// third-party
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
// application
import Navigation, { INavigationEvent } from "~/components/shared/Navigation";
import ProductCard from "~/components/shared/ProductCard";
import { isEmptyList } from "~/services/utils";
import { IShopPageGridLayout, IShopPageLayout, IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import { SidebarContext } from "~/services/sidebar";
import { useVehicleCatalog } from "~/hooks/useVehicleCatalog";
import { useVehicleCatalogContext } from "~/contexts/VehicleCatalogContext";
import { Filters16Svg, LayoutGrid16Svg, LayoutList16Svg } from "~/svg";
import { IVehicleProduct } from "~/api/car.api";
import { IProduct } from "~/interfaces/product";

interface LayoutButton {
    layout: IShopPageLayout;
    icon: React.ReactNode;
}

interface Props {
    layout: IShopPageLayout;
    gridLayout: IShopPageGridLayout;
    offCanvasSidebar: IShopPageOffCanvasSidebar;
    /** When set (e.g. from /catalog/products/[carModelID]), fetch products for this car instead of current active car */
    modelIdOverride?: string | null;
    /** If true, allow fetching products by collection even without an active car (uses "all" as modelId) */
    allowWithoutCar?: boolean;
}

// Convert vehicle product to IProduct format
const convertVehicleProductToIProduct = (vp: IVehicleProduct, index: number): IProduct => {
    const images: string[] = [];
    if (vp.imagePreview) {
        images.push(vp.imagePreview);
    } else {
        images.push('/images/products/product-placeholder.jpg');
    }

    const productId = typeof vp.productId === 'number' ? vp.productId : parseInt(String(vp.productId), 10);
    const brand = vp.brand
        ? {
              slug: (vp.brand.name || '').toLowerCase().replace(/\s+/g, '-'),
              name: vp.brand.name,
              image: vp.brand.imageUrl || '',
              country: '',
          }
        : null;

    return {
        id: productId || index,
        name: vp.productName,
        excerpt: vp.description || `Auto part: ${vp.productName}`,
        description: vp.description || `Auto part: ${vp.productName}`,
        slug: vp.slug,
        sku: vp.sku,
        partNumber: vp.sku,
        stock: 'in-stock' as const,
        price: vp.price,
        compareAtPrice: null,
        images,
        badges: [],
        rating: 5,
        reviews: 0,
        availability: 'in-stock' as const,
        compatibility: 'all' as const,
        brand: brand ?? null,
        tags: [],
        type: {
            name: 'Auto Part',
            slug: 'auto-part',
            attributeGroups: [],
            customFields: {},
        },
        categories: [],
        attributes: [],
        options: [],
        customFields: {
            tecDoc: vp.tecDoc,
            icIndex: vp.icIndex,
            technicalSpecs: vp.technicalSpecs ?? [],
            ean: vp.ean ?? null,
            specialFitment: vp.specialFitment ?? [],
        },
    };
};

function VehicleProductsView(props: Props) {
    const { layout: layoutProps, gridLayout, offCanvasSidebar, modelIdOverride, allowWithoutCar = false } = props;
    const intl = useIntl();
    const router = useRouter();
    const [, setSidebarIsOpen] = useContext(SidebarContext);
    const [layout, setLayout] = useState(layoutProps);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(24);
    
    // Get search query and collection identifier from URL
    // The value can come from query.collectionSlug, query.collectionId, or query.slug (when on /catalog/[slug]/products)
    const searchQuery = typeof router.query.search === "string" ? router.query.search : "";
    
    // Get the collection identifier from URL - could be an ID (numeric) or a slug (text)
    const collectionValue = typeof router.query.collectionId === "string" 
        ? router.query.collectionId
        : typeof router.query.collectionSlug === "string" 
            ? router.query.collectionSlug 
            : (typeof router.query.slug === "string" ? router.query.slug : "");
    
    // Determine if the value is a numeric ID or a text slug
    // If it's numeric, use collectionId; otherwise use collectionSlug
    const isNumericId = collectionValue !== "" && /^\d+$/.test(collectionValue);
    const collectionId = isNumericId ? collectionValue : undefined;
    const collectionSlug = isNumericId ? "" : collectionValue;

    const skip = (page - 1) * limit;

    // Check if we have a collection filter (needed for allowWithoutCar logic)
    const hasCollectionFilter = collectionSlug !== "" || (collectionId !== undefined && collectionId !== "");

    const { setFacets, selectedBrand, setSelectedBrand, selectedPosition, setSelectedPosition } = useVehicleCatalogContext();

    // Reset filters when switching category so the new category gets full facets
    useEffect(() => {
        setSelectedBrand(null);
        setSelectedPosition(null);
    }, [collectionId, collectionSlug, setSelectedBrand, setSelectedPosition]);

    // Fetch vehicle catalog data (brand and position from context, not URL)
    const {
        products: productsResponse,
        productsLoading: isLoading,
        error,
        hasActiveCar,
        canFetchProducts,
        lastFetchBrand,
        lastFetchPosition,
    } = useVehicleCatalog({
        skip,
        take: limit,
        term: searchQuery,
        collectionSlug,
        collectionId,
        brand: selectedBrand ?? undefined,
        position: selectedPosition ?? undefined,
        modelIdOverride,
        allowWithoutCar: allowWithoutCar && hasCollectionFilter,
    });

    // Only update facets from a response that was fetched WITHOUT brand or position filter
    useEffect(() => {
        if (productsResponse?.facets && lastFetchBrand === undefined && lastFetchPosition === undefined) {
            setFacets(productsResponse.facets);
        }
    }, [productsResponse?.facets, lastFetchBrand, lastFetchPosition, setFacets]);

    // Convert vehicle products to IProduct format
    const productsList = useMemo(() => {
        if (!productsResponse) {
            return null;
        }

        const convertedProducts = productsResponse.items.map((vp, index) =>
            convertVehicleProductToIProduct(vp, index)
        );

        const totalPages = Math.ceil(productsResponse.totalItems / limit);
        const from = skip + 1;
        const to = Math.min(skip + limit, productsResponse.totalItems);

        return {
            items: convertedProducts,
            page,
            limit,
            sort: "name_asc",
            total: productsResponse.totalItems,
            pages: totalPages,
            from,
            to,
            filters: [],
            navigation: {
                type: "page" as const,
                page,
                from,
                to,
                total: productsResponse.totalItems,
                limit,
                pages: totalPages,
            },
        };
    }, [productsResponse, page, limit, skip]);

    const navigation = productsList?.navigation;

    const handleLimitChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1); // Reset to first page when limit changes
    }, []);

    const onNavigate = useCallback((event: INavigationEvent) => {
        if (event.type === "page") {
            setPage(event.page);
        }
    }, []);

    const handleFiltersClick = () => {
        setSidebarIsOpen(true);
    };

    const layoutButtons: LayoutButton[] = useMemo(
        () => [
            { layout: "list", icon: <LayoutList16Svg /> },
            { layout: "grid", icon: <LayoutGrid16Svg /> },
        ],
        []
    );

    const rootClasses = classNames("products-view", {
        "products-view--loading": isLoading,
    });

    const viewOptionsClasses = classNames(
        "products-view__options",
        "view-options",
        `view-options--offcanvas--${offCanvasSidebar}`
    );

    const productListClasses = classNames("products-list", "products-view__list", {
        "products-list--grid--6": gridLayout === "grid-6-full",
        "products-list--grid--5": gridLayout === "grid-5-full",
        "products-list--grid--4": ["grid-4-full", "grid-4-sidebar"].includes(gridLayout),
        "products-list--grid--3": gridLayout === "grid-3-sidebar",
    });

    // Don't show if we can't fetch products (no active car, no modelId override, and no allowWithoutCar with collection filter)
    if (!canFetchProducts) {
        return null;
    }

    // Show error message if there's an error
    if (error) {
        return (
            <div className={rootClasses}>
                <div className="products-view__body">
                    <div className="products-view__empty">
                        <div className="products-view__empty-title">Error Loading Products</div>
                        <div className="products-view__empty-subtitle">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state or empty state
    if (isLoading || !productsList || !navigation) {
        return (
            <div className={rootClasses}>
                <div className="products-view__body">
                    <div className="products-view__loader" />
                </div>
            </div>
        );
    }

    return (
        <div className={rootClasses}>
            <div className="products-view__body">
                <div className="products-view__loader" />

                {isEmptyList(navigation) && (
                    <div className="products-view__empty">
                        <div className="products-view__empty-title">
                            <FormattedMessage id="TEXT_CATEGORY_IS_EMPTY_TITLE" />
                        </div>
                        <div className="products-view__empty-subtitle">
                            <FormattedMessage id="TEXT_CATEGORY_IS_EMPTY_SUBTITLE" />
                        </div>
                    </div>
                )}

                {!isEmptyList(navigation) && (
                    <React.Fragment>
                        <div className={viewOptionsClasses}>
                            <div className="view-options__body">
                                <button
                                    type="button"
                                    className="view-options__filters-button filters-button"
                                    onClick={handleFiltersClick}
                                >
                                    <span className="filters-button__icon">
                                        <Filters16Svg />
                                    </span>
                                    <span className="filters-button__title">
                                        <FormattedMessage id="BUTTON_FILTERS" />
                                    </span>
                                    <span className="filters-button__counter">0</span>
                                </button>

                                <div className="view-options__layout layout-switcher">
                                    <div className="layout-switcher__list">
                                        {layoutButtons.map((button) => {
                                            const buttonClasses = classNames("layout-switcher__button", {
                                                "layout-switcher__button--active": button.layout === layout,
                                            });

                                            return (
                                                <button
                                                    key={button.layout}
                                                    type="button"
                                                    className={buttonClasses}
                                                    onClick={() => setLayout(button.layout)}
                                                >
                                                    {button.icon}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="view-options__legend">
                                    {navigation.type === "page" && (
                                        <FormattedMessage
                                            id="TEXT_SHOWING_PRODUCTS"
                                            values={{
                                                from: navigation.from,
                                                to: navigation.to,
                                                total: navigation.total,
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="view-options__spring" />

                                <div className="view-options__select">
                                    <label htmlFor="view-option-limit">
                                        <FormattedMessage id="INPUT_LIMIT_LABEL" />:
                                    </label>
                                    <select
                                        id="view-option-limit"
                                        className="form-control form-control-sm"
                                        value={limit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="8">8</option>
                                        <option value="16">16</option>
                                        <option value="24">24</option>
                                        <option value="32">32</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div
                            className={productListClasses}
                            data-layout={layout === "grid-with-features" ? "grid" : layout}
                            data-with-features={layout === "grid-with-features" ? "true" : "false"}
                        >
                            <div className="products-list__head">
                                <div className="products-list__column products-list__column--image">
                                    <FormattedMessage id="TABLE_IMAGE" />
                                </div>
                                <div className="products-list__column products-list__column--meta">
                                    <FormattedMessage id="TABLE_SKU" />
                                </div>
                                <div className="products-list__column products-list__column--product">
                                    <FormattedMessage id="TABLE_PRODUCT" />
                                </div>
                                <div className="products-list__column products-list__column--rating">
                                    <FormattedMessage id="TABLE_RATING" />
                                </div>
                                <div className="products-list__column products-list__column--price">
                                    <FormattedMessage id="TABLE_PRICE" />
                                </div>
                            </div>
                            <div className="products-list__content">
                                {productsList.items.map((product) => (
                                    <div key={product.id} className="products-list__item">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="products-view__pagination">
                            <nav aria-label="Page navigation example">
                                {navigation && <Navigation data={navigation} page={page} onNavigate={onNavigate} />}
                            </nav>
                            <div className="products-view__pagination-legend">
                                {navigation.type === "page" && (
                                    <FormattedMessage
                                        id="TEXT_SHOWING_PRODUCTS"
                                        values={{
                                            from: navigation.from,
                                            to: navigation.to,
                                            total: navigation.total,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}

export default VehicleProductsView;
