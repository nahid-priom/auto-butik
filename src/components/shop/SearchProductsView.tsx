// react
import React, { useCallback, useContext, useMemo, useState } from "react";
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
import { useProductSearch } from "~/hooks/useProductSearch";
import { Filters16Svg, LayoutGrid16Svg, LayoutList16Svg } from "~/svg";
import { IVehicleProduct } from "~/api/car.api";
import { IProduct } from "~/interfaces/product";

interface LayoutButton {
    layout: IShopPageLayout;
    icon: React.ReactNode;
}

interface Props {
    term: string;
    modelId?: string | null;
    layout: IShopPageLayout;
    gridLayout: IShopPageGridLayout;
    offCanvasSidebar: IShopPageOffCanvasSidebar;
}

const convertVehicleProductToIProduct = (vp: IVehicleProduct, index: number): IProduct => {
    const images: string[] = [];
    if (vp.imagePreview) {
        images.push(vp.imagePreview);
    } else {
        images.push("/images/products/product-placeholder.jpg");
    }
    return {
        id: parseInt(vp.productId, 10) || index,
        name: vp.productName,
        excerpt: vp.description || `Auto part: ${vp.productName}`,
        description: vp.description || `Auto part: ${vp.productName}`,
        slug: vp.slug,
        sku: vp.sku,
        partNumber: vp.sku,
        stock: "in-stock" as const,
        price: vp.price,
        compareAtPrice: null,
        images,
        badges: [],
        rating: 5,
        reviews: 0,
        availability: "in-stock" as const,
        compatibility: "all" as const,
        brand: null,
        tags: [],
        type: {
            name: "Auto Part",
            slug: "auto-part",
            attributeGroups: [],
            customFields: {},
        },
        categories: [],
        attributes: [],
        options: [],
        customFields: {
            tecDoc: vp.tecDoc,
            icIndex: vp.icIndex,
        },
    };
};

function SearchProductsView(props: Props) {
    const { term, modelId, layout: layoutProps, gridLayout, offCanvasSidebar } = props;
    const intl = useIntl();
    const router = useRouter();
    const [, setSidebarIsOpen] = useContext(SidebarContext);
    const [layout, setLayout] = useState(layoutProps);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(24);

    const skip = (page - 1) * limit;

    const { data: searchResponse, loading: isLoading, error } = useProductSearch({
        term,
        modelId,
        skip,
        take: limit,
    });

    const productsList = useMemo(() => {
        if (!searchResponse) return null;
        const items = searchResponse.items.map((vp, index) => convertVehicleProductToIProduct(vp, index));
        const totalPages = Math.ceil(searchResponse.totalItems / limit);
        const from = skip + 1;
        const to = Math.min(skip + limit, searchResponse.totalItems);
        return {
            items,
            page,
            limit,
            sort: "name_asc" as const,
            total: searchResponse.totalItems,
            pages: totalPages,
            from,
            to,
            filters: [],
            navigation: {
                type: "page" as const,
                page,
                from,
                to,
                total: searchResponse.totalItems,
                limit,
                pages: totalPages,
            },
        };
    }, [searchResponse, page, limit, skip]);

    const navigation = productsList?.navigation;

    const handleLimitChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
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

    if (term.trim().length < 2) {
        return (
            <div className={rootClasses}>
                <div className="products-view__body">
                    <div className="products-view__empty">
                        <div className="products-view__empty-title">
                            <FormattedMessage
                                id="TEXT_SEARCH_MIN_CHARS"
                                defaultMessage="Enter at least {count} characters to search"
                                values={{ count: 2 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={rootClasses}>
                <div className="products-view__body">
                    <div className="products-view__empty">
                        <div className="products-view__empty-title">Error Loading Results</div>
                        <div className="products-view__empty-subtitle">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

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
                            <FormattedMessage id="TEXT_NO_SEARCH_RESULTS" defaultMessage="No products found" />
                        </div>
                        <div className="products-view__empty-subtitle">
                            <FormattedMessage id="TEXT_TRY_DIFFERENT_SEARCH" defaultMessage="Try a different search term" />
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
                                    <label htmlFor="search-view-option-limit">
                                        <FormattedMessage id="INPUT_LIMIT_LABEL" />:
                                    </label>
                                    <select
                                        id="search-view-option-limit"
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

export default SearchProductsView;
