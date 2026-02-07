// react
import React, { useMemo, useState } from "react";
// third-party
import classNames from "classnames";
// application
import { useVehicleCatalogContext } from "~/contexts/VehicleCatalogContext";
import { IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import { IVehicleProductFacetBrand } from "~/api/car.api";
import { Search20Svg } from "~/svg";

interface Props {
    offcanvasSidebar: IShopPageOffCanvasSidebar;
}

function WidgetBrandFilter(props: Props) {
    const { offcanvasSidebar } = props;
    const { facets, selectedBrand, setSelectedBrand } = useVehicleCatalogContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const brands = facets?.brands ?? [];

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;
        const q = searchQuery.toLowerCase().trim();
        return brands.filter((b) => b.label.toLowerCase().includes(q));
    }, [brands, searchQuery]);

    const handleBrandChange = (value: string, checked: boolean) => {
        setSelectedBrand(checked ? value : null);
    };

    const rootClasses = classNames(
        "widget",
        "widget-brand-filter",
        `widget-brand-filter--offcanvas--${offcanvasSidebar}`
    );

    if (brands.length === 0) {
        return null;
    }

    return (
        <div className={rootClasses}>
            <div className="widget-brand-filter__header">
                <button
                    type="button"
                    className="widget-brand-filter__title-row"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-expanded={!collapsed}
                >
                    <h4 className="widget-brand-filter__title">Tillverkare</h4>
                    <span className="widget-brand-filter__toggle" aria-hidden>
                        {collapsed ? "+" : "−"}
                    </span>
                </button>
            </div>
            {!collapsed && (
                <div className="widget-brand-filter__body">
                    <div className="widget-brand-filter__search">
                        <div className="widget-brand-filter__search-icon">
                            <Search20Svg />
                        </div>
                        <input
                            type="text"
                            className="widget-brand-filter__search-input"
                            placeholder="Sök"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Sök tillverkare"
                        />
                    </div>
                    <div className="widget-brand-filter__list">
                        {filteredBrands.map((brand: IVehicleProductFacetBrand) => {
                            const isChecked = selectedBrand === brand.value;
                            return (
                                <label
                                    key={brand.value}
                                    className="widget-brand-filter__item"
                                >
                                    <input
                                        type="checkbox"
                                        className="widget-brand-filter__checkbox"
                                        checked={isChecked}
                                        onChange={(e) =>
                                            handleBrandChange(brand.value, e.target.checked)
                                        }
                                    />
                                    <span className="widget-brand-filter__checkmark" />
                                    <span className="widget-brand-filter__label">
                                        {brand.label}
                                    </span>
                                </label>
                            );
                        })}
                        {filteredBrands.length === 0 && searchQuery && (
                            <div className="widget-brand-filter__no-results">
                                Inga tillverkare hittades
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(WidgetBrandFilter);
