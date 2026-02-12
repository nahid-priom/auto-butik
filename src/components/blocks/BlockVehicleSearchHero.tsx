// react
import React, { useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
// application
import CarLookupForm from '~/components/shared/CarLookupForm';
import SelectedVehicleDetailsSheet from '~/components/shared/SelectedVehicleDetailsSheet';
import { useGarage } from '~/contexts/GarageContext';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { ICarData, IWheelData } from '~/interfaces/car';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function BlockVehicleSearchHero() {
    const intl = useIntl();
    const { addVehicle, setCurrentCar, vehicles, currentCarId } = useGarage();
    const { setCurrentActiveCar } = useCurrentActiveCar();
    const [isSearching, setIsSearching] = useState(false);
    const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
    const router = useRouter();

    const currentVehicle = currentCarId
        ? vehicles.find((v) => v.id === currentCarId)
        : undefined;
    const selectedVehicleLabel = currentVehicle?.data
        ? `${(currentVehicle.data as any).C_merke ?? ''} ${(currentVehicle.data as any).C_modell ?? ''}`.trim()
        : '';

    const handleCarSelected = (car: ICarData | IWheelData | null) => {
        if (car) {
            setIsSearching(true);
            try {
                const newId = addVehicle(car);
                setCurrentCar(newId);
                setCurrentActiveCar({
                    regNr: (car as any).RegNr ?? '',
                    data: car as any,
                    fetchedAt: Date.now(),
                });
                const carName = (car as any).C_merke + ' ' + (car as any).C_modell;
                toast.success(
                    intl.formatMessage(
                        { id: 'TEXT_VEHICLE_ADDED_TO_GARAGE', defaultMessage: '{vehicleName} added to garage' },
                        { vehicleName: carName }
                    ),
                    { theme: 'colored' }
                );
                // Navigate to catalog page after successful search
                router.push('/catalog');
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
            <SelectedVehicleDetailsSheet
                isOpen={detailsSheetOpen}
                onClose={() => setDetailsSheetOpen(false)}
                vehicle={currentVehicle ?? null}
            />
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

                        {currentVehicle && selectedVehicleLabel && (
                            <button
                                type="button"
                                className="block-vehicle-search-hero__selected-pill"
                                onClick={() => setDetailsSheetOpen(true)}
                                aria-expanded={detailsSheetOpen}
                                aria-label={intl.formatMessage(
                                    { id: 'TEXT_VIEW_VEHICLE_DETAILS', defaultMessage: 'View details for {vehicle}' },
                                    { vehicle: selectedVehicleLabel }
                                )}
                            >
                                <span className="block-vehicle-search-hero__selected-pill-icon">
                                    <CheckIcon />
                                </span>
                                <span className="block-vehicle-search-hero__selected-pill-label">
                                    {selectedVehicleLabel}
                                </span>
                                <span className="block-vehicle-search-hero__selected-pill-chevron">
                                    <ChevronRightIcon />
                                </span>
                            </button>
                        )}
                        
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

