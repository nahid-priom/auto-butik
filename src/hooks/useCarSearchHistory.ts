// react
import { useState, useEffect, useCallback } from 'react';
// application
import {
    getCarSearchHistory,
    clearCarSearchHistory,
    removeCarSearchFromHistory,
    getMostRecentSearch,
    getSearchHistoryByType,
    ICarSearchHistoryItem,
} from '~/services/car-search-history';

/**
 * Custom hook for managing car search history
 */
export function useCarSearchHistory() {
    const [history, setHistory] = useState<ICarSearchHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load history from local storage
    const loadHistory = useCallback(() => {
        setIsLoading(true);
        try {
            const data = getCarSearchHistory();
            setHistory(data);
        } catch (error) {
            console.error('Error loading car search history:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load history on mount
    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    // Clear all history
    const clearHistory = useCallback(() => {
        clearCarSearchHistory();
        setHistory([]);
    }, []);

    // Remove a specific item
    const removeItem = useCallback((id: string) => {
        removeCarSearchFromHistory(id);
        loadHistory();
    }, [loadHistory]);

    // Get most recent search
    const getMostRecent = useCallback(() => {
        return getMostRecentSearch();
    }, []);

    // Get history by type
    const getByType = useCallback((searchType: 'registration' | 'manual') => {
        return getSearchHistoryByType(searchType);
    }, []);

    // Refresh history (useful after external changes)
    const refresh = useCallback(() => {
        loadHistory();
    }, [loadHistory]);

    return {
        history,
        isLoading,
        clearHistory,
        removeItem,
        getMostRecent,
        getByType,
        refresh,
    };
}

export default useCarSearchHistory;

