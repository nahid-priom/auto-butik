// react
import React, { useMemo, useState } from "react";
// third-party
import classNames from "classnames";
// application
import { useVehicleCatalogContext } from "~/contexts/VehicleCatalogContext";
import { IShopPageOffCanvasSidebar } from "~/interfaces/pages";
import { IVehicleProductFacetPosition } from "~/api/car.api";
import { Search20Svg } from "~/svg";

interface Props {
    offcanvasSidebar: IShopPageOffCanvasSidebar;
}

function WidgetPositionFilter(props: Props) {
    const { offcanvasSidebar } = props;
    const { facets, selectedPosition, setSelectedPosition } = useVehicleCatalogContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const positions = facets?.positions ?? [];

    const filteredPositions = useMemo(() => {
        if (!searchQuery.trim()) return positions;
        const q = searchQuery.toLowerCase().trim();
        return positions.filter((p) => p.label.toLowerCase().includes(q));
    }, [positions, searchQuery]);

    const handlePositionChange = (value: string, checked: boolean) => {
        setSelectedPosition(checked ? value : null);
    };

    const rootClasses = classNames(
        "widget",
        "widget-position-filter",
        `widget-position-filter--offcanvas--${offcanvasSidebar}`
    );

    if (positions.length === 0) {
        return null;
    }

    return (
        <div className={rootClasses}>
            <div className="widget-position-filter__header">
                <button
                    type="button"
                    className="widget-position-filter__title-row"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-expanded={!collapsed}
                >
                    <h4 className="widget-position-filter__title">Placering</h4>
                    <span className="widget-position-filter__toggle" aria-hidden>
                        {collapsed ? "+" : "−"}
                    </span>
                </button>
            </div>
            {!collapsed && (
                <div className="widget-position-filter__body">
                    <div className="widget-position-filter__search">
                        <div className="widget-position-filter__search-icon">
                            <Search20Svg />
                        </div>
                        <input
                            type="text"
                            className="widget-position-filter__search-input"
                            placeholder="Sök"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Sök placering"
                        />
                    </div>
                    <div className="widget-position-filter__list">
                        {filteredPositions.map((pos: IVehicleProductFacetPosition) => {
                            const isChecked = selectedPosition === pos.value;
                            return (
                                <label
                                    key={pos.value}
                                    className="widget-position-filter__item"
                                >
                                    <input
                                        type="checkbox"
                                        className="widget-position-filter__checkbox"
                                        checked={isChecked}
                                        onChange={(e) =>
                                            handlePositionChange(pos.value, e.target.checked)
                                        }
                                    />
                                    <span className="widget-position-filter__checkmark" />
                                    <span className="widget-position-filter__label">
                                        {pos.label}
                                    </span>
                                </label>
                            );
                        })}
                        {filteredPositions.length === 0 && searchQuery && (
                            <div className="widget-position-filter__no-results">
                                Inga platser hittades
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(WidgetPositionFilter);
