# Car Search History Feature

## Overview

The Car Search History feature automatically stores all car searches (both registration-based and manual selection) in the browser's local storage. This creates a persistent browsing history that works for both logged-in and non-logged-in users.

## Key Features

- **Automatic Storage**: Every successful car search is automatically saved
- **Works Offline**: Stores data in browser local storage
- **No Authentication Required**: Available for all users
- **Persistent**: Data persists across browser sessions
- **Limited Size**: Keeps the 50 most recent searches (configurable)
- **Duplicate Prevention**: Checks for similar recent searches to avoid duplicates

## Files Created/Modified

### New Files

1. **`src/services/car-search-history.ts`**
   - Core utility module for managing search history
   - Provides all CRUD operations for local storage
   - Exports helper functions and the `ICarSearchHistoryItem` interface

2. **`src/hooks/useCarSearchHistory.ts`**
   - Custom React hook for accessing search history
   - Provides reactive state management
   - Makes it easy to integrate history into any component

3. **`src/components/widgets/WidgetCarSearchHistory.tsx`**
   - Ready-to-use widget component for displaying search history
   - Features: clickable items, remove individual items, clear all, timestamps
   - Fully styled and accessible

4. **`src/scss/widgets/_widget-car-history.scss`**
   - Styling for the search history widget
   - Responsive and follows the existing design system

5. **`src/pages/demo/car-search-history.tsx`**
   - Complete demo page showing the feature in action
   - Includes documentation and usage examples
   - Access at: `/demo/car-search-history`

### Modified Files

1. **`src/components/shared/CarLookupForm.tsx`**
   - Added automatic history saving on successful searches
   - Saves both registration searches and manual selections
   - Includes search metadata (registration number, brand, year, model, engine)

2. **`src/scss/style.scss`**
   - Added import for the new widget styles

## Data Structure

### ICarSearchHistoryItem

```typescript
interface ICarSearchHistoryItem {
    id: string;                    // Unique identifier
    timestamp: number;              // Unix timestamp
    searchType: 'registration' | 'manual'; // Search method
    data: ICarData | IWheelData;   // Complete vehicle data
    searchMetadata?: {              // Optional search context
        registrationNumber?: string;
        brand?: string;
        year?: string;
        model?: string;
        engineId?: string;
    };
}
```

## API Reference

### Core Functions (from `car-search-history.ts`)

```typescript
// Get all search history
getCarSearchHistory(): ICarSearchHistoryItem[]

// Add a new search to history
addCarSearchToHistory(
    data: ICarData | IWheelData,
    searchType: 'registration' | 'manual',
    searchMetadata?: object
): void

// Clear all history
clearCarSearchHistory(): void

// Remove specific item
removeCarSearchFromHistory(id: string): void

// Get most recent search
getMostRecentSearch(): ICarSearchHistoryItem | null

// Get history by type
getSearchHistoryByType(searchType: 'registration' | 'manual'): ICarSearchHistoryItem[]

// Check for similar recent searches
hasSimilarRecentSearch(data: ICarData | IWheelData): boolean
```

### React Hook (from `useCarSearchHistory.ts`)

```typescript
const {
    history,        // Array of all history items
    isLoading,      // Loading state
    clearHistory,   // Function to clear all
    removeItem,     // Function to remove one item
    getMostRecent,  // Function to get latest
    getByType,      // Function to filter by type
    refresh,        // Function to reload from storage
} = useCarSearchHistory();
```

## Usage Examples

### Using the Hook in a Component

```tsx
import { useCarSearchHistory } from '~/hooks/useCarSearchHistory';

function MyComponent() {
    const { history, clearHistory } = useCarSearchHistory();
    
    return (
        <div>
            <h3>Recent Searches: {history.length}</h3>
            {history.map(item => (
                <div key={item.id}>
                    {item.data.C_merke} {item.data.C_modell}
                </div>
            ))}
            <button onClick={clearHistory}>Clear All</button>
        </div>
    );
}
```

### Using the Widget

```tsx
import WidgetCarSearchHistory from '~/components/widgets/WidgetCarSearchHistory';

function Sidebar() {
    const handleItemClick = (item) => {
        // Do something with the selected item
        console.log('Selected:', item);
    };
    
    return (
        <WidgetCarSearchHistory
            title="Recent Searches"
            maxItems={10}
            onItemClick={handleItemClick}
        />
    );
}
```

### Manually Adding to History

```tsx
import { addCarSearchToHistory } from '~/services/car-search-history';

function handleSearch(carData) {
    addCarSearchToHistory(
        carData,
        'registration',
        { registrationNumber: 'ABC123' }
    );
}
```

## Configuration

### Maximum Items

To change the maximum number of stored searches, edit `MAX_HISTORY_ITEMS` in `src/services/car-search-history.ts`:

```typescript
const MAX_HISTORY_ITEMS = 50; // Change this value
```

### Storage Key

The local storage key is defined as:

```typescript
const STORAGE_KEY = 'autobutik_car_search_history';
```

You can change this if needed for branding or avoiding conflicts.

## How It Works

1. **User performs a search** (either by registration or manual selection)
2. **CarLookupForm** receives the car data from the API
3. **Automatically calls** `addCarSearchToHistory()` with the data
4. **Function saves** the search to `localStorage` with timestamp and metadata
5. **Array is trimmed** to keep only the most recent 50 items
6. **Components using** `useCarSearchHistory()` hook automatically update

## Browser Compatibility

Works in all modern browsers that support:
- `localStorage` API
- ES6+ JavaScript features
- React 16.8+ (for hooks)

## Testing

Visit the demo page to test the feature:
```
http://localhost:3000/demo/car-search-history
```

The demo page includes:
- Car lookup form with automatic history saving
- Live display of saved searches
- All CRUD operations (view, remove, clear)
- Full documentation and examples

## Future Enhancements

Possible improvements:
1. Sync history with user account when logged in
2. Export/import history
3. Search within history
4. Filter by date range
5. Favorite/pin specific searches
6. Analytics on popular searches
7. Share history between devices (via cloud sync)

## Troublesho

### History not saving
- Check browser's local storage isn't disabled
- Verify browser's storage quota isn't exceeded
- Check browser console for errors

### History not updating in UI
- Ensure component is using `useCarSearchHistory()` hook
- Try calling `refresh()` from the hook
- Check React DevTools for state updates

### Storage quota exceeded
- Reduce `MAX_HISTORY_ITEMS`
- Implement data compression
- Clear old history items more aggressively

## Support

For questions or issues:
1. Check this documentation
2. Review the demo page at `/demo/car-search-history`
3. Examine the code in the files listed above
4. Check browser console for error messages

