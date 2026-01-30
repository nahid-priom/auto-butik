import { useState, useEffect } from 'react';
import { carApi, IProductSearchResponse } from '~/api/car.api';

export interface UseProductSearchOptions {
    term: string;
    modelId?: string | null;
    skip?: number;
    take?: number;
}

export function useProductSearch(options: UseProductSearchOptions) {
    const { term, modelId, skip = 0, take = 24 } = options;
    const [data, setData] = useState<IProductSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const termTrimmed = term.trim();
    const hasValidTerm = termTrimmed.length >= 2;

    useEffect(() => {
        if (!hasValidTerm) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        let canceled = false;

        const search = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await carApi.searchProducts({
                    term: termTrimmed,
                    modelId: modelId || undefined,
                    skip,
                    take,
                });
                if (!canceled) {
                    setData(result);
                }
            } catch (err) {
                if (!canceled) {
                    setError(err instanceof Error ? err.message : 'Search failed');
                }
            } finally {
                if (!canceled) {
                    setLoading(false);
                }
            }
        };

        search();
        return () => {
            canceled = true;
        };
    }, [termTrimmed, modelId ?? '', skip, take, hasValidTerm]);

    return {
        data,
        loading,
        error,
        hasValidTerm,
    };
}
