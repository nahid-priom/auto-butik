import React, { useState, ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";

const CompatibleVehicles = () => {
    const [expandedMakes, setExpandedMakes] = useState<string[]>([]);
    const [selectedMake, setSelectedMake] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");

    const vehiclesData = [
        {
            make: "AUDI",
            models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "R8"],
        },
        {
            make: "FORD",
            models: [
                "FIESTA",
                "FOCUS",
                "MONDEO",
                "KUGA",
                "PUMA",
                "S-MAX",
                "GALAXY",
                "TRANSIT",
                "TRANSIT CUSTOM",
                "RANGER",
            ],
        },
        {
            make: "SKODA",
            models: ["FABIA", "OCTAVIA", "SUPERB", "KAROQ", "KODIAQ", "SCALA", "KAMIQ", "ENYAQ"],
        },
        {
            make: "VOLKSWAGEN",
            models: [
                "GOLF",
                "POLO",
                "PASSAT",
                "TIGUAN",
                "TOURAN",
                "T-ROC",
                "T-CROSS",
                "ARTEON",
                "CADDY",
                "TRANSPORTER",
            ],
        },
        {
            make: "SEAT",
            models: ["IBIZA", "LEON", "ATECA", "ARONA", "TARRACO", "ALHAMBRA", "TOLEDO"],
        },
        {
            make: "BMW",
            models: ["1 SERIES", "2 SERIES", "3 SERIES", "4 SERIES", "5 SERIES", "7 SERIES", "X1", "X3", "X5", "X7"],
        },
        {
            make: "MERCEDES-BENZ",
            models: ["A-CLASS", "C-CLASS", "E-CLASS", "S-CLASS", "GLA", "GLC", "GLE", "GLS", "V-CLASS"],
        },
    ];

    // Get all unique makes for the select dropdown
    const allMakes = vehiclesData.map((vehicle) => vehicle.make);

    // Get models for selected make
    const modelsForSelectedMake = vehiclesData.find((vehicle) => vehicle.make === selectedMake)?.models || [];

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

    const handleModelClick = (model: string) => {
        setSelectedModel(model);
    };

    return (
        <div className="compatible-vehicles">
            <h2 className="vehicles-title">
                <FormattedMessage id="COMPATIBLE_VEHICLES_TITLE" />
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
                {vehiclesData.map((vehicle, index) => (
                    <div key={index} className="vehicle-item">
                        <div className="vehicle-make accordion-header" onClick={() => toggleMake(vehicle.make)}>
                            <span className="accordion-icon">
                                <svg
                                    className={`accordion-arrow ${isMakeExpanded(vehicle.make) ? "expanded" : ""}`}
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
                            <span className="make-text">{vehicle.make}</span>
                        </div>

                        <div className="vehicle-models-container">
                            <div className={`vehicle-models ${isMakeExpanded(vehicle.make) ? "expanded" : ""}`}>
                                {vehicle.models.map((model, modelIndex) => (
                                    <div
                                        key={modelIndex}
                                        className={`vehicle-model ${selectedModel === model ? "selected" : ""}`}
                                        onClick={() => handleModelClick(model)}
                                    >
                                        <span className="model-text">{model}</span>
                                        <span className="model-arrow">
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <path
                                                    d="M6 4L10 8L6 12"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Vehicle Display */}
            {(selectedMake || selectedModel) && (
                <div className="selected-vehicle">
                    <h3>
                        <FormattedMessage id="SELECTED_VEHICLE" />
                    </h3>
                    <p>
                        {selectedMake} {selectedModel && `- ${selectedModel}`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CompatibleVehicles;
