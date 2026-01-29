// react
import React, { useState, useMemo } from "react";
// third-party
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
// application
import { useVehicleCatalog } from "~/hooks/useVehicleCatalog";
import { IVehicleCategory } from "~/api/car.api";
import { IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import AppLink from "~/components/shared/AppLink";
import url from "~/services/url";
import { Search20Svg } from "~/svg";

interface Props {
    offcanvasSidebar: IShopPageOffCanvasSidebar;
    onCategoryClick?: () => void;
}

function WidgetVehicleCategories(props: Props) {
    const { offcanvasSidebar, onCategoryClick } = props;
    const intl = useIntl();
    const router = useRouter();
    const { categories, categoriesLoading, error, hasActiveCar } = useVehicleCatalog();
    const selectedSlug = typeof router.query.collectionSlug === "string" ? router.query.collectionSlug : null;
    const [searchQuery, setSearchQuery] = useState("");

    const rootClasses = classNames("widget", "widget-vehicle-categories", `widget-vehicle-categories--offcanvas--${offcanvasSidebar}`);

    // Filter categories based on search query
    const filteredCategories = useMemo(() => {
        if (!categories || !categories.categories) return [];
        if (!searchQuery.trim()) return categories.categories;
        
        const query = searchQuery.toLowerCase().trim();
        return categories.categories.filter((category: IVehicleCategory) =>
            category.name.toLowerCase().includes(query)
        );
    }, [categories, searchQuery]);

    // Don't show widget if no active car
    if (!hasActiveCar) {
        return null;
    }

    // Always render the widget structure to prevent disappearing
    // Show loading state - only when categories are loading, not products
    if (categoriesLoading && !categories) {
        return (
            <div className={rootClasses}>
                <div className="widget-vehicle-categories__header">
                    <h4 className="widget-vehicle-categories__title">
                        <FormattedMessage id="HEADER_SHOP" defaultMessage="Kategorier" />
                    </h4>
                </div>
                <div className="widget-vehicle-categories__body">
                    <div className="widget-vehicle-categories__loader">Loading categories...</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !categories) {
        return (
            <div className={rootClasses}>
                <div className="widget-vehicle-categories__header">
                    <h4 className="widget-vehicle-categories__title">
                        <FormattedMessage id="HEADER_SHOP" defaultMessage="Kategorier" />
                    </h4>
                </div>
                <div className="widget-vehicle-categories__body">
                    <div className="widget-vehicle-categories__error">{error}</div>
                </div>
            </div>
        );
    }

    // Show empty state only if we have no categories after loading is complete
    if (!categoriesLoading && (!categories || categories.categories.length === 0)) {
        return null;
    }

    const handleCategoryClick = () => {
        if (onCategoryClick) {
            onCategoryClick();
        }
    };

    return (
        <div className={rootClasses}>
            <div className="widget-vehicle-categories__header">
                <h4 className="widget-vehicle-categories__title">
                    <FormattedMessage id="HEADER_CATEGORIES" defaultMessage="Kategorier" />
                </h4>
            </div>
            <div className="widget-vehicle-categories__body">
                <div className="widget-vehicle-categories__search">
                    <div className="widget-vehicle-categories__search-icon">
                        <Search20Svg />
                    </div>
                    <input
                        type="text"
                        className="widget-vehicle-categories__search-input"
                        placeholder="Sök efter en kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="widget-vehicle-categories__list">
                    {filteredCategories.map((category: IVehicleCategory) => {
                        const isActive = selectedSlug === category.slug;
                        const itemClasses = classNames("widget-vehicle-categories__item", {
                            "widget-vehicle-categories__item--active": isActive,
                        });

                        return (
                            <div key={category.id} className={itemClasses}>
                                <AppLink
                                    href={
                                        category.hasChildren
                                            ? `/catalog/${category.slug}`
                                            : url.products({ collectionSlug: category.slug })
                                    }
                                    className="widget-vehicle-categories__link"
                                    onClick={handleCategoryClick}
                                >
                                    <span className="widget-vehicle-categories__name">{category.name}</span>
                                    <span className="widget-vehicle-categories__arrow">›</span>
                                </AppLink>
                            </div>
                        );
                    })}
                    {filteredCategories.length === 0 && searchQuery && (
                        <div className="widget-vehicle-categories__no-results">
                            <FormattedMessage id="TEXT_NO_CATEGORIES_FOUND" defaultMessage="Inga kategorier hittades" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(WidgetVehicleCategories);
