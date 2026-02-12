// react
import React, { useEffect, useRef } from "react";
// application
import { FormattedMessage } from "react-intl";
import WidgetVehicleCategories from "~/components/widgets/WidgetVehicleCategories";
import WidgetBrandFilter from "~/components/widgets/WidgetBrandFilter";
import WidgetPositionFilter from "~/components/widgets/WidgetPositionFilter";
import WidgetFilters from "~/components/widgets/WidgetFilters";
import { IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import styles from "./CatalogFiltersSidebar.module.scss";

const OFFCANVAS: IShopPageOffCanvasSidebar = "mobile";

export interface CatalogFiltersSidebarProps {
    /** Category title (e.g. "Bromssystem") for the sidebar header */
    title: string;
    /** When true, used inside drawer (slightly reduced chrome) */
    embedded?: boolean;
    /** Called when a link is clicked (e.g. close drawer on mobile) */
    onCategoryClick?: () => void;
}

// Dev-only: warn if the same filter group title appears more than once in a single visible sidebar (duplicate options)
function useDuplicateFilterGuard() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "development") return;
        const t = setTimeout(() => {
            const sidebars = document.querySelectorAll("[data-catalog-filters-sidebar]");
            sidebars.forEach((sidebar) => {
                const titles = sidebar.querySelectorAll(
                    ".widget-brand-filter__title, .widget-position-filter__title, .widget-filters__header h4, .widget-vehicle-categories__title"
                );
                const seen = new Map<string, number>();
                titles.forEach((el) => {
                    const text = (el.textContent || "").trim();
                    if (text) seen.set(text, (seen.get(text) || 0) + 1);
                });
                seen.forEach((count, name) => {
                    if (count > 1) {
                        console.warn(
                            `[CatalogFiltersSidebar] Duplicate filter group "${name}" rendered ${count} times in one sidebar.`
                        );
                    }
                });
            });
        }, 150);
        return () => clearTimeout(t);
    }, []);
}

/**
 * Single source of truth for catalog products page filters: categories + brand + position + shop filters.
 * Use once in the desktop left column and once inside the mobile drawer (only one visible per viewport).
 */
function CatalogFiltersSidebar(props: CatalogFiltersSidebarProps) {
    const { title, embedded = false, onCategoryClick } = props;

    useDuplicateFilterGuard();

    return (
        <aside
            className={`${styles.root} ${embedded ? styles.embedded : ""}`.trim()}
            aria-label="Filter"
            data-catalog-filters-sidebar
        >
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {title || <FormattedMessage id="HEADER_CATEGORIES" defaultMessage="Kategorier" />}
                    </h2>
                </div>
                <div className={styles.body}>
                    <WidgetVehicleCategories
                        offcanvasSidebar={OFFCANVAS}
                        hideHeader
                        embedded
                        onCategoryClick={onCategoryClick}
                    />
                    <WidgetBrandFilter offcanvasSidebar={OFFCANVAS} />
                    <WidgetPositionFilter offcanvasSidebar={OFFCANVAS} />
                    <WidgetFilters offcanvasSidebar={OFFCANVAS} />
                </div>
            </div>
        </aside>
    );
}

export default React.memo(CatalogFiltersSidebar);
