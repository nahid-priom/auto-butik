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
                    // Add ngrok bypass header for ngrok tunnels
                    "ngrok-skip-browser-warning": "true",
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
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
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
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
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
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
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
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
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
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
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
}

export const carApi = new CarApi();
