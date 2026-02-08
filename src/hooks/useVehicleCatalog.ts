import { useState, useEffect, useMemo } from 'react';
import { carApi, IVehicleCategoriesResponse, IVehicleProductsResponse } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useGarage } from '~/contexts/GarageContext';
import { useVehicleCatalogContext } from '~/contexts/VehicleCatalogContext';

export interface UseVehicleCatalogOptions {
    skip?: number;
    take?: number;
    term?: string;
    collectionSlug?: string;
    collectionId?: string | number;
    /** Filter by brand value (e.g. from facets.brands[].value) */
    brand?: string;
    /** Filter by position value (e.g. from facets.positions[].value, e.g. "HD") */
    position?: string;
    /** When set (e.g. from URL /catalog/products/[carModelID]), use this instead of current active car */
    modelIdOverride?: string | null;
    /** If true, fetch products even without an active car (uses "all" as modelId) */
    allowWithoutCar?: boolean;
}

/** Get model id from car data (supports modell_id and modelId for API compatibility). */
function getModelIdFromCarData(data: Record<string, unknown> | null | undefined): string | null {
    if (!data || typeof data !== 'object') return null;
    const id = (data.modell_id ?? (data as any).modelId) ?? null;
    return id != null && String(id).trim() !== '' ? String(id) : null;
}

export const useVehicleCatalog = (options: UseVehicleCatalogOptions = {}) => {
    const { currentActiveCar } = useCurrentActiveCar();
    const { vehicles, currentCarId } = useGarage();
    const catalogContext = useVehicleCatalogContext();
    const [products, setProducts] = useState<IVehicleProductsResponse | null>(null);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState<string | null>(null);
    const [lastFetchBrand, setLastFetchBrand] = useState<string | undefined>(undefined);
    const [lastFetchPosition, setLastFetchPosition] = useState<string | undefined>(undefined);

    const { skip = 0, take = 24, term = "", collectionSlug = "", collectionId, brand, position, modelIdOverride, allowWithoutCar = false } = options;

    // Resolve modelId: 1) URL override, 2) CarContext currentActiveCar, 3) Garage current vehicle, 4) "all" only when no car and allowWithoutCar
    const carModelId = useMemo(() => {
        if (modelIdOverride !== undefined && modelIdOverride !== null && String(modelIdOverride).trim() !== '') {
            return String(modelIdOverride);
        }
        const fromCarContext = getModelIdFromCarData(currentActiveCar?.data as Record<string, unknown>);
        if (fromCarContext) return fromCarContext;
        const currentVehicle = currentCarId ? vehicles.find((v) => v.id === currentCarId) : null;
        const fromGarage = getModelIdFromCarData(currentVehicle?.data as Record<string, unknown>);
        if (fromGarage) return fromGarage;
        return null;
    }, [modelIdOverride, currentActiveCar?.data, currentCarId, vehicles]);

    const hasCollectionFilter = collectionSlug !== "" || (collectionId !== undefined && collectionId !== "");

    // Use "all" only when we have no car and allowWithoutCar + collection filter (browse by category without vehicle)
    const modelId = carModelId || (allowWithoutCar && hasCollectionFilter ? "all" : null);

    // Fetch products when modelId is available AND we have options that indicate we need products
    // Only fetch products if we're actually on a products page (collectionSlug/collectionId is provided or we explicitly want products)
    useEffect(() => {
        if (!modelId) {
            setProducts(null);
            setProductsLoading(false);
            return;
        }

        // Don't fetch products if we're just browsing categories (no collection filter and no explicit product request)
        // Only fetch if collectionSlug/collectionId is provided (we're on a products page) or if skip/take are set (pagination)
        const shouldFetchProducts = hasCollectionFilter || skip > 0 || take !== 24;

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
                    collectionId,
                    brand,
                    position,
                });
                if (!canceled) {
                    setProducts(data);
                    setLastFetchBrand(brand);
                    setLastFetchPosition(position);
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
    }, [modelId, skip, take, term, collectionSlug, collectionId, brand, position, hasCollectionFilter]);

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
        hasActiveCar: !!carModelId || (modelIdOverride !== undefined && modelIdOverride !== null),
        canFetchProducts: !!modelId,
        /** Brand that was used for the current products response; undefined = unfiltered. */
        lastFetchBrand,
        /** Position that was used for the current products response; undefined = unfiltered. */
        lastFetchPosition,
    };
};
