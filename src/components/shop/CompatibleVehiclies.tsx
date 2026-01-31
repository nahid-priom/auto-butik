import React, { useState, ChangeEvent, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { VehicleGroup, Vehicle } from "~/interfaces/tecdoc";

interface CompatibleVehiclesProps {
    compatibleVehicles?: VehicleGroup[];
    isLoading?: boolean;
}

const CompatibleVehicles: React.FC<CompatibleVehiclesProps> = ({
    compatibleVehicles = [],
    isLoading = false,
}) => {
    const [expandedMakes, setExpandedMakes] = useState<string[]>([]);
    const [selectedMake, setSelectedMake] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");

    // Get all unique manufacturers for the select dropdown
    const allMakes = useMemo(() => {
        return compatibleVehicles.map((group) => group.manufacturer);
    }, [compatibleVehicles]);

    // Get unique models for selected make
    const modelsForSelectedMake = useMemo(() => {
        const group = compatibleVehicles.find((g) => g.manufacturer === selectedMake);
        if (!group) return [];
        // Get unique models
        const uniqueModels = [...new Set(group.vehicles.map((v) => v.model))];
        return uniqueModels;
    }, [compatibleVehicles, selectedMake]);

    // Get total vehicle count
    const totalVehicleCount = useMemo(() => {
        return compatibleVehicles.reduce((sum, group) => sum + group.vehicles.length, 0);
    }, [compatibleVehicles]);

    const toggleMake = (make: string) => {
        setExpandedMakes((prev) => (prev.includes(make) ? prev.filter((item) => item !== make) : [...prev, make]));
    };

    const isMakeExpanded = (make: string) => {
        return expandedMakes.includes(make);
    };

    const handleReset = () => {
        setExpandedMakes([]);
        setSelectedMake("");
        setSelectedModel("");
    };

    const handleMakeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const make = e.target.value;
        setSelectedMake(make);
        setSelectedModel("");
        if (make) {
            // Auto-expand the selected make
            if (!expandedMakes.includes(make)) {
                setExpandedMakes((prev) => [...prev, make]);
            }
        }
    };

    const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedModel(e.target.value);
    };

    // Filter vehicles based on selected model
    const getFilteredVehicles = (vehicles: Vehicle[]): Vehicle[] => {
        if (!selectedModel) return vehicles;
        return vehicles.filter((v) => v.model === selectedModel);
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="compatible-vehicles">
                <h2 className="vehicles-title">
                    <FormattedMessage id="COMPATIBLE_VEHICLES_TITLE" />
                </h2>
                <div className="vehicles-list">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="vehicle-item">
                            <div className="vehicle-make accordion-header">
                                <span className="skeleton-text" style={{ width: "150px", height: "1.2rem", backgroundColor: "#e0e0e0", borderRadius: "4px", display: "inline-block" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state - don't render if no compatible vehicles
    if (!compatibleVehicles || compatibleVehicles.length === 0) {
        return null;
    }

    return (
        <div className="compatible-vehicles">
            <h2 className="vehicles-title">
                <FormattedMessage id="COMPATIBLE_VEHICLES_TITLE" />
                <span className="vehicles-count"> ({totalVehicleCount} varianter)</span>
            </h2>

            {/* Select Fields Row */}
            <div className="select-fields-row">
                <div className="select-container">
                    <select value={selectedMake} onChange={handleMakeChange} className="vehicle-select">
                        <option value="">
                            <FormattedMessage id="SELECT_MAKE_PLACEHOLDER" />
                        </option>
                        {allMakes.map((make, index) => (
                            <option key={index} value={make}>
                                {make}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="select-container">
                    <select
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="vehicle-select"
                        disabled={!selectedMake}
                    >
                        <option value="">
                            <FormattedMessage id="SELECT_MODEL_PLACEHOLDER" />
                        </option>
                        {modelsForSelectedMake.map((model, index) => (
                            <option key={index} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="select-reset">
                    <button className="reset-button" onClick={handleReset}>
                        <FormattedMessage id="VEHICLE_RESET" />
                    </button>
                </div>
            </div>

            <div className="vehicles-list">
                {compatibleVehicles.map((group, index) => {
                    // Skip manufacturers that don't match the filter
                    if (selectedMake && group.manufacturer !== selectedMake) {
                        return null;
                    }

                    const filteredVehicles = getFilteredVehicles(group.vehicles);
                    if (filteredVehicles.length === 0) return null;

                    return (
                        <div key={group.manufacturerCode || index} className="vehicle-item">
                            <div className="vehicle-make accordion-header" onClick={() => toggleMake(group.manufacturer)}>
                                <span className="accordion-icon">
                                    <svg
                                        className={`accordion-arrow ${isMakeExpanded(group.manufacturer) ? "expanded" : ""}`}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M4 6L8 10L12 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span className="make-text">{group.manufacturer}</span>
                                <span className="make-count">({filteredVehicles.length} fordon)</span>
                            </div>

                            <div className="vehicle-models-container">
                                <div className={`vehicle-models ${isMakeExpanded(group.manufacturer) ? "expanded" : ""}`}>
                                    {/* Table header */}
                                    <div className="vehicle-models-table-header">
                                        <span className="vehicle-col-model">Modell</span>
                                        <span className="vehicle-col-years">År</span>
                                        <span className="vehicle-col-engine">Motor / Drivlina</span>
                                    </div>
                                    {filteredVehicles.map((vehicle, vehicleIndex) => (
                                        <div
                                            key={vehicle.ktypno || vehicleIndex}
                                            className="vehicle-model vehicle-detail"
                                        >
                                            <span className="vehicle-col-model model-text">{vehicle.model}</span>
                                            <span className="vehicle-col-years vehicle-years">{vehicle.years}</span>
                                            <span className="vehicle-col-engine vehicle-engine">{vehicle.engine}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompatibleVehicles;
