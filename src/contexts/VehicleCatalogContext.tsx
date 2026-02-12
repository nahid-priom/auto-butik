import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { carApi, IVehicleCategoriesResponse, IVehicleProductsFacets } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';

interface VehicleCatalogContextValue {
    categories: IVehicleCategoriesResponse | null;
    categoriesLoading: boolean;
    error: string | null;
    refreshCategories: () => Promise<void>;
    /** Facets from last products response (brands, positions, etc.) - set when products load (unfiltered) */
    facets: IVehicleProductsFacets | null;
    setFacets: (facets: IVehicleProductsFacets | null) => void;
    /** Selected brand filter (value from facets.brands[].value). Not in URL; triggers refetch only. */
    selectedBrand: string | null;
    setSelectedBrand: (value: string | null) => void;
    /** Selected position filter (value from facets.positions[].value). Not in URL; triggers refetch only. */
    selectedPosition: string | null;
    setSelectedPosition: (value: string | null) => void;
}

const VehicleCatalogContext = createContext<VehicleCatalogContextValue | null>(null);

export function VehicleCatalogProvider({ children }: { children: React.ReactNode }) {
    const { currentActiveCar } = useCurrentActiveCar();
    const [categories, setCategories] = useState<IVehicleCategoriesResponse | null>(null);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facets, setFacets] = useState<IVehicleProductsFacets | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
    const loadingRef = useRef(false);

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    const loadCategories = async () => {
        if (!modelId || loadingRef.current) {
            return;
        }

        loadingRef.current = true;
        try {
            setCategoriesLoading(true);
            setError(null);
            const data = await carApi.getCategoriesForVehicle(modelId);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching vehicle categories:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setCategoriesLoading(false);
            loadingRef.current = false;
        }
    };

    // Fetch categories when modelId is available
    useEffect(() => {
        if (!modelId) {
            setCategories(null);
            setCategoriesLoading(false);
            return;
        }

        loadCategories();
    }, [modelId]);

    const refreshCategories = async () => {
        await loadCategories();
    };

    return (
        <VehicleCatalogContext.Provider
            value={{
                categories,
                categoriesLoading,
                error,
                refreshCategories,
                facets,
                setFacets,
                selectedBrand,
                setSelectedBrand,
                selectedPosition,
                setSelectedPosition,
            }}
        >
            {children}
        </VehicleCatalogContext.Provider>
    );
}

export function useVehicleCatalogContext() {
    const context = useContext(VehicleCatalogContext);
    if (!context) {
        return {
            categories: null,
            categoriesLoading: false,
            error: null,
            refreshCategories: async () => {},
            facets: null,
            setFacets: () => {},
            selectedBrand: null,
            setSelectedBrand: () => {},
            selectedPosition: null,
            setSelectedPosition: () => {},
        };
    }
    return context;
}
