// react
import React, { useEffect, useState } from 'react';
// application
import { carApi } from '~/api/car.api';
import { ICarData, IWheelData, ITypesMap } from '~/interfaces/car';

interface Props {
    onCarSelected?: (car: ICarData | IWheelData | null) => void;
}

function CarLookupForm(props: Props) {
    const { onCarSelected } = props;

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

    const [regNr, setRegNr] = useState('');

    const performRegistrationSearch = async (sanitized: string) => {
        const regPattern = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/;
        if (!regPattern.test(sanitized)) {
            setError('Invalid format. Use ABC123 or ABC12D');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await carApi.getCarByRegistration(sanitized);
            if (res.success && res.data) {
                if (onCarSelected) onCarSelected(res.data);
            }
        } catch (e: any) {
            setError(e?.message || 'Error searching');
            if (onCarSelected) onCarSelected(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRegChange = (valueRaw: string) => {
        let v = valueRaw.toUpperCase();
        // Allow only letters, digits, and space
        v = v.replace(/[^A-Z0-9 ]/g, '');
        // Remove all spaces to control placement
        v = v.replace(/\s+/g, '');
        // Limit to max 6 significant chars
        if (v.length > 6) v = v.slice(0, 6);
        // Insert a space after third char for UX: ABC 123 / ABC 12D
        if (v.length > 3) {
            v = `${v.slice(0, 3)} ${v.slice(3)}`;
        }
        setRegNr(v);

        const sanitized = v.replace(/\s+/g, '');
        if (sanitized.length === 6) {
            void performRegistrationSearch(sanitized);
        }
    };

    useEffect(() => {
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
    }, []);

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
            if (onCarSelected) onCarSelected(wheel);
        } catch (e: any) {
            setError(e?.message || 'Failed to load vehicle data');
        } finally {
            setLoading(false);
        }
    };

    const searchByRegistration = async () => {
        const value = regNr.trim().toUpperCase();
        const sanitized = value.replace(/\s+/g, '');
        if (!value) {
            setError('Please enter a registration number');
            return;
        }
        await performRegistrationSearch(sanitized);
    };

    return (
        <div className="vehicle-form vehicle-form--layout--modal">
            <div className="vehicle-form__item vehicle-form__item--select">
                <select
                    className="form-control"
                    aria-label="Brand"
                    value={selectedBrand}
                    disabled={loading}
                    onChange={(e) => handleBrandChange(e.target.value)}
                >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
                <div className="vehicle-form__loader" />
            </div>

            <div className="vehicle-form__item vehicle-form__item--select">
                <select
                    className="form-control"
                    aria-label="Year"
                    value={selectedYear}
                    disabled={loading || !selectedBrand}
                    onChange={(e) => handleYearChange(e.target.value)}
                >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                        <option key={y as any} value={y as any}>{y as any}</option>
                    ))}
                </select>
                <div className="vehicle-form__loader" />
            </div>

            <div className="vehicle-form__item vehicle-form__item--select">
                <select
                    className="form-control"
                    aria-label="Model"
                    value={selectedModel}
                    disabled={loading || !selectedYear}
                    onChange={(e) => handleModelChange(e.target.value)}
                >
                    <option value="">Select Model</option>
                    {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <div className="vehicle-form__loader" />
            </div>

            <div className="vehicle-form__item vehicle-form__item--select">
                <select
                    className="form-control"
                    aria-label="Engine"
                    value={selectedEngineId}
                    disabled={loading || !selectedModel}
                    onChange={(e) => handleEngineChange(e.target.value)}
                >
                    <option value="">Select Engine</option>
                    {Object.entries(engines).map(([id, desc]) => (
                        <option key={id} value={id}>{desc}</option>
                    ))}
                </select>
                <div className="vehicle-form__loader" />
            </div>

            <div className="vehicle-form__divider">OR</div>

            <div className="vehicle-form__item">
                <div className="vehicle-form__item-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="REGISTRERINGSNUMMER / VIN"
                        value={regNr}
                        onChange={(e) => handleRegChange(e.target.value)}
                        maxLength={7}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                searchByRegistration();
                            }
                        }}
                    />
                </div>
                {error && (
                    <div className="alert alert-sm alert-danger my-2">{error}</div>
                )}
            </div>
        </div>
    );
}

export default CarLookupForm;


