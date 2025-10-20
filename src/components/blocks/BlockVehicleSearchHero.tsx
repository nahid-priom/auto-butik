// react
import React, { useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import CarLookupForm from '~/components/shared/CarLookupForm';
import { useGarage } from '~/contexts/GarageContext';
import { ICarData, IWheelData } from '~/interfaces/car';
import { toast } from 'react-toastify';

function BlockVehicleSearchHero() {
    const intl = useIntl();
    const { addVehicle } = useGarage();
    const [isSearching, setIsSearching] = useState(false);

    const handleCarSelected = (car: ICarData | IWheelData | null) => {
        if (car) {
            setIsSearching(true);
            try {
                addVehicle(car);
                const carName = (car as any).C_merke + ' ' + (car as any).C_modell;
                toast.success(
                    intl.formatMessage(
                        { id: 'TEXT_VEHICLE_ADDED_TO_GARAGE', defaultMessage: '{vehicleName} added to garage' },
                        { vehicleName: carName }
                    ),
                    { theme: 'colored' }
                );
            } catch (error) {
                console.error('Error adding vehicle to garage:', error);
                toast.error(
                    intl.formatMessage({ id: 'TEXT_ERROR_ADDING_VEHICLE', defaultMessage: 'Error adding vehicle to garage' }),
                    { theme: 'colored' }
                );
            } finally {
                setTimeout(() => setIsSearching(false), 500);
            }
        }
    };

    return (
        <div className="block-vehicle-search-hero">
            <div className="block-vehicle-search-hero__inner">
                <div className="container">
                    <div className="block-vehicle-search-hero__content">
                        <h1 className="block-vehicle-search-hero__title">
                            <FormattedMessage 
                                id="TEXT_HERO_SEARCH_TITLE" 
                                defaultMessage="Bildelar online - låga priser och snabb leverans" 
                            />
                        </h1>
                        <p className="block-vehicle-search-hero__subtitle">
                            <FormattedMessage 
                                id="TEXT_HERO_SEARCH_SUBTITLE" 
                                defaultMessage="Välj ditt fordon" 
                            />
                        </p>
                        
                        <div className="block-vehicle-search-hero__form">
                            <CarLookupForm onCarSelected={handleCarSelected} vinOnly={false} enableVinSearch={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockVehicleSearchHero;

