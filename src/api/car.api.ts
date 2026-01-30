import { ICarApiResponse, ITypesMap, IWheelData } from "~/interfaces/car";

// Get API base URL
const getApiUrl = () => {
    if (typeof window === "undefined") {
        // Server-side: use BASE_PATH environment variable
        return process.env.BASE_PATH || "http://localhost:3000";
    } else {
        // Client-side: use NEXT_PUBLIC_API_URL from next.config.js
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    }
};

export class CarApi {
    /**
     * Fetch car data by registration number
     * @param regNumber - Registration number (e.g., "PJZ 109")
     * @returns Promise with car data
     */
    async getCarByRegistration(regNumber: string): Promise<ICarApiResponse> {
        // Remove spaces and format the registration number
        const formattedRegNumber = regNumber.replace(/\s+/g, "");
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/${formattedRegNumber}`;

        console.log("Car API - Making request to:", url);
        console.log("Car API - Base URL:", baseUrl);
        console.log("Car API - Registration number:", formattedRegNumber);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Car API - HTTP error:", response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ICarApiResponse = await response.json();
            console.log("Car API - Response received:", data);
            return data;
        } catch (error) {
            console.error("Error fetching car data:", error);
            throw error;
        }
    }

    // Dropdown endpoints
    async getBrands(): Promise<string[]> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/dropdown/brands`;
        console.log("Car API - Brands URL:", url);
        try {
            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                console.error("Car API - Brands HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load brands: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load brands");
            return data.data as string[];
        } catch (error) {
            console.error("Car API - Brands error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    async getYears(brand: string): Promise<(number | string)[]> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/dropdown/years`;
        console.log("Car API - Years URL:", url, "Body:", { merke: brand });
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ merke: brand }),
            });

            if (!res.ok) {
                console.error("Car API - Years HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load years: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load years");
            return data.data as (number | string)[];
        } catch (error) {
            console.error("Car API - Years error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    async getModels(brand: string, year: string | number): Promise<string[]> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/dropdown/models`;
        console.log("Car API - Models URL:", url, "Body:", { merke: brand, year: String(year) });
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ merke: brand, year: String(year) }),
            });

            if (!res.ok) {
                console.error("Car API - Models HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load models: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load models");
            return data.data as string[];
        } catch (error) {
            console.error("Car API - Models error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    async getEngines(brand: string, year: string | number, model: string): Promise<ITypesMap> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/dropdown/types`;
        console.log("Car API - Engines URL:", url, "Body:", { merke: brand, year: String(year), modell: model });
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ merke: brand, year: String(year), modell: model }),
            });

            if (!res.ok) {
                console.error("Car API - Engines HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load engines: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load engines");
            return data.data as ITypesMap;
        } catch (error) {
            console.error("Car API - Engines error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    async getWheelDataByModelId(modelId: string): Promise<IWheelData> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/dropdown/wheel-id`;
        console.log("Car API - Wheel URL:", url, "Body:", { mid: modelId });
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mid: modelId }),
            });

            if (!res.ok) {
                console.error("Car API - Wheel HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load wheel data: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load wheel data");
            return data.data as IWheelData;
        } catch (error) {
            console.error("Car API - Wheel error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    /**
     * Get categories (collections) with product counts for a specific vehicle model
     * @param modelId - The TecDoc KTYPE / model ID from car lookup
     * @param parentId - Optional parent category ID to get subcategories
     * @returns Promise with categories data
     */
    async getCategoriesForVehicle(modelId: string, parentId?: string | number): Promise<IVehicleCategoriesResponse> {
        const baseUrl = getApiUrl();
        const params = new URLSearchParams();
        if (parentId !== undefined) {
            params.append("parentId", String(parentId));
        }
        const url = `${baseUrl}/car/categories/${modelId}${params.toString() ? `?${params.toString()}` : ""}`;
        console.log("Car API - Categories URL:", url);
        try {
            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                console.error("Car API - Categories HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load categories: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load categories");
            return data;
        } catch (error) {
            console.error("Car API - Categories error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
        }
    }

    /**
     * Get the full category tree (all categories nested)
     * @returns Promise with category tree data
     */
    async getCategoryTree(): Promise<ICategoryTreeResponse> {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/car/categories/tree`;
        console.log("Car API - Category Tree URL:", url);
        try {
            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                console.error("Car API - Category Tree HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load category tree: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load category tree");
            return data;
        } catch (error) {
            console.error("Car API - Category Tree error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
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
        } = {}
    ): Promise<IVehicleProductsResponse> {
        const baseUrl = getApiUrl();
        const { skip = 0, take = 24, term = "", collectionSlug = "", collectionId } = options;
        
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

        const url = `${baseUrl}/car/products/${modelId}${params.toString() ? `?${params.toString()}` : ""}`;
        console.log("Car API - Products URL:", url);
        try {
            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                console.error("Car API - Products HTTP error:", res.status, res.statusText);
                throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!data.success) throw new Error("Failed to load products");
            return data;
        } catch (error) {
            console.error("Car API - Products error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Check CORS configuration on backend. Ensure https://api.autobutik.se allows credentials from your origin.",
                );
            }
            throw error;
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
        const baseUrl = getApiUrl();
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
            const res = await fetch(url, {
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                throw new Error(`Search failed: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (!data.success) throw new Error("Search failed");
            return data;
        } catch (error) {
            console.error("Car API - Search error:", error);
            throw error;
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

export interface IVehicleProduct {
    productId: string;
    productName: string;
    slug: string;
    description: string | null;
    sku: string;
    tecDoc: string | null;
    icIndex: string | null;
    price: number;
    currencyCode: string;
    imagePreview: string | null;
}

export interface IVehicleProductsResponse {
    success: boolean;
    modelId: string;
    ktype: string;
    totalItems: number;
    skip: number;
    take: number;
    items: IVehicleProduct[];
}

// Category tree interfaces
export interface ICategoryTreeNode {
    id: number;
    name: string;
    children: ICategoryTreeNode[];
}

export interface ICategoryTreeResponse {
    success: boolean;
    totalCategories: number;
    rootCategories: number;
    categories: ICategoryTreeNode[];
}

export const carApi = new CarApi();
