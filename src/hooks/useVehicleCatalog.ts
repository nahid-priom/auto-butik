import { useState, useEffect } from 'react';
import { carApi, IVehicleCategoriesResponse, IVehicleProductsResponse } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useVehicleCatalogContext } from '~/contexts/VehicleCatalogContext';
import { ICarData } from '~/interfaces/car';

export interface UseVehicleCatalogOptions {
    skip?: number;
    take?: number;
    term?: string;
    collectionSlug?: string;
}

export const useVehicleCatalog = (options: UseVehicleCatalogOptions = {}) => {
    const { currentActiveCar } = useCurrentActiveCar();
    // Use shared context for categories
    const catalogContext = useVehicleCatalogContext();
    const [products, setProducts] = useState<IVehicleProductsResponse | null>(null);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState<string | null>(null);

    const { skip = 0, take = 24, term = "", collectionSlug = "" } = options;

    // Get modelId from current active car
    const modelId = currentActiveCar?.data && 'modell_id' in currentActiveCar.data 
        ? currentActiveCar.data.modell_id 
        : null;

    // Fetch products when modelId is available AND we have options that indicate we need products
    // Only fetch products if we're actually on a products page (collectionSlug is provided or we explicitly want products)
    useEffect(() => {
        if (!modelId) {
            setProducts(null);
            setProductsLoading(false);
            return;
        }

        // Don't fetch products if we're just browsing categories (no collectionSlug and no explicit product request)
        // Only fetch if collectionSlug is provided (we're on a products page) or if skip/take are set (pagination)
        const shouldFetchProducts = collectionSlug !== "" || skip > 0 || take !== 24;

        if (!shouldFetchProducts) {
            // We're just browsing categories, don't fetch products
            return;
        }

        let canceled = false;

        const loadProducts = async () => {
            try {
                setProductsLoading(true);
                setProductsError(null);
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
                    setProductsError(err instanceof Error ? err.message : 'Failed to fetch products');
                }
            } finally {
                if (!canceled) {
                    setProductsLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            canceled = true;
        };
    }, [modelId, skip, take, term, collectionSlug]);

    // For backward compatibility, loading is true if categories are loading
    const loading = catalogContext.categoriesLoading;

    return {
        categories: catalogContext.categories,
        products,
        loading,
        categoriesLoading: catalogContext.categoriesLoading,
        productsLoading,
        error: catalogContext.error || productsError,
        modelId,
        hasActiveCar: !!currentActiveCar,
    };
};
