// react
import React from "react";
// application
import { FormattedMessage } from "react-intl";
import { INavigationEvent } from "~/components/shared/Navigation";
import { INavigation } from "~/interfaces/list";
import { IShopPageLayout } from "~/interfaces/pages";
import { ArrowRoundedLeft7x11Svg, ArrowRoundedRight7x11Svg, Filters16Svg, LayoutGrid16Svg, LayoutList16Svg } from "~/svg";
import styles from "./CatalogTopControls.module.scss";

const DEFAULT_SORT_OPTIONS = [{ value: "popularity", label: "Popularitet" }];

export interface CatalogTopControlsProps {
    /** Current limit (page size) */
    limit: number;
    onLimitChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    /** Current layout: list or grid */
    layout: IShopPageLayout;
    onLayoutChange: (layout: IShopPageLayout) => void;
    /** Pagination/navigation data */
    navigation: INavigation | null;
    page: number;
    onNavigate: (event: INavigationEvent) => void;
    /** Open filters/sidebar (e.g. on mobile) */
    onFiltersClick?: () => void;
    /** Optional label for the filters button (e.g. "Kategori" on catalog page) */
    filtersButtonLabel?: React.ReactNode;
    /** Active filter count for badge on mobile */
    filterCount?: number;
    /** Sort value for sort dropdown */
    sortValue?: string;
    onSortChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    sortOptions?: { value: string; label: string }[];
}

function CatalogTopControls(props: CatalogTopControlsProps) {
    const {
        limit,
        onLimitChange,
        layout,
        onLayoutChange,
        navigation,
        page,
        onNavigate,
        onFiltersClick,
        filtersButtonLabel,
        filterCount = 0,
        sortValue = "popularity",
        onSortChange,
        sortOptions = DEFAULT_SORT_OPTIONS,
    } = props;

    const rangeText =
        navigation && navigation.type === "page"
            ? `${navigation.from} - ${navigation.to} av ${navigation.total}`
            : "";

    const pageNav = navigation && navigation.type === "page" ? navigation : null;
    const canPrev = pageNav && page > 1;
    const canNext = pageNav && page < pageNav.pages;

    return (
        <div className={styles.root}>
            <div className={styles.left}>
                {onFiltersClick && (
                    <button type="button" className={styles.filtersBtn} onClick={onFiltersClick} aria-label="Kategorier">
                        <Filters16Svg />
                        <span>{filtersButtonLabel ?? <FormattedMessage id="BUTTON_FILTERS" />}</span>
                        {filterCount > 0 && <span className={styles.filterBadge}>{filterCount}</span>}
                    </button>
                )}
                <div className={styles.selectWrap}>
                    <select
                        className={styles.select}
                        value={sortValue}
                        onChange={onSortChange ?? (() => {})}
                        aria-label="Sortering"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.selectWrap + " " + styles.limitWrap}>
                    <select
                        id="catalog-limit"
                        className={styles.select}
                        value={limit}
                        onChange={onLimitChange}
                        aria-label="Antal per sida"
                    >
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                        <option value={24}>24</option>
                        <option value={32}>32</option>
                    </select>
                </div>
                <div className={styles.layoutSwitcher}>
                    <button
                        type="button"
                        className={`${styles.layoutBtn} ${layout === "list" ? styles.layoutBtnActive : ""}`}
                        onClick={() => onLayoutChange("list")}
                        aria-label="Listvy"
                    >
                        <LayoutList16Svg />
                    </button>
                    <button
                        type="button"
                        className={`${styles.layoutBtn} ${layout === "grid" ? styles.layoutBtnActive : ""}`}
                        onClick={() => onLayoutChange("grid")}
                        aria-label="Rutnätsvy"
                    >
                        <LayoutGrid16Svg />
                    </button>
                </div>
            </div>
            <div className={styles.right}>
                {rangeText && <span className={styles.range}>{rangeText}</span>}
                {pageNav && (
                    <div className={styles.pagination}>
                        <button
                            type="button"
                            className={styles.pageBtn}
                            disabled={!canPrev}
                            aria-label="Föregående"
                            onClick={() => canPrev && onNavigate({ type: "page", page: page - 1 })}
                        >
                            <ArrowRoundedLeft7x11Svg />
                        </button>
                        <button
                            type="button"
                            className={styles.pageBtn}
                            disabled={!canNext}
                            aria-label="Nästa"
                            onClick={() => canNext && onNavigate({ type: "page", page: page + 1 })}
                        >
                            <ArrowRoundedRight7x11Svg />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(CatalogTopControls);
