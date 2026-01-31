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
import { Search20Svg, ArrowRoundedLeft7x11Svg } from "~/svg";

interface Props {
    offcanvasSidebar: IShopPageOffCanvasSidebar;
    onCategoryClick?: () => void;
}

function WidgetVehicleCategories(props: Props) {
    const { offcanvasSidebar, onCategoryClick } = props;
    const intl = useIntl();
    const router = useRouter();
    const { tree, loading: categoriesLoading, error, findCategoryById, getBreadcrumb } = useCategoryTree();
    const [searchQuery, setSearchQuery] = useState("");

    // Get the current category ID from the URL
    const currentSlug = typeof router.query.slug === "string" ? router.query.slug : null;
    const currentCategoryId = currentSlug ? parseInt(currentSlug, 10) : null;

    // Check if we're on a products page (leaf category)
    const isProductsPage = router.asPath.includes('/products');

    // Find the current category in the tree
    const currentCategory = useMemo(() => {
        if (!currentCategoryId || !tree) return null;
        return findCategoryById(currentCategoryId);
    }, [currentCategoryId, tree, findCategoryById]);

    // Get parent category for back navigation
    const parentCategory = useMemo(() => {
        if (!currentCategory || !tree) return null;
        const breadcrumb = getBreadcrumb(currentCategory.id);
        // breadcrumb includes current category, so parent is second to last
        if (breadcrumb.length >= 2) {
            return breadcrumb[breadcrumb.length - 2];
        }
        return null; // No parent, we're at root level
    }, [currentCategory, tree, getBreadcrumb]);

    // Get the "display parent" - the category whose children we should show
    // On products page (leaf), this is the parent of the current category
    // On category page (has children), this is the current category itself
    const displayParent = useMemo(() => {
        if (!currentCategory) return null;
        
        // If we're on a products page or the current category has no children,
        // we should display siblings (parent's children)
        if (isProductsPage || currentCategory.children.length === 0) {
            return parentCategory;
        }
        
        // Otherwise, display the current category (show its children)
        return currentCategory;
    }, [currentCategory, parentCategory, isProductsPage]);

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

    // Get categories to display based on current navigation state
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

        // If we have a display parent, show its children
        if (displayParent) {
            return displayParent.children;
        }

        // If we're inside a category with children, show its children
        if (currentCategory && currentCategory.children.length > 0) {
            return currentCategory.children;
        }

        // Otherwise show root categories
        return tree;
    }, [tree, searchQuery, displayParent, currentCategory]);

    // Determine the back URL and display title
    const { backUrl, displayTitle } = useMemo(() => {
        // If we have a display parent (we're viewing its children)
        if (displayParent) {
            const breadcrumb = getBreadcrumb(displayParent.id);
            // Get the grandparent (parent of displayParent)
            const grandParent = breadcrumb.length >= 2 ? breadcrumb[breadcrumb.length - 2] : null;
            
            return {
                displayTitle: displayParent.name,
                backUrl: grandParent ? `/catalog/${grandParent.id}` : '/catalog'
            };
        }
        
        // Not inside any category
        return { backUrl: null, displayTitle: null };
    }, [displayParent, getBreadcrumb]);

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

    // Determine if we're in a subcategory view (not at root)
    const isInSubcategory = !!displayParent && !!displayTitle;

    return (
        <div className={rootClasses}>
            <div className="widget-vehicle-categories__header">
                {isInSubcategory && backUrl ? (
                    <AppLink href={backUrl} className="widget-vehicle-categories__back-link">
                        <span className="widget-vehicle-categories__back-arrow">
                            <ArrowRoundedLeft7x11Svg />
                        </span>
                        <h4 className="widget-vehicle-categories__title widget-vehicle-categories__title--with-back">
                            {displayTitle}
                        </h4>
                    </AppLink>
                ) : (
                    <h4 className="widget-vehicle-categories__title">
                        <FormattedMessage id="HEADER_CATEGORIES" defaultMessage="Kategorier" />
                    </h4>
                )}
            </div>
            <div className="widget-vehicle-categories__body">
                <div className="widget-vehicle-categories__search">
                    <div className="widget-vehicle-categories__search-icon">
                        <Search20Svg />
                    </div>
                    <input
                        type="text"
                        className="widget-vehicle-categories__search-input"
                        placeholder={intl.formatMessage({ id: "INPUT_SEARCH_CATEGORY_PLACEHOLDER", defaultMessage: "Sök efter en kategori" })}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="widget-vehicle-categories__list">
                    {displayCategories.map((category: ICategoryTreeNode) => {
                        const hasChildren = category.children.length > 0;
                        // Check if this is the currently active/selected subcategory
                        // When we're on products page, the slug param will match the current category
                        const isSelected = router.asPath.includes(`/catalog/${category.id}`);
                        
                        const itemClasses = classNames("widget-vehicle-categories__item", {
                            "widget-vehicle-categories__item--selected": isSelected,
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
