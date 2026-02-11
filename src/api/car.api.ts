import { ICarApiResponse, ITypesMap, IWheelData } from "~/interfaces/car";
import { logger } from "~/utils/logger";
import { getBackendUrl } from "~/config/backendUrl";
import { fetchWithLoader } from "~/api/fetchWithLoader";

/** Normalize fetch failures (e.g. TypeError: Failed to fetch, CORS, network down) to a plain Error so callers can handle and avoid unhandled runtime errors. */
function normalizeNetworkError(error: unknown, context: string): Error {
    const baseUrl = getBackendUrl();
    if (error instanceof Error) {
        const msg = (error.message || "").toLowerCase();
        if (error.name === "TypeError" || msg.includes("failed to fetch") || msg.includes("network")) {
            return new Error(`Car API (${context}): Backend unreachable or CORS blocked. Configured base: ${baseUrl}`);
        }
        return error;
    }
    return new Error(`Car API (${context}): Request failed.`);
}

export class CarApi {
    /**
     * Fetch car data by registration number
     * @param regNumber - Registration number (e.g., "PJZ 109")
     * @returns Promise with car data
     */
    async getCarByRegistration(regNumber: string): Promise<ICarApiResponse> {
        // Remove spaces and format the registration number
        const formattedRegNumber = regNumber.replace(/\s+/g, "");
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/${formattedRegNumber}`;

        logger.debug("Car API - Making request to:", url);

        try {
            const response = await fetchWithLoader(url, { method: "GET" }, "car/registration");

            if (!response.ok) {
                logger.error("Car API - HTTP error:", response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ICarApiResponse = await response.json();
            return data;
        } catch (error) {
            logger.error("Error fetching car data:", error);
            throw normalizeNetworkError(error, "getCarByRegistration");
        }
    }

    // Dropdown endpoints
    async getBrands(): Promise<string[]> {
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/dropdown/brands`;
        logger.debug("Car API - Brands URL:", url);
        try {
            const res = await fetchWithLoader(url, { method: "GET" }, "car/brands");

            if (!res.ok) {
                logger.error("Car API - Brands HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load brands: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load brands");
            return data.data as string[];
        } catch (error) {
            logger.error("Car API - Brands error:", error);
            throw normalizeNetworkError(error, "getBrands");
        }
    }

    async getYears(brand: string): Promise<(number | string)[]> {
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/dropdown/years`;
        logger.debug("Car API - Years URL:", url);
        try {
            const res = await fetchWithLoader(
                url,
                { method: "POST", body: JSON.stringify({ merke: brand }) },
                "car/years"
            );

            if (!res.ok) {
                logger.error("Car API - Years HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load years: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load years");
            return data.data as (number | string)[];
        } catch (error) {
            logger.error("Car API - Years error:", error);
            throw normalizeNetworkError(error, "getYears");
        }
    }

    async getModels(brand: string, year: string | number): Promise<string[]> {
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/dropdown/models`;
        logger.debug("Car API - Models URL:", url);
        try {
            const res = await fetchWithLoader(
                url,
                { method: "POST", body: JSON.stringify({ merke: brand, year: String(year) }) },
                "car/models"
            );

            if (!res.ok) {
                logger.error("Car API - Models HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load models: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load models");
            return data.data as string[];
        } catch (error) {
            logger.error("Car API - Models error:", error);
            throw normalizeNetworkError(error, "getModels");
        }
    }

    async getEngines(brand: string, year: string | number, model: string): Promise<ITypesMap> {
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/dropdown/types`;
        logger.debug("Car API - Engines URL:", url);
        try {
            const res = await fetchWithLoader(
                url,
                { method: "POST", body: JSON.stringify({ merke: brand, year: String(year), modell: model }) },
                "car/engines"
            );

            if (!res.ok) {
                logger.error("Car API - Engines HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load engines: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load engines");
            return data.data as ITypesMap;
        } catch (error) {
            logger.error("Car API - Engines error:", error);
            throw normalizeNetworkError(error, "getEngines");
        }
    }

    async getWheelDataByModelId(modelId: string): Promise<IWheelData> {
        const baseUrl = getBackendUrl();
        const url = `${baseUrl}/car/dropdown/wheel-id`;
        logger.debug("Car API - Wheel URL:", url);
        try {
            const res = await fetchWithLoader(
                url,
                { method: "POST", body: JSON.stringify({ mid: modelId }) },
                "car/wheel-id"
            );

            if (!res.ok) {
                logger.error("Car API - Wheel HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load wheel data: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load wheel data");
            return data.data as IWheelData;
        } catch (error) {
            logger.error("Car API - Wheel error:", error);
            throw normalizeNetworkError(error, "getWheelDataByModelId");
        }
    }

    /**
     * Get categories (collections) with product counts for a specific vehicle model
     * @param modelId - The TecDoc KTYPE / model ID from car lookup
     * @param parentId - Optional parent category ID to get subcategories
     * @returns Promise with categories data
     */
    async getCategoriesForVehicle(modelId: string, parentId?: string | number): Promise<IVehicleCategoriesResponse> {
        const baseUrl = getBackendUrl();
        const params = new URLSearchParams();
        if (parentId !== undefined) {
            params.append("parentId", String(parentId));
        }
        const url = `${baseUrl}/car/categories/${modelId}${params.toString() ? `?${params.toString()}` : ""}`;
        logger.debug("Car API - Categories URL:", url);
        try {
            const res = await fetchWithLoader(url, { method: "GET" }, "car/categories");

            if (!res.ok) {
                logger.error("Car API - Categories HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load categories: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load categories");
            return data;
        } catch (error) {
            logger.error("Car API - Categories error:", error);
            throw normalizeNetworkError(error, "getCategoriesForVehicle");
        }
    }

    /**
     * Get the full category tree (all categories nested)
     * @param modelId - Optional TecDoc KTYPE / model ID to filter categories for a specific vehicle
     * @returns Promise with category tree data
     */
    async getCategoryTree(modelId?: string): Promise<ICategoryTreeResponse> {
        const baseUrl = getBackendUrl();
        const params = new URLSearchParams();
        if (modelId) {
            params.append("modelId", modelId);
        }
        const url = `${baseUrl}/car/categories/tree${params.toString() ? `?${params.toString()}` : ""}`;
        logger.debug("Car API - Category Tree URL:", url);
        try {
            const res = await fetchWithLoader(url, { method: "GET" }, "car/categoryTree");

            if (!res.ok) {
                logger.error("Car API - Category Tree HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load category tree: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load category tree");
            return data;
        } catch (error) {
            logger.error("Car API - Category Tree error:", error);
            throw normalizeNetworkError(error, "getCategoryTree");
        }
    }

    /**
     * Get products for a specific vehicle model
     * @param modelId - The TecDoc KTYPE / model ID from car lookup
     * @param options - Query options (skip, take, term, collectionSlug, collectionId)
     * @returns Promise with products data
     */
    async getProductsForVehicle(
        modelId: string,
        options: {
            skip?: number;
            take?: number;
            term?: string;
            collectionSlug?: string;
            collectionId?: string | number;
            brand?: string;
            position?: string;
        } = {}
    ): Promise<IVehicleProductsResponse> {
        const baseUrl = getBackendUrl();
        const { skip = 0, take = 24, term = "", collectionSlug = "", collectionId, brand, position } = options;
        
        const params = new URLSearchParams();
        if (skip > 0) params.append("skip", skip.toString());
        if (take !== 24) params.append("take", take.toString());
        if (term) params.append("term", term);
        // Prefer collectionId over collectionSlug when both are provided
        if (collectionId !== undefined && collectionId !== "") {
            params.append("collectionId", String(collectionId));
        } else if (collectionSlug) {
            params.append("collectionSlug", collectionSlug);
        }
        if (brand) params.append("brand", brand);
        if (position) params.append("position", position);

        const url = `${baseUrl}/car/products/${modelId}${params.toString() ? `?${params.toString()}` : ""}`;
        logger.debug("Car API - Products URL:", url);
        try {
            const res = await fetchWithLoader(url, { method: "GET" }, "car/products");

            if (!res.ok) {
                logger.error("Car API - Products HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load products");
            return data;
        } catch (error) {
            logger.error("Car API - Products error:", error);
            throw normalizeNetworkError(error, "getProductsForVehicle");
        }
    }

    /**
     * Product search (GET /car/search).
     * Without modelId: global search. With modelId: products compatible with that vehicle.
     * @param params - term (min 2 chars), optional modelId, skip, take
     */
    async searchProducts(params: {
        term: string;
        modelId?: string;
        skip?: number;
        take?: number;
        collectionId?: number;
        collectionSlug?: string;
    }): Promise<IProductSearchResponse> {
        const baseUrl = getBackendUrl();
        const { term, modelId, skip = 0, take = 24, collectionId, collectionSlug } = params;
        const searchParams = new URLSearchParams();
        searchParams.set("term", term);
        if (modelId) searchParams.set("modelId", modelId);
        if (skip > 0) searchParams.append("skip", skip.toString());
        if (take !== 24) searchParams.append("take", take.toString());
        if (collectionId != null) searchParams.append("collectionId", collectionId.toString());
        if (collectionSlug) searchParams.append("collectionSlug", collectionSlug);

        const url = `${baseUrl}/car/search?${searchParams.toString()}`;
        try {
            const res = await fetchWithLoader(url, { method: "GET" }, "car/search");
            if (!res.ok) {
                throw new Error(`Search failed: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (!data.success) throw new Error("Search failed");
            return data;
        } catch (error) {
            logger.error("Car API - Search error:", error);
            throw normalizeNetworkError(error, "searchProducts");
        }
    }
}

// Product search response (GET /car/search)
export interface IProductSearchResponse {
    success: boolean;
    search: {
        term: string;
        vehicleFiltered: boolean;
        ktype: string | null;
    };
    totalItems: number;
    skip: number;
    take: number;
    collection: { id: number; name: string; slug: string } | null;
    items: IVehicleProduct[];
}

// Vehicle catalog interfaces
export interface IVehicleCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    tecdocNodeId: string | null;
    tecdocPath: string | null;
    parentId: string | null;
    image: string | null;
    productCount: number;
    hasChildren: boolean;
}

