// react
import React, {
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import Navigation, { INavigationEvent } from '~/components/shared/Navigation';
import ProductCard from '~/components/shared/ProductCard';
import { isEmptyList } from '~/services/utils';
import { IShopPageGridLayout, IShopPageLayout, IShopPageOffCanvasSidebar } from '~/interfaces/pages';
import { SidebarContext } from '~/services/sidebar';
import { useProducts } from '~/hooks/useProducts';
import {
    Filters16Svg,
    LayoutGrid16Svg,
    LayoutGridWithDetails16Svg,
    LayoutList16Svg,
    LayoutTable16Svg,
} from '~/svg';

interface LayoutButton {
    layout: IShopPageLayout;
    icon: React.ReactNode;
}

interface Props {
    layout: IShopPageLayout;
    gridLayout: IShopPageGridLayout;
    offCanvasSidebar: IShopPageOffCanvasSidebar;
}

function GraphQLProductsView(props: Props) {
    const { layout: layoutProps, gridLayout, offCanvasSidebar } = props;
    const intl = useIntl();
    const [, setSidebarIsOpen] = useContext(SidebarContext);
    const [layout, setLayout] = useState(layoutProps);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(24);
    const [sort, setSort] = useState('name_asc');

    // Fetch products using GraphQL (always show all products)
    const { products: productsList, loading: isLoading, error } = useProducts({
        page,
        limit,
        sort,
    });

    const navigation = productsList?.navigation;

    const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(event.target.value);
        setPage(1); // Reset to first page when sorting changes
    }, []);

    const handleLimitChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1); // Reset to first page when limit changes
    }, []);

    const onNavigate = useCallback((event: INavigationEvent) => {
        if (event.type === 'page') {
            setPage(event.page);
        }
    }, []);

    const handleFiltersClick = () => {
        setSidebarIsOpen(true);
    };

    const layoutButtons: LayoutButton[] = useMemo(() => [
        { layout: 'grid', icon: <LayoutGrid16Svg /> },
        { layout: 'grid-with-features', icon: <LayoutGridWithDetails16Svg /> },
        { layout: 'list', icon: <LayoutList16Svg /> },
        { layout: 'table', icon: <LayoutTable16Svg /> },
    ], []);

    const rootClasses = classNames('products-view', {
        'products-view--loading': isLoading,
    });

    const viewOptionsClasses = classNames(
        'products-view__options',
        'view-options',
        `view-options--offcanvas--${offCanvasSidebar}`,
    );

    const productListClasses = classNames(
        'products-view__list',
        'products-list',
        {
            'products-list--grid--6': gridLayout === 'grid-6-full',
            'products-list--grid--5': gridLayout === 'grid-5-full',
            'products-list--grid--4': ['grid-4-full', 'grid-4-sidebar'].includes(gridLayout),
            'products-list--grid--3': gridLayout === 'grid-3-sidebar',
        },
    );

    // Show error message if there's an error
    if (error) {
        return (
            <div className={rootClasses}>
                <div className="products-view__body">
                    <div className="products-view__empty">
                        <div className="products-view__empty-title">
                            Error Loading Products
                        </div>
                        <div className="products-view__empty-subtitle">
                            {error}
                        </div>
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
                                    <span className="filters-button__icon"><Filters16Svg /></span>
                                    <span className="filters-button__title">
                                        <FormattedMessage id="BUTTON_FILTERS" />
                                    </span>
                                    <span className="filters-button__counter">0</span>
                                </button>

                                <div className="view-options__layout layout-switcher">
                                    <div className="layout-switcher__list">
                                        {layoutButtons.map((button) => {
                                            const buttonClasses = classNames('layout-switcher__button', {
                                                'layout-switcher__button--active': button.layout === layout,
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
                                    {navigation.type === 'page' && (
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
                                    <label htmlFor="view-option-sort">
                                        <FormattedMessage id="INPUT_SORT_LABEL" />
                                        :
                                    </label>
                                    <select
                                        id="view-option-sort"
                                        className="form-control form-control-sm"
                                        value={sort}
                                        onChange={handleSortChange}
                                    >
                                        <option value="name_asc">
                                            {intl.formatMessage({ id: 'INPUT_SORT_OPTION_NAME_ASC' })}
                                        </option>
                                        <option value="name_desc">
                                            {intl.formatMessage({ id: 'INPUT_SORT_OPTION_NAME_DESC' })}
                                        </option>
                                        <option value="price_asc">
                                            Price: Low to High
                                        </option>
                                        <option value="price_desc">
                                            Price: High to Low
                                        </option>
                                    </select>
                                </div>

                                <div className="view-options__select">
                                    <label htmlFor="view-option-limit">
                                        <FormattedMessage id="INPUT_LIMIT_LABEL" />
                                        :
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
                            data-layout={layout === 'grid-with-features' ? 'grid' : layout}
                            data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
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
                                {navigation && (
                                    <Navigation
                                        data={navigation}
                                        page={page}
                                        onNavigate={onNavigate}
                                    />
                                )}
                            </nav>
                            <div className="products-view__pagination-legend">
                                {navigation.type === 'page' && (
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

export default GraphQLProductsView;
