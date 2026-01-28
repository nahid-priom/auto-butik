// react
import React, { useEffect, useMemo, useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import url from '~/services/url';
import WidgetCategoriesList from '~/components/widgets/WidgetCategoriesList';
import WidgetVehicleCategories from '~/components/widgets/WidgetVehicleCategories';
import { getCategoryPath } from '~/services/utils';
import { IBrand } from '~/interfaces/brand';
import { IShopCategoryPageLayout, IShopCategoryPageSidebarPosition } from '~/interfaces/pages';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import { useCurrentActiveCar } from '~/contexts/CarContext';

interface Props {
    layout: IShopCategoryPageLayout;
    sidebarPosition?: IShopCategoryPageSidebarPosition;
    category?: IShopCategory | null;
    subcategories?: IShopCategory[];
    hideHeader?: boolean; // If true, don't render BlockHeader (parent handles it)
}

function ShopPageCategory(props: Props) {
    const intl = useIntl();
    const { layout, sidebarPosition = 'start', category, hideHeader = false } = props;
    let { subcategories } = props;
    const hasSidebar = layout.endsWith('-sidebar');
    const [brands, setBrands] = useState<IBrand[]>([]);
    const { currentActiveCar } = useCurrentActiveCar();
    
    // Check if there's an active car
    const hasActiveCar = !!currentActiveCar?.data && 'modell_id' in currentActiveCar.data;

    if (category && subcategories === undefined) {
        subcategories = category.children || [];
    }

    subcategories = subcategories || [];

    useEffect(() => {
        let canceled = false;

        shopApi.getBrands({ limit: (hasSidebar ? 7 : 8) * 2 }).then((result) => {
            if (canceled) {
                return;
            }

            setBrands(result);
        });

        return () => {
            canceled = true;
        };
    }, [hasSidebar]);

    const pageTitle = useMemo(() => (
        category ? category.name : intl.formatMessage({ id: 'HEADER_SHOP' })
    ), [category, intl]);

    const breadcrumb = useMemo(() => [
        { title: intl.formatMessage({ id: 'LINK_HOME' }), url: url.home() },
        { title: intl.formatMessage({ id: 'LINK_SHOP' }), url: url.shop() },
        ...getCategoryPath(category).map((x) => ({ title: x.name, url: url.category(x) })),
    ], [category, intl]);

    let sidebar = null;

    if (hasSidebar) {
        sidebar = (
            <div className="block-split__item block-split__item-sidebar col-auto">
                {hasActiveCar ? (
                    // Use WidgetVehicleCategories when there's an active car
                    <WidgetVehicleCategories offcanvasSidebar="none" />
                ) : (
                    // Use WidgetCategoriesList for default categories
                    subcategories.length > 0 && (
                        <WidgetCategoriesList
                            categories={subcategories}
                        />
                    )
                )}
            </div>
        );
    }

    // Always show categories as cards for consistent design
    const showAsCards = subcategories.length > 0 && layout.includes('columns');
    
    const subcategoriesTemplate = subcategories.length === 0 ? null : (
        <React.Fragment>
            <div className="block">
                {showAsCards ? (
                    // Display as category cards grid (consistent for both root and subcategories)
                    <div className={`block-categories block-categories--layout--${layout}`}>
                        <div className="container">
                            <div className="block-categories__list">
                                {subcategories.map((subcategory) => (
                                    <div
                                        key={subcategory.id}
                                        className="block-categories__item category-card category-card--layout--classic"
                                    >
                                        <AppLink 
                                            href={
                                                (subcategory as any).hasChildren 
                                                    ? `/catalog/${subcategory.slug}`
                                                    : `/catalog/${subcategory.slug}/products`
                                            }
                                            className="category-card__body"
                                        >
                                            <div className="category-card__image">
                                                {subcategory.image ? (
                                                    <AppImage
                                                        className="category-card__image-tag"
                                                        src={subcategory.image}
                                                        alt={subcategory.name}
                                                    />
                                                ) : (
                                                    <div className="category-card__image-placeholder">
                                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="category-card__name">
                                                {subcategory.name}
                                            </div>
                                        </AppLink>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Fallback to list if layout doesn't support columns
                    <div className={`categories-list categories-list--layout--${layout}`}>
                        <ul className="categories-list__body">
                            {subcategories.map((subcategory) => (
                                <React.Fragment key={subcategory.id}>
                                    <li
                                        className={classNames('categories-list__item', {
                                            'categories-list__item--has-image': subcategory.image,
                                        })}
                                    >
                                        <AppLink href={
                                            (subcategory as any).hasChildren 
                                                ? `/catalog/${subcategory.slug}`
                                                : `/catalog/${subcategory.slug}/products`
                                        }>
                                            {subcategory.image && (
                                                <div className="image image--type--category">
                                                    <div className="image__body">
                                                        <AppImage
                                                            className="image__tag"
                                                            src={subcategory.image}
                                                            alt={subcategory.name}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="categories-list__item-name">
                                                {subcategory.name}
                                            </div>
                                        </AppLink>
                                        {typeof subcategory.items === 'number' && (
                                            <div className="categories-list__item-products">
                                                <FormattedMessage
                                                    id="TEXT_PRODUCTS_COUNT"
                                                    values={{ count: subcategory.items }}
                                                />
                                            </div>
                                        )}
                                    </li>
                                    <li className="categories-list__divider" />
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <BlockSpace layout="divider-nl" />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <PageTitle>{pageTitle}</PageTitle>

            {!hideHeader && (
                <BlockHeader
                    pageTitle={pageTitle}
                    breadcrumb={breadcrumb}
                />
            )}

            <div
                className={classNames('block', 'block-split', {
                    'block-split--has-sidebar': hasSidebar,
                })}
            >
                <div className="container">
                    <div className="block-split__row row no-gutters">
                        {hasSidebar && sidebarPosition === 'start' && sidebar}

                        <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                            {subcategoriesTemplate}

                            <BlockBrands
                                layout={hasSidebar ? 'columns-7-sidebar' : 'columns-8-full'}
                                brands={brands}
                            />
                        </div>

                        {hasSidebar && sidebarPosition === 'end' && sidebar}
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default ShopPageCategory;