export interface IVehicleCategoriesResponse {
    success: boolean;
    modelId: string;
    ktype: string;
    totalCategories: number;
    totalProducts: number;
    categories: IVehicleCategory[];
}

/** Technical spec from catalog API (name, value, optional unit) */
export interface IVehicleProductTechnicalSpec {
    name: string;
    value: string;
    unit?: string;
}

/** Special fitment info from catalog API (e.g. production years, side, notes) */
export interface IVehicleProductSpecialFitment {
    name: string;
    value: string;
}

export interface IVehicleProduct {
    productId: string | number;
    productName: string;
    slug: string;
    description: string | null;
    sku: string;
    tecDoc: string | null;
    icIndex: string | null;
    price: number;
    currencyCode: string;
    imagePreview: string | null;
    brand?: { name: string; imageUrl?: string | null } | null;
    technicalSpecs?: IVehicleProductTechnicalSpec[];
    ean?: string | null;
    specialFitment?: IVehicleProductSpecialFitment[];
}

/** Brand facet from products API */
export interface IVehicleProductFacetBrand {
    value: string;
    label: string;
    count: number;
    imageUrl?: string | null;
}

/** Position facet from products API */
export interface IVehicleProductFacetPosition {
    value: string;
    label: string;
    count: number;
}

export interface IVehicleProductsFacets {
    positions?: IVehicleProductFacetPosition[];
    brands?: IVehicleProductFacetBrand[];
    categories?: unknown[];
}

export interface IVehicleProductsResponse {
    success: boolean;
    modelId: string;
    ktype: string;
    totalItems: number;
    skip: number;
    take: number;
    facets?: IVehicleProductsFacets;
    collection?: { id: number; name: string; slug: string } | null;
    items: IVehicleProduct[];
}

// Category tree interfaces
export interface ICategoryTreeNode {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    productCount: number;
    children: ICategoryTreeNode[];
}

export interface ICategoryTreeResponse {
    success: boolean;
    totalCategories: number;
    rootCategories: number;
    categories: ICategoryTreeNode[];
}

export const carApi = new CarApi();
