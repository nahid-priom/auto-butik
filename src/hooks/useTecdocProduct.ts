import { useState, useEffect } from 'react';
import {
    TecdocProductData,
    TecdocProductResponse,
} from '~/interfaces/tecdoc';
import { getBackendUrl } from '~/config/backendUrl';

interface UseTecdocProductResult {
    data: TecdocProductData | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    // Convenience flags
    hasSpecs: boolean;
    hasVehicles: boolean;
    hasOeRefs: boolean;
}

/**
 * Custom hook to fetch TecDoc product data
 * @param productId - Vendure product ID (not SKU or artno)
 */
export function useTecdocProduct(productId: number | null): UseTecdocProductResult {
    const [data, setData] = useState<TecdocProductData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Don't fetch if no productId
        if (!productId) {
            setData(null);
            setIsLoading(false);
            setIsError(false);
            setError(null);
            return;
        }

        let canceled = false;

        const fetchTecdocData = async () => {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            try {
                const response = await fetch(`${getBackendUrl()}/tecdoc/product/${productId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result: TecdocProductResponse = await response.json();

                if (canceled) return;

                if (result.success) {
                    setData(result.data);
                } else {
                    setIsError(true);
                    setError(result.error || 'Failed to fetch TecDoc data');
                    setData(null);
                }
            } catch (err) {
                if (canceled) return;
                
                console.error('Error fetching TecDoc product data:', err);
                setIsError(true);
                setError(err instanceof Error ? err.message : 'Failed to fetch TecDoc data');
                setData(null);
            } finally {
                if (!canceled) {
                    setIsLoading(false);
                }
            }
        };

        fetchTecdocData();

        return () => {
            canceled = true;
        };
    }, [productId]);

    return {
        data,
        isLoading,
        isError,
        error,
        // Convenience flags
        hasSpecs: (data?.technicalSpecs?.length ?? 0) > 0,
        hasVehicles: (data?.compatibleVehicles?.length ?? 0) > 0,
        hasOeRefs: (data?.oeReferences?.length ?? 0) > 0,
    };
}
