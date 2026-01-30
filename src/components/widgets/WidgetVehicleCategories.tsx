// react
import React, { useState, useMemo } from "react";
// third-party
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
// application
import { useCategoryTree } from "~/contexts/CategoryTreeContext";
import { ICategoryTreeNode } from "~/api/car.api";
import { IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import AppLink from "~/components/shared/AppLink";
import { Search20Svg } from "~/svg";

interface Props {
    offcanvasSidebar: IShopPageOffCanvasSidebar;
    onCategoryClick?: () => void;
}

function WidgetVehicleCategories(props: Props) {
    const { offcanvasSidebar, onCategoryClick } = props;
    const intl = useIntl();
    const router = useRouter();
    const { tree, loading: categoriesLoading, error } = useCategoryTree();
    const [searchQuery, setSearchQuery] = useState("");

    // Get the current category ID from the URL
    const currentSlug = typeof router.query.slug === "string" ? router.query.slug : null;
    const currentCategoryId = currentSlug ? parseInt(currentSlug, 10) : null;

    const rootClasses = classNames("widget", "widget-vehicle-categories", `widget-vehicle-categories--offcanvas--${offcanvasSidebar}`);

    // Flatten tree for search functionality
    const flattenTree = (nodes: ICategoryTreeNode[]): ICategoryTreeNode[] => {
        let result: ICategoryTreeNode[] = [];
        for (const node of nodes) {
            result.push(node);
            if (node.children && node.children.length > 0) {
                result = result.concat(flattenTree(node.children));
            }
        }
        return result;
    };

    // Get categories to display (either root or current category's siblings/children)
    const displayCategories = useMemo(() => {
        if (!tree) return [];

        // If searching, search through all categories
        if (searchQuery.trim()) {
            const allCategories = flattenTree(tree);
            const query = searchQuery.toLowerCase().trim();
            return allCategories.filter((category: ICategoryTreeNode) =>
                category.name.toLowerCase().includes(query)
            );
        }

        // Otherwise show root categories
        return tree;
    }, [tree, searchQuery]);

    // Show loading state
    if (categoriesLoading && !tree) {
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
    if (error && !tree) {
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
    if (!categoriesLoading && (!tree || tree.length === 0)) {
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
                    {displayCategories.map((category: ICategoryTreeNode) => {
                        const isActive = currentCategoryId === category.id;
                        const hasChildren = category.children.length > 0;
                        const itemClasses = classNames("widget-vehicle-categories__item", {
                            "widget-vehicle-categories__item--active": isActive,
                        });

                        return (
                            <div key={category.id} className={itemClasses}>
                                <AppLink
                                    href={
                                        hasChildren
                                            ? `/catalog/${category.id}`
                                            : `/catalog/${category.id}/products`
                                    }
                                    className="widget-vehicle-categories__link"
                                    onClick={handleCategoryClick}
                                >
                                    <span className="widget-vehicle-categories__name">{category.name}</span>
                                    {hasChildren && (
                                        <span className="widget-vehicle-categories__arrow">›</span>
                                    )}
                                </AppLink>
                            </div>
                        );
                    })}
                    {displayCategories.length === 0 && searchQuery && (
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
