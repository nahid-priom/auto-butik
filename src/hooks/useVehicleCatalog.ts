import { useState, useEffect } from 'react';
import { carApi, IVehicleCategoriesResponse, IVehicleProductsResponse } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { ICarData } from '~/interfaces/car';

export interface UseVehicleCatalogOptions {
    skip?: number;
    take?: number;
    term?: string;
    collectionSlug?: string;
}

export const useVehicleCatalog = (options: UseVehicleCatalogOptions = {}) => {
    const { currentActiveCar } = useCurrentActiveCar();
    const [categories, setCategories] = useState<IVehicleCategoriesResponse | null>(null);
    const [products, setProducts] = useState<IVehicleProductsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { skip = 0, take = 24, term = "", collectionSlug = "" } = options;

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    // Fetch categories when modelId is available
    useEffect(() => {
        if (!modelId) {
            setCategories(null);
            return;
        }

        let canceled = false;

        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await carApi.getCategoriesForVehicle(modelId);
                if (!canceled) {
                    setCategories(data);
                }
            } catch (err) {
                if (!canceled) {
                    console.error('Error fetching vehicle categories:', err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch categories');
                }
            } finally {
                if (!canceled) {
                    setLoading(false);
                }
            }
        };

        loadCategories();

        return () => {
            canceled = true;
        };
    }, [modelId]);

    // Fetch products when modelId is available
    useEffect(() => {
        if (!modelId) {
            setProducts(null);
            return;
        }

        let canceled = false;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await carApi.getProductsForVehicle(modelId, {
                    skip,
                    take,
                    term,
                    collectionSlug,
                });
                if (!canceled) {
                    setProducts(data);
                }
            } catch (err) {
                if (!canceled) {
                    console.error('Error fetching vehicle products:', err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch products');
                }
            } finally {
                if (!canceled) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            canceled = true;
        };
    }, [modelId, skip, take, term, collectionSlug]);

    return {
        categories,
        products,
        loading,
        error,
        modelId,
        hasActiveCar: !!currentActiveCar,
    };
};
