// TecDoc Product Details API Types

/**
 * Technical specification for a product (e.g., dimensions, weight)
 */
export interface TechnicalSpec {
    name: string;   // Swedish name, e.g., "Ytterdiameter [mm]"
    value: string;  // The value, e.g., "272"
    unit?: string;  // Optional unit extracted from name, e.g., "mm"
}

/**
 * A vehicle that is compatible with a product
 */
export interface Vehicle {
    ktypno: string;    // TecDoc K-Type number (vehicle identifier)
    model: string;     // Model/chassis code, e.g., "C4", "307", "U6U_"
    years: string;     // Year range, e.g., "1999-08 to 2006-10"
    engine: string;    // Engine description, e.g., "Diesel, 2.0L, 80kW/109HP, 1997cc"
}

/**
 * Group of vehicles by manufacturer
 */
export interface VehicleGroup {
    manufacturer: string;      // Full name, e.g., "Citroën"
    manufacturerCode: string;  // TecDoc code, e.g., "CITRO"
    vehicles: Vehicle[];
}

/**
 * OE (Original Equipment) reference numbers grouped by manufacturer
 */
export interface OeReferenceGroup {
    manufacturer: string;   // OE manufacturer name, e.g., "BOSCH"
    references: string[];   // Array of reference numbers
}

/**
 * Complete TecDoc product data
 */
export interface TecdocProductData {
    productId: number;
    technicalSpecs: TechnicalSpec[];
    compatibleVehicles: VehicleGroup[];
    oeReferences: OeReferenceGroup[];
}

/**
 * API response wrapper
 */
export interface TecdocProductResponse {
    success: boolean;
    elapsedMs: number;
    data: TecdocProductData;
    error?: string; // Only present when success is false
}
