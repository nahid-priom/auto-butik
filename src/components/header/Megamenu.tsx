// react
import React, { useCallback, useMemo, useState } from "react";
// third-party
import classNames from "classnames";
// application
import AppImage from "~/components/shared/AppImage";
import AppLink from "~/components/shared/AppLink";
import { ILink } from "~/interfaces/link";
import { IMegamenu } from "~/interfaces/menu";
import { FormattedMessage } from "react-intl";

interface Props extends React.HTMLAttributes<HTMLElement> {
    menu: IMegamenu;
    onItemClick?: (item: ILink) => void;
}

/**
 * Static fallback image for items without custom image
 */
const STATIC_ICON = "/images/avatars/product.jpg";

/**
 * Get image path from customFields or use fallback
 */
const getItemImage = (item: ILink): string => {
    if (item.customFields?.image) {
        return item.customFields.image;
    }
    return STATIC_ICON;
};

function Megamenu(props: Props) {
    const { menu, onItemClick, className, ...rootProps } = props;
    const rootClasses = classNames("megamenu", className);

    const columns = Array.isArray(menu.columns) ? menu.columns : [];

    // Left categories: all top-level links from all columns
    const leftCategories = useMemo(() => {
        return columns.flatMap((col) => col.links || []);
    }, [columns]);

    // Check if any category has nested links (for two-column layout)
    const hasNestedMenus = useMemo(() => {
        return leftCategories.some((category) => category.links && category.links.length > 0);
    }, [leftCategories]);

    // State to track which left category is active (only for two-column layout)
    const [activeCategory, setActiveCategory] = useState(leftCategories[0] || null);

    // Get children of active category for right column
    const rightItems = useMemo(() => {
        if (!activeCategory || !activeCategory.links) return [];
        return activeCategory.links || [];
    }, [activeCategory]);

    // For single-column layout: get all items from all categories
    // If no nested links, use the leftCategories themselves as items
    const allItems = useMemo(() => {
        if (hasNestedMenus) return [];

        // For menus without nested links, we need to collect items differently
        // Check if there are any direct items in the columns structure
        const itemsFromColumns = columns.flatMap((column) => column.links?.flatMap((link) => link.links || []) || []);

        // If we found items in the nested structure, use them
        if (itemsFromColumns.length > 0) {
            return itemsFromColumns;
        }

        // Otherwise, use the leftCategories as items (for menus that only have top-level categories)
        return leftCategories;
    }, [leftCategories, hasNestedMenus, columns]);

    const handleLeftCategoryClick = useCallback(
        (category: ILink & { links?: ILink[] }) => {
            setActiveCategory(category);
            onItemClick?.(category);
        },
        [onItemClick]
    );

    // Single column layout - all items shown in grid (when no nested menus)
    if (!hasNestedMenus) {
        return (
            <div className={rootClasses} {...rootProps}>
                <div className="main-menu__megamenu-inner">
                    <div className="main-menu__megamenu-full">
                        <div className="mm-blocks">
                            <div className="mm-blocks-grid mm-blocks-grid--single">
                                {allItems.map((item, index) => {
                                    const titleStr = typeof item.title === "string" ? item.title : "";
                                    const title =
                                        typeof item.title === "string" ? (
                                            <FormattedMessage id={item.title} />
                                        ) : (
                                            item.title
                                        );

                                    return (
                                        <AppLink
                                            key={index}
                                            href={item.url || "#"}
                                            className="mm-item mm-item--single"
                                            title={titleStr || undefined}
                                            onClick={() => onItemClick?.(item)}
                                        >
                                            <span className="mm-item__thumb mm-item__thumb--single">
                                                <AppImage
                                                    src={getItemImage(item)}
                                                    alt={titleStr || "item"}
                                                    loading="lazy"
                                                />
                                            </span>
                                            <span className="mm-item__label mm-item__label--single">{title}</span>
                                        </AppLink>
                                    );
                                })}
                            </div>

                            {/* Fallback if no items */}
                            {allItems.length === 0 && <div className="mm-blocks-empty">No items available</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Two-column layout (with nested menus)
    return (
        <div className={rootClasses} {...rootProps}>
            <div className="main-menu__megamenu-inner">
                {/* LEFT COLUMN: Categories are hover-only (not clickable links); only subcategories in right column navigate */}
                <div className="main-menu__megamenu-left">
                    {leftCategories.map((category, index) => {
                        const title =
                            typeof category.title === "string" ? (
                                <FormattedMessage id={category.title} defaultMessage={category.title} />
                            ) : (
                                category.title
                            );
                        const isActive = category === activeCategory;

                        return (
                            <div
                                key={index}
                                role="button"
                                tabIndex={0}
                                className={classNames("mm-cat", { active: isActive })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLeftCategoryClick(category);
                                }}
                                onMouseEnter={() => !isActive && setActiveCategory(category)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleLeftCategoryClick(category);
                                    }
                                }}
                            >
                                {/* Icon on the left */}
                                <span className="mm-cat__icon">
                                    <AppImage
                                        src={getItemImage(category)}
                                        alt={typeof category.title === "string" ? category.title : "category"}
                                        loading="lazy"
                                    />
                                </span>

                                {/* Category title */}
                                <span className="mm-cat__title">{title}</span>

                                {/* Right arrow */}
                                <span className="mm-cat__arrow">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M5.5 13l-1-1 4-4-4-4 1-1 5 5z" />
                                    </svg>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT COLUMN: Child items with icons on top and text below */}
                <div className="main-menu__megamenu-right">
                    {activeCategory && (
                        <div className="mm-blocks">
                            <div className="mm-blocks-grid mm-blocks-grid--double">
                                {rightItems.map((item, index) => {
                                    const titleStr = typeof item.title === "string" ? item.title : "";
                                    const title =
                                        typeof item.title === "string" ? (
                                            <FormattedMessage id={item.title} defaultMessage={item.title} />
                                        ) : (
                                            item.title
                                        );

                                    return (
                                        <AppLink
                                            key={index}
                                            href={item.url || "#"}
                                            className="mm-item mm-item--double"
                                            title={titleStr || undefined}
                                            onClick={() => onItemClick?.(item)}
                                        >
                                            <span className="mm-item__thumb mm-item__thumb--double">
                                                <AppImage
                                                    src={getItemImage(item)}
                                                    alt={titleStr || "item"}
                                                    loading="lazy"
                                                />
                                            </span>
                                            <span className="mm-item__label mm-item__label--double">{title}</span>
                                        </AppLink>
                                    );
                                })}
                            </div>

                            {/* Fallback if no items */}
                            {rightItems.length === 0 && <div className="mm-blocks-empty">No items available</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Megamenu;
