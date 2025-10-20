// application
import { ICarData, IWheelData } from '~/interfaces/car';

const STORAGE_KEY = 'autobutik_car_search_history';
const MAX_HISTORY_ITEMS = 50; // Keep the most recent 50 searches

export interface ICarSearchHistoryItem {
    id: string; // unique identifier for the search
    timestamp: number; // when the search was performed
    searchType: 'registration' | 'manual'; // how the search was performed
    data: ICarData | IWheelData; // the actual car/wheel data
    searchMetadata?: {
        // Additional info about the search
        registrationNumber?: string;
        brand?: string;
        year?: string;
        model?: string;
        engineId?: string;
        engineDescription?: string; // Engine description from dropdown for manual searches
    };
}

/**
 * Generates a unique ID for a search history item
 */
function generateSearchId(data: ICarData | IWheelData, searchType: string): string {
    const timestamp = Date.now();
    const identifier = (data as any).WHEELID || (data as any).RegNr || (data as any).C_merke || 'unknown';
    return `${searchType}_${identifier}_${timestamp}`;
}

/**
 * Retrieves the car search history from local storage
 */
export function getCarSearchHistory(): ICarSearchHistoryItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading car search history:', error);
        return [];
    }
}

/**
 * Adds a new search to the history
 */
export function addCarSearchToHistory(
    data: ICarData | IWheelData,
    searchType: 'registration' | 'manual',
    searchMetadata?: ICarSearchHistoryItem['searchMetadata'],
): void {
    try {
        const history = getCarSearchHistory();
        
        const newItem: ICarSearchHistoryItem = {
            id: generateSearchId(data, searchType),
            timestamp: Date.now(),
            searchType,
            data,
            searchMetadata,
        };

        // Add to the beginning of the array (most recent first)
        const updatedHistory = [newItem, ...history];

        // Keep only the most recent items
        const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('Error saving car search to history:', error);
    }
}

/**
 * Clears the entire search history
 */
export function clearCarSearchHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing car search history:', error);
    }
}

/**
 * Removes a specific item from the history by ID
 */
export function removeCarSearchFromHistory(id: string): void {
    try {
        const history = getCarSearchHistory();
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing car search from history:', error);
    }
}

/**
 * Gets the most recent search from history
 */
export function getMostRecentSearch(): ICarSearchHistoryItem | null {
    const history = getCarSearchHistory();
    return history.length > 0 ? history[0] : null;
}

/**
 * Gets search history filtered by search type
 */
export function getSearchHistoryByType(searchType: 'registration' | 'manual'): ICarSearchHistoryItem[] {
    const history = getCarSearchHistory();
    return history.filter(item => item.searchType === searchType);
}

/**
 * Checks if a similar search already exists in recent history (within last 5 items)
 * to avoid duplicates for the exact same vehicle
 */
export function hasSimilarRecentSearch(data: ICarData | IWheelData): boolean {
    const history = getCarSearchHistory();
    const recentHistory = history.slice(0, 5); // Check only the 5 most recent
    
    const wheelId = (data as any).WHEELID;
    const regNr = (data as any).RegNr;
    
    return recentHistory.some(item => {
        const itemWheelId = (item.data as any).WHEELID;
        const itemRegNr = (item.data as any).RegNr;
        
        // Match by WHEELID if available, otherwise by registration number
        if (wheelId && itemWheelId) {
            return wheelId === itemWheelId;
        }
        if (regNr && itemRegNr) {
            return regNr === itemRegNr;
        }
        
        return false;
    });
}

