// react
import React, { useEffect, useState } from 'react';
// third-party
import { useIntl, FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
// application
import { carApi } from '~/api/car.api';
import VehicleSearchSelect from '~/components/shared/VehicleSearchSelect';
import { ICarData, IWheelData, ITypesMap } from '~/interfaces/car';
import { addCarSearchToHistory } from '~/services/car-search-history';
import { useHeroBrands } from '~/store/homepage/homepageHooks';
import { fetchBrandsIfNeeded } from '~/store/homepage/homepageActions';
import { useAppAction } from '~/store/hooks';

interface Props {
    onCarSelected?: (car: ICarData | IWheelData | null) => void;
    vinOnly?: boolean; // When true, only show string search input, hide 4-data dropdowns
    enableVinSearch?: boolean; // When true, string search is VIN search (adds to garage). When false, it's product search
}

function CarLookupForm(props: Props) {
    const { onCarSelected, vinOnly = false, enableVinSearch = false } = props;
    const intl = useIntl();
    const router = useRouter();
    const { brands: reduxBrands, loading: brandsLoading, error: brandsError } = useHeroBrands();
    const fetchBrands = useAppAction(fetchBrandsIfNeeded);

    const [brands, setBrands] = useState<string[]>([]);
    const [years, setYears] = useState<(number | string)[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [engines, setEngines] = useState<ITypesMap>({});

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedEngineId, setSelectedEngineId] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadingOr = loading || (!vinOnly && brandsLoading);
    const errorOr = error ?? (!vinOnly ? brandsError : null);
    const brandsList = vinOnly ? brands : (reduxBrands.length > 0 ? reduxBrands : brands);

    const [searchQuery, setSearchQuery] = useState('');

    const performVinSearchWithValue = async (cleanedRegNumber: string) => {
        if (!cleanedRegNumber) {
            setError(intl.formatMessage({ id: 'ERROR_FORM_REQUIRED' }));
            return;
        }

        // Swedish registration format: must be 6 characters (3 letters + 3 digits/letters)
        if (cleanedRegNumber.length !== 6) {
            setError(intl.formatMessage({ id: 'ERROR_INVALID_VIN_LENGTH' }));
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await carApi.getCarByRegistration(cleanedRegNumber);
            
            // Extract the car data from the response
            const carData = response.data;
            
            // Save to browsing history
            addCarSearchToHistory(carData, 'registration', { registrationNumber: cleanedRegNumber });
            
            if (onCarSelected) onCarSelected(carData);
            
            // Clear the input after successful search
            setSearchQuery('');
        } catch (e: any) {
            setError(e?.message || intl.formatMessage({ id: 'ERROR_VIN_NOT_FOUND' }));
        } finally {
            setLoading(false);
        }
    };

    const performVinSearch = async () => {
        // Remove spaces for API call
        const cleanedRegNumber = searchQuery.replace(/\s+/g, '').toUpperCase();
        await performVinSearchWithValue(cleanedRegNumber);
    };

    const performProductSearch = () => {
        const trimmed = searchQuery.trim();
        if (!trimmed) {
            setError(intl.formatMessage({ id: 'ERROR_FORM_REQUIRED' }));
            return;
        }
        
        // Navigate to products page with search query
        router.push(`/catalog/products?search=${encodeURIComponent(trimmed)}`);
    };

    const handleSearchChange = (valueRaw: string) => {
        if (!enableVinSearch) {
            // Product search mode - no formatting
            setSearchQuery(valueRaw);
            if (error) setError(null);
            return;
        }

        // VIN/Registration mode - format as XXX XXX
        // Convert to uppercase
        let formatted = valueRaw.toUpperCase();
        
        // Remove all spaces
        formatted = formatted.replace(/\s+/g, '');
        
        // Limit to 6 characters
        formatted = formatted.substring(0, 6);
        
        // Add space after 3rd character
        if (formatted.length > 3) {
            formatted = formatted.substring(0, 3) + ' ' + formatted.substring(3);
        }
        
        setSearchQuery(formatted);
        
        // Clear any previous errors when user types
        if (error) setError(null);
        
        // Auto-search when 6 characters are entered (excluding space)
        const cleanedValue = formatted.replace(/\s+/g, '');
        if (cleanedValue.length === 6) {
            // Trigger search immediately with the cleaned value
            performVinSearchWithValue(cleanedValue);
        }
    };

    const handleStringSearch = () => {
        if (enableVinSearch) {
            performVinSearch();
        } else {
            performProductSearch();
        }
    };

    useEffect(() => {
        if (vinOnly) return;
        fetchBrands(false);
    }, [vinOnly, fetchBrands]);

    const handleBrandChange = async (brand: string) => {
        setSelectedBrand(brand);
        setSelectedYear('');
        setSelectedModel('');
        setSelectedEngineId('');
        setYears([]);
        setModels([]);
        setEngines({});
        if (onCarSelected) onCarSelected(null);

        if (!brand) return;
        try {
            setLoading(true);
            const y = await carApi.getYears(brand);
            setYears(y);
        } catch (e: any) {
            setError(e?.message || 'Failed to load years');
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = async (year: string) => {
        setSelectedYear(year);
        setSelectedModel('');
        setSelectedEngineId('');
        setModels([]);
        setEngines({});
        if (onCarSelected) onCarSelected(null);

        if (!year || !selectedBrand) return;
        try {
            setLoading(true);
            const m = await carApi.getModels(selectedBrand, year);
            setModels(m);
        } catch (e: any) {
            setError(e?.message || 'Failed to load models');
        } finally {
            setLoading(false);
        }
    };

    const handleModelChange = async (model: string) => {
        setSelectedModel(model);
        setSelectedEngineId('');
        setEngines({});
        if (onCarSelected) onCarSelected(null);

        if (!model || !selectedBrand || !selectedYear) return;
        try {
            setLoading(true);
            const t = await carApi.getEngines(selectedBrand, selectedYear, model);
            setEngines(t);
        } catch (e: any) {
            setError(e?.message || 'Failed to load engines');
        } finally {
            setLoading(false);
        }
    };

    const handleEngineChange = async (engineId: string) => {
        setSelectedEngineId(engineId);
        if (onCarSelected) onCarSelected(null);

        if (!engineId) return;
        try {
            setLoading(true);
            const wheel = await carApi.getWheelDataByModelId(engineId);
            
            // Get the engine description from the engines map
            const engineDescription = engines[engineId] || '';
            
            // engineId from the engines dropdown IS the TecDoc model ID (KTYPE). Without modell_id,
            // the stored vehicle is not used for category tree or product filtering.
            const enhancedWheel = {
                ...wheel,
                engineDescription, // Store the full description
                modell_id: engineId,
                RegNr: (wheel as any).RegNr ?? '', // Ensure regNr is set for localStorage (empty when not from plate lookup)
            };
            
            // Save to browsing history with engine description
            addCarSearchToHistory(
                enhancedWheel,
                'manual',
                {
                    brand: selectedBrand,
                    year: selectedYear,
                    model: selectedModel,
                    engineId,
                    engineDescription,
                },
            );
            
            if (onCarSelected) onCarSelected(enhancedWheel);
        } catch (e: any) {
            setError(e?.message || 'Failed to load vehicle data');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="vehicle-form vehicle-form--layout--modal">
            {/* String search FIRST */}
            <div className="vehicle-form__item">
                <div className="vehicle-form__item-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({ 
                            id: enableVinSearch ? 'INPUT_VIN_PLACEHOLDER' : 'INPUT_PRODUCT_SEARCH_PLACEHOLDER' 
                        })}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        disabled={loadingOr}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleStringSearch();
                            }
                        }}
                    />
                </div>
                {vinOnly && (
                    <button
                        type="button"
                        className="btn btn-primary btn-block mt-3"
                        onClick={handleStringSearch}
                        disabled={loadingOr}
                    >
                        <FormattedMessage id={enableVinSearch ? 'BUTTON_SEARCH_VIN' : 'BUTTON_SEARCH_PRODUCTS'} />
                    </button>
                )}
                {errorOr && (
                    <div className="alert alert-sm alert-danger my-2">{error}</div>
                )}
            </div>

            {/* OR divider */}
            {!vinOnly && (
                <>
                    <div className="vehicle-form__divider">
                        <FormattedMessage id="TEXT_OR" />
                    </div>

                    {/* 4-data search SECOND — custom dropdowns aligned under each trigger, with search */}
                    <div className="vehicle-form__item vehicle-form__item--select">
                        <VehicleSearchSelect
                            value={selectedBrand}
                            options={brandsList}
                            onChange={handleBrandChange}
                            disabled={loadingOr}
                            placeholder={intl.formatMessage({ id: 'INPUT_VEHICLE_BRAND_PLACEHOLDER' })}
                            ariaLabel={intl.formatMessage({ id: 'INPUT_VEHICLE_BRAND_LABEL' })}
                        />
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <VehicleSearchSelect
                            value={selectedYear}
                            options={years.map((y) => String(y))}
                            onChange={handleYearChange}
                            disabled={!selectedBrand}
                            placeholder={intl.formatMessage({ id: 'INPUT_VEHICLE_YEAR_PLACEHOLDER' })}
                            ariaLabel={intl.formatMessage({ id: 'INPUT_VEHICLE_YEAR_LABEL' })}
                        />
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <VehicleSearchSelect
                            value={selectedModel}
                            options={models}
                            onChange={handleModelChange}
                            disabled={loadingOr || !selectedYear}
                            placeholder={intl.formatMessage({ id: 'INPUT_VEHICLE_MODEL_PLACEHOLDER' })}
                            ariaLabel={intl.formatMessage({ id: 'INPUT_VEHICLE_MODEL_LABEL' })}
                        />
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <VehicleSearchSelect
                            value={selectedEngineId}
                            options={engines}
                            onChange={handleEngineChange}
                            disabled={loadingOr || !selectedModel}
                            placeholder={intl.formatMessage({ id: 'INPUT_VEHICLE_ENGINE_PLACEHOLDER' })}
                            ariaLabel={intl.formatMessage({ id: 'INPUT_VEHICLE_ENGINE_LABEL' })}
                        />
                        <div className="vehicle-form__loader" />
                    </div>
                </>
            )}
        </div>
    );
}

export default CarLookupForm;


