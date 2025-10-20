// react
import React, { useEffect, useState } from 'react';
// third-party
import { useIntl, FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
// application
import { carApi } from '~/api/car.api';
import { ICarData, IWheelData, ITypesMap } from '~/interfaces/car';
import { addCarSearchToHistory } from '~/services/car-search-history';

interface Props {
    onCarSelected?: (car: ICarData | IWheelData | null) => void;
    vinOnly?: boolean; // When true, only show product name search, hide 4-data dropdowns
}

function CarLookupForm(props: Props) {
    const { onCarSelected, vinOnly = false } = props;
    const intl = useIntl();
    const router = useRouter();

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

    const [searchQuery, setSearchQuery] = useState('');

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
        setSearchQuery(valueRaw);
        // Clear any previous errors when user types
        if (error) setError(null);
    };

    useEffect(() => {
        // Skip loading brands if only VIN search is needed
        if (vinOnly) return;
        
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const b = await carApi.getBrands();
                if (mounted) setBrands(b);
            } catch (e: any) {
                if (mounted) setError(e?.message || 'Failed to load brands');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [vinOnly]);

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
            
            // Parse engine description to extract additional details
            // Format: "TYPE (POWER kW)" or "TYPE (POWER kW/HP PS)" etc.
            const enhancedWheel = {
                ...wheel,
                engineDescription, // Store the full description
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
            {!vinOnly && (
                <>
                    <div className="vehicle-form__item vehicle-form__item--select">
                        <select
                            className="form-control"
                            aria-label={intl.formatMessage({ id: 'INPUT_VEHICLE_BRAND_LABEL' })}
                            value={selectedBrand}
                            disabled={loading}
                            onChange={(e) => handleBrandChange(e.target.value)}
                        >
                            <option value="">
                                {intl.formatMessage({ id: 'INPUT_VEHICLE_BRAND_PLACEHOLDER' })}
                            </option>
                            {brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <select
                            className="form-control"
                            aria-label={intl.formatMessage({ id: 'INPUT_VEHICLE_YEAR_LABEL' })}
                            value={selectedYear}
                            disabled={loading || !selectedBrand}
                            onChange={(e) => handleYearChange(e.target.value)}
                        >
                            <option value="">
                                {intl.formatMessage({ id: 'INPUT_VEHICLE_YEAR_PLACEHOLDER' })}
                            </option>
                            {years.map((y) => (
                                <option key={y as any} value={y as any}>{y as any}</option>
                            ))}
                        </select>
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <select
                            className="form-control"
                            aria-label={intl.formatMessage({ id: 'INPUT_VEHICLE_MODEL_LABEL' })}
                            value={selectedModel}
                            disabled={loading || !selectedYear}
                            onChange={(e) => handleModelChange(e.target.value)}
                        >
                            <option value="">
                                {intl.formatMessage({ id: 'INPUT_VEHICLE_MODEL_PLACEHOLDER' })}
                            </option>
                            {models.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__item vehicle-form__item--select">
                        <select
                            className="form-control"
                            aria-label={intl.formatMessage({ id: 'INPUT_VEHICLE_ENGINE_LABEL' })}
                            value={selectedEngineId}
                            disabled={loading || !selectedModel}
                            onChange={(e) => handleEngineChange(e.target.value)}
                        >
                            <option value="">
                                {intl.formatMessage({ id: 'INPUT_VEHICLE_ENGINE_PLACEHOLDER' })}
                            </option>
                            {Object.entries(engines).map(([id, desc]) => (
                                <option key={id} value={id}>{desc}</option>
                            ))}
                        </select>
                        <div className="vehicle-form__loader" />
                    </div>

                    <div className="vehicle-form__divider">
                        <FormattedMessage id="TEXT_OR" />
                    </div>
                </>
            )}

            <div className="vehicle-form__item">
                <div className="vehicle-form__item-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({ id: 'INPUT_PRODUCT_SEARCH_PLACEHOLDER' })}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                performProductSearch();
                            }
                        }}
                    />
                </div>
                {vinOnly && (
                    <button
                        type="button"
                        className="btn btn-primary btn-block mt-3"
                        onClick={performProductSearch}
                        disabled={loading}
                    >
                        <FormattedMessage id="BUTTON_SEARCH_PRODUCTS" />
                    </button>
                )}
                {error && (
                    <div className="alert alert-sm alert-danger my-2">{error}</div>
                )}
            </div>
        </div>
    );
}

export default CarLookupForm;


