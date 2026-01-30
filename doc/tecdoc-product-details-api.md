# TecDoc Product Details API - Frontend Integration Guide

## Overview

This API provides detailed technical information for automotive parts, including specifications, vehicle compatibility, and OE (Original Equipment) reference numbers. Data is sourced from the TecDoc database and returned with Swedish translations.

---

## API Endpoint

```
GET /tecdoc/product/{productId}
```

### Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://api.autobutik.se` (or your production URL)

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | number | Yes | The Vendure product ID (not SKU or artno) |

### Example Request

```typescript
const productId = 388447;
const response = await fetch(`http://localhost:3001/tecdoc/product/${productId}`);
const result = await response.json();
```

---

## Response Structure

```typescript
interface TecdocProductResponse {
  success: boolean;
  elapsedMs: number;
  data: {
    productId: number;
    technicalSpecs: TechnicalSpec[];
    compatibleVehicles: VehicleGroup[];
    oeReferences: OeReferenceGroup[];
  };
  error?: string; // Only present when success is false
}
```

---

## Section 1: Technical Specifications (`technicalSpecs`)

Product attributes like dimensions, weight, material properties, etc. with Swedish names.

### Data Structure

```typescript
interface TechnicalSpec {
  name: string;   // Swedish name, e.g., "Ytterdiameter [mm]"
  value: string;  // The value, e.g., "272"
  unit?: string;  // Optional unit extracted from name, e.g., "mm"
}
```

### Example Response

```json
{
  "technicalSpecs": [
    { "name": "Ytterdiameter [mm]", "value": "272", "unit": "mm" },
    { "name": "Bromsskivans tjocklek [mm]", "value": "10", "unit": "mm" },
    { "name": "Minsta tjocklek [mm]", "value": "8", "unit": "mm" },
    { "name": "Höjd [mm]", "value": "48.3", "unit": "mm" },
    { "name": "Hålkrets Ø [mm]", "value": "112", "unit": "mm" },
    { "name": "Antal hål", "value": "9" },
    { "name": "Vikt [kg]", "value": "2,059", "unit": "kg" }
  ]
}
```

### Frontend Display Example

```tsx
// React component example
function TechnicalSpecs({ specs }: { specs: TechnicalSpec[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {specs.map((spec, index) => (
        <div key={index} className="flex justify-between border-b py-2">
          <span className="text-gray-600">{spec.name}:</span>
          <span className="font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}
```

### Common Swedish Attribute Names

| Swedish Name | English Meaning |
|--------------|-----------------|
| Ytterdiameter [mm] | Outer diameter |
| Bromsskivans tjocklek [mm] | Brake disc thickness |
| Minsta tjocklek [mm] | Minimum thickness |
| Höjd [mm] | Height |
| Hålkrets Ø [mm] | Bolt circle diameter |
| Antal hål | Number of holes |
| Vikt [kg] | Weight |
| Bredd [mm] | Width |
| Förpackningslängd [cm] | Package length |
| Förpackningsbredd [cm] | Package width |
| Förpackningshöjd [cm] | Package height |
| Tandantal | Number of teeth |

---

## Section 2: Compatible Vehicles (`compatibleVehicles`)

List of vehicles that this part fits, grouped by manufacturer.

### Data Structure

```typescript
interface VehicleGroup {
  manufacturer: string;      // Full name, e.g., "Citroën"
  manufacturerCode: string;  // TecDoc code, e.g., "CITRO"
  vehicles: Vehicle[];
}

interface Vehicle {
  ktypno: string;    // TecDoc K-Type number (vehicle identifier)
  model: string;     // Model/chassis code, e.g., "C4", "307", "U6U_"
  years: string;     // Year range, e.g., "1999-08 to 2006-10"
  engine: string;    // Engine description, e.g., "Diesel, 2.0L, 80kW/109HP, 1997cc"
}
```

### Example Response

```json
{
  "compatibleVehicles": [
    {
      "manufacturer": "Citroën",
      "manufacturerCode": "CITRO",
      "vehicles": [
        {
          "ktypno": "000013862",
          "model": "U6",
          "years": "1999-08 to 2002-07",
          "engine": "Diesel, 2.0L, 80kW/109HP, 1997cc"
        },
        {
          "ktypno": "000010545",
          "model": "BS_",
          "years": "2002-01 to 2006-10",
          "engine": "Diesel, 2.0L, 80kW/109HP, 1997cc"
        }
      ]
    },
    {
      "manufacturer": "Peugeot",
      "manufacturerCode": "PEUGE",
      "vehicles": [
        {
          "ktypno": "000018276",
          "model": "221",
          "years": "1999-08 to 2002-08",
          "engine": "Diesel, 2.0L, 80kW/109HP, 1997cc"
        }
      ]
    }
  ]
}
```

### Frontend Display Example

```tsx
// React component - Accordion/collapsible by manufacturer
function CompatibleVehicles({ groups }: { groups: VehicleGroup[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Passar följande fordon:</h3>
      
      {groups.map((group) => (
        <div key={group.manufacturerCode} className="border rounded">
          {/* Manufacturer header - clickable */}
          <button
            onClick={() => setExpanded(
              expanded === group.manufacturerCode ? null : group.manufacturerCode
            )}
            className="w-full flex justify-between items-center p-3 bg-gray-50"
          >
            <span className="font-medium">{group.manufacturer}</span>
            <span className="text-gray-500">
              {group.vehicles.length} fordon
            </span>
          </button>

          {/* Vehicle list - expandable */}
          {expanded === group.manufacturerCode && (
            <div className="p-3 space-y-2">
              {group.vehicles.map((vehicle, idx) => (
                <div key={idx} className="border-b pb-2 last:border-0">
                  <div className="font-medium">{vehicle.model}</div>
                  <div className="text-sm text-gray-600">
                    {vehicle.years}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vehicle.engine}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Checking if Current Vehicle is Compatible

If the user has selected a vehicle (via the car lookup feature), you can highlight compatibility:

```tsx
function checkVehicleCompatibility(
  compatibleVehicles: VehicleGroup[],
  userKtypno: string
): boolean {
  return compatibleVehicles.some(group =>
    group.vehicles.some(vehicle => vehicle.ktypno === userKtypno)
  );
}

// Usage in component
const isCompatible = checkVehicleCompatibility(
  data.compatibleVehicles,
  selectedVehicle.ktypno
);

// Display compatibility badge
{isCompatible && (
  <div className="bg-green-100 text-green-800 px-3 py-2 rounded flex items-center">
    <CheckIcon className="w-5 h-5 mr-2" />
    Denna artikel är lämplig för ditt fordon
  </div>
)}
```

---

## Section 3: OE Reference Numbers (`oeReferences`)

Original Equipment manufacturer reference numbers (cross-reference numbers).

### Data Structure

```typescript
interface OeReferenceGroup {
  manufacturer: string;   // OE manufacturer name, e.g., "BOSCH"
  references: string[];   // Array of reference numbers
}
```

### Example Response

```json
{
  "oeReferences": [
    {
      "manufacturer": "BOSCH",
      "references": ["1987949585", "1987949715", "1987473548"]
    },
    {
      "manufacturer": "CITROËN/PEUGEOT",
      "references": ["9467574780", "9636559880"]
    },
    {
      "manufacturer": "FIAT",
      "references": ["9636559880", "71753146"]
    }
  ]
}
```

### Frontend Display Example

```tsx
function OeReferences({ groups }: { groups: OeReferenceGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">OE-nummer (originaldelsnummer)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, index) => (
          <div key={index} className="border rounded p-3">
            <div className="font-medium text-gray-700 mb-2">
              {group.manufacturer}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.references.map((ref, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Complete Integration Example

### TypeScript Types

```typescript
// types/tecdoc.ts

export interface TechnicalSpec {
  name: string;
  value: string;
  unit?: string;
}

export interface Vehicle {
  ktypno: string;
  model: string;
  years: string;
  engine: string;
}

export interface VehicleGroup {
  manufacturer: string;
  manufacturerCode: string;
  vehicles: Vehicle[];
}

export interface OeReferenceGroup {
  manufacturer: string;
  references: string[];
}

export interface TecdocProductData {
  productId: number;
  technicalSpecs: TechnicalSpec[];
  compatibleVehicles: VehicleGroup[];
  oeReferences: OeReferenceGroup[];
}

export interface TecdocProductResponse {
  success: boolean;
  elapsedMs: number;
  data: TecdocProductData;
  error?: string;
}
```

### API Hook (React Query / SWR)

```typescript
// hooks/useTecdocProduct.ts
import useSWR from 'swr';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function useTecdocProduct(productId: number | null) {
  const { data, error, isLoading } = useSWR<TecdocProductResponse>(
    productId ? `${API_BASE}/tecdoc/product/${productId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: error || (data && !data.success),
    error: error?.message || data?.error,
  };
}
```

### Full Page Component

```tsx
// components/ProductDetails.tsx
import { useTecdocProduct } from '@/hooks/useTecdocProduct';

interface ProductDetailsProps {
  productId: number;
  selectedVehicleKtypno?: string; // If user has selected a vehicle
}

export function ProductDetails({ productId, selectedVehicleKtypno }: ProductDetailsProps) {
  const { data, isLoading, isError, error } = useTecdocProduct(productId);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Kunde inte ladda produktinformation: {error}
      </div>
    );
  }

  if (!data) return null;

  // Check vehicle compatibility
  const isCompatible = selectedVehicleKtypno
    ? data.compatibleVehicles.some(g =>
        g.vehicles.some(v => v.ktypno === selectedVehicleKtypno)
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Vehicle Compatibility Banner */}
      {isCompatible !== null && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          isCompatible 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {isCompatible ? (
            <>
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <span className="text-green-800">
                Denna artikel är lämplig för ditt fordon
              </span>
            </>
          ) : (
            <>
              <ExclamationIcon className="w-6 h-6 text-yellow-600" />
              <span className="text-yellow-800">
                Denna artikel passar kanske inte ditt valda fordon
              </span>
            </>
          )}
        </div>
      )}

      {/* Technical Specifications */}
      {data.technicalSpecs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Tekniska specifikationer</h2>
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {data.technicalSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between p-3 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="text-gray-600">{spec.name}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compatible Vehicles */}
      {data.compatibleVehicles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Passar följande fordon ({getTotalVehicleCount(data.compatibleVehicles)} varianter)
          </h2>
          <VehicleAccordion groups={data.compatibleVehicles} />
        </section>
      )}

      {/* OE References */}
      {data.oeReferences.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">OE-nummer</h2>
          <OeReferences groups={data.oeReferences} />
        </section>
      )}
    </div>
  );
}

// Helper function
function getTotalVehicleCount(groups: VehicleGroup[]): number {
  return groups.reduce((sum, g) => sum + g.vehicles.length, 0);
}
```

---

## Error Handling

### Response When Product Not Found

```json
{
  "success": false,
  "error": "Product not found"
}
```

### Response When No TecDoc Data

```json
{
  "success": true,
  "elapsedMs": 45,
  "data": {
    "productId": 12345,
    "technicalSpecs": [],
    "compatibleVehicles": [],
    "oeReferences": []
  }
}
```

### Frontend Error Handling

```typescript
export function useTecdocProduct(productId: number | null) {
  const { data, error, isLoading } = useSWR<TecdocProductResponse>(
    productId ? `${API_BASE}/tecdoc/product/${productId}` : null,
    fetcher
  );

  return {
    data: data?.success ? data.data : null,
    isLoading,
    isError: error || (data && !data.success),
    error: error?.message || data?.error,
    // Convenience flags
    hasSpecs: (data?.data?.technicalSpecs?.length ?? 0) > 0,
    hasVehicles: (data?.data?.compatibleVehicles?.length ?? 0) > 0,
    hasOeRefs: (data?.data?.oeReferences?.length ?? 0) > 0,
  };
}
```

---

## Performance Notes

| Metric | Value |
|--------|-------|
| First request | ~400-600ms (queries TecDoc DB) |
| Cached request | ~10-50ms (5-minute cache) |
| Cache TTL | 5 minutes |

The API implements server-side caching. Frontend can additionally cache using SWR/React Query with appropriate `staleTime` / `dedupingInterval`.

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Next.js dev server)
- `https://autobutik.se`
- `https://www.autobutik.se`

If you need additional origins, update the `allowedOrigins` array in the backend configuration.

---

## Testing the API

### Using curl

```bash
# Get product details
curl http://localhost:3001/tecdoc/product/388447 | jq

# Check cache statistics
curl http://localhost:3001/tecdoc/cache/stats
```

### Using browser console

```javascript
fetch('http://localhost:3001/tecdoc/product/388447')
  .then(r => r.json())
  .then(console.log);
```
