import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Indicator, { IIndicatorController } from '~/components/header/Indicator';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useGarage } from '~/contexts/GarageContext';
import { Car32Svg, ArrowRoundedRight7x11Svg } from '~/svg';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

interface CarDropdownProps {
    onCloseMenu: () => void;
}

function CarDropdown({ onCloseMenu }: CarDropdownProps) {
    const { setCurrentActiveCar } = useCurrentActiveCar();
    const { vehicles, removeVehicle } = useGarage();

    const handleSelectVehicle = (vehicle: any) => {
        setCurrentActiveCar(vehicle.data);
        onCloseMenu();
    };

    const handleRemoveVehicle = (e: React.MouseEvent, vehicleId: string) => {
        e.stopPropagation();
        removeVehicle(vehicleId);
    };

    const getVehicleTitle = (data: any) => {
        const brand = data.C_merke || '';
        const model = data.C_modell || '';
        const type = data.C_typ || '';
        
        if (brand && model) {
            return `${brand} ${model}${type ? ` ${type}` : ''}`;
        }
        
        return 'Unknown Vehicle';
    };

    const getVehicleDetails = (data: any) => {
        const details: string[] = [];
        
        // If we have engine description from manual search, use it
        if (data.engineDescription) {
            // Parse engine description: e.g., "1.4 TURBO (103 kW/140 PS)" or "320 d SEDAN [G20] (140 kW)"
            const desc = data.engineDescription;
            
            // Try to extract fuel type (DIESEL, BENSIN, etc.)
            if (desc.toLowerCase().includes('diesel') || desc.includes(' d ') || desc.includes(' D ')) {
                details.push('DIESEL');
            } else {
                details.push('BENSIN'); // Default to gasoline
            }
            
            // Try to extract displacement from description (e.g., "1.4", "2.0")
            const displacementMatch = desc.match(/(\d+\.\d+)/);
            if (displacementMatch) {
                details.push(`${displacementMatch[1]}L`);
            }
            
            // Extract power from parentheses (e.g., "(103 kW/140 PS)" or "(140 kW)")
            const powerMatch = desc.match(/\(([^)]+)\)/);
            if (powerMatch) {
                details.push(powerMatch[1]);
            }
            
            // Extract engine code (uppercase letters/numbers combo)
            const engineCodeMatch = desc.match(/\b([A-Z]\d+[A-Z]?\d*[A-Z]?)\b/);
            if (engineCodeMatch && !engineCodeMatch[1].match(/^(PS|KW)$/)) {
                details.push(engineCodeMatch[1]);
            }
            
            return details.join(' ');
        }
        
        // Otherwise use the standard fields from ICarData
        // Fuel type
        if (data.C_bransle) {
            details.push(data.C_bransle);
        }
        
        // Displacement
        if (data.C_lit) {
            details.push(`${data.C_lit}L`);
        } else if (data.C_slagvolym) {
            details.push(`${data.C_slagvolym}ccm`);
        }
        
        // Power
        if (data.C_kw && data.C_hk) {
            details.push(`${data.C_kw}kW/${data.C_hk}PS`);
        } else if (data.C_hk) {
            details.push(`${data.C_hk}PS`);
        } else if (data.C_kw) {
            details.push(`${data.C_kw}kW`);
        }
        
        // Engine code
        if (data.C_motorkod) {
            details.push(data.C_motorkod);
        }
        
        return details.join(' ');
    };

    const hasVehicles = vehicles.length > 0;

    return (
        <div className="dropcart">
            <div className="dropcart__header">
                <div className="dropcart__title">
                    <FormattedMessage id="TEXT_GARAGE" defaultMessage="Garage" />
                </div>
            </div>

            {hasVehicles ? (
                <>
                    <div className="dropcart__body" style={{ padding: 0 }}>
                        <div className="vehicles-list">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="vehicles-list__item"
                                    style={{ 
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #e5e5e5',
                                        borderRadius: 0,
                                        margin: 0,
                                    }}
                                    onClick={() => handleSelectVehicle(vehicle)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSelectVehicle(vehicle);
                                        }
                                    }}
                                >
                                    <div className="vehicles-list__item-info">
                                        <div className="vehicles-list__item-name">
                                            {getVehicleTitle(vehicle.data)}
                                        </div>
                                        <div className="vehicles-list__item-details">
                                            {getVehicleDetails(vehicle.data)}
                                        </div>
                                    </div>
                                    <div className="vehicles-list__item-actions">
                                        <button
                                            type="button"
                                            className="vehicles-list__item-remove"
                                            onClick={(e) => handleRemoveVehicle(e, vehicle.id)}
                                            aria-label="Remove vehicle"
                                            title="Remove vehicle"
                                        >
                                            ×
                                        </button>
                                        <button
                                            type="button"
                                            className="vehicles-list__item-arrow"
                                            aria-label="Select vehicle"
                                        >
                                            <ArrowRoundedRight7x11Svg />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="dropcart__footer">
                        <AppLink href={url.accountGarage()} className="btn btn-primary btn-sm btn-block">
                            <FormattedMessage id="LINK_ACCOUNT_GARAGE" defaultMessage="Garage" />
                        </AppLink>
                    </div>
                </>
            ) : (
                <div className="dropcart__body">
                    <div className="dropcart__empty">
                        <div className="dropcart__empty-icon">
                            <Car32Svg />
                        </div>
                        <div className="dropcart__empty-title">
                            <FormattedMessage id="TEXT_GARAGE_EMPTY" defaultMessage="Your garage is empty" />
                        </div>
                        <div className="dropcart__empty-subtitle">
                            <FormattedMessage 
                                id="TEXT_SELECT_CAR_PROMPT" 
                                defaultMessage="Search for your car using the search bar" 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CarIndicator() {
    const { vehicles } = useGarage();
    const carIndicatorCtrl = useRef<IIndicatorController | null>(null);

    const getLatestVehicleName = () => {
        if (vehicles.length === 0) return null;
        
        // Get the most recently added vehicle (first in array)
        const latestVehicle = vehicles[0];
        const data = latestVehicle.data as any;
        
        const brand = data.C_merke || '';
        const model = data.C_modell || '';
        const type = data.C_typ || '';
        
        let fullName = '';
        if (brand && model) {
            fullName = `${brand} ${model}${type ? ` ${type}` : ''}`;
        } else {
            fullName = 'Vehicle';
        }
        
        // Truncate to approximately 14 characters with ellipsis
        if (fullName.length > 14) {
            return fullName.substring(0, 11) + '...';
        }
        
        return fullName;
    };

    const carIndicatorLabel = <FormattedMessage id="TEXT_INDICATOR_VEHICLE_LABEL" defaultMessage="Vehicle" />;
    
    const latestVehicleName = getLatestVehicleName();
    const carIndicatorValue = latestVehicleName || <FormattedMessage id="TEXT_NO_VEHICLES" defaultMessage="No vehicles" />;

    return (
        <Indicator
            icon={<Car32Svg />}
            label={carIndicatorLabel}
            value={carIndicatorValue}
            counter={vehicles.length}
            trigger="click"
            controllerRef={carIndicatorCtrl}
        >
            <CarDropdown onCloseMenu={() => carIndicatorCtrl.current?.close()} />
        </Indicator>
    );
}
