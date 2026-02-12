import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ICarData, IWheelData } from '~/interfaces/car';

export interface IGarageVehicle {
    id: string;
    data: ICarData | IWheelData;
    addedAt: number;
}

interface IGarageContextValue {
    vehicles: IGarageVehicle[];
    currentCarId: string | null;
    addVehicle: (data: ICarData | IWheelData) => string;
    removeVehicle: (id: string) => void;
    clearGarage: () => void;
    setCurrentCar: (id: string | null) => void;
}

const GarageContext = createContext<IGarageContextValue | undefined>(undefined);

const STORAGE_KEY = 'garageVehicles';
const CURRENT_CAR_KEY = 'currentCarId';

/** Returns a stable key to detect duplicate vehicles (same car/wheel). */
function getVehicleLogicalKey(data: ICarData | IWheelData): string {
    const d = data as Record<string, unknown>;
    if (d.RegNr && typeof d.RegNr === 'string') return `reg:${String(d.RegNr).toUpperCase().trim()}`;
    if (d.WHEELID != null) return `wheel:${d.WHEELID}`;
    return `fallback:${d.C_merke ?? ''}|${d.C_modell ?? ''}|${d.C_typ ?? ''}`;
}

export function GarageProvider({ children }: { children: React.ReactNode }) {
    const [vehicles, setVehicles] = useState<IGarageVehicle[]>([]);
    const [currentCarId, setCurrentCarId] = useState<string | null>(null);

    // Load vehicles and current car from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as IGarageVehicle[];
                setVehicles(parsed);
            }
            
            const currentId = localStorage.getItem(CURRENT_CAR_KEY);
            if (currentId) {
                setCurrentCarId(currentId);
            }
        } catch (e) {
            console.error('Failed to load garage from localStorage', e);
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(CURRENT_CAR_KEY);
        }
    }, []);

    // Save vehicles to localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
        } catch (e) {
            console.error('Failed to save garage to localStorage', e);
        }
    }, [vehicles]);

    // Save current car to localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            if (currentCarId) {
                localStorage.setItem(CURRENT_CAR_KEY, currentCarId);
            } else {
                localStorage.removeItem(CURRENT_CAR_KEY);
            }
        } catch (e) {
            console.error('Failed to save current car to localStorage', e);
        }
    }, [currentCarId]);

    const addVehicle = (data: ICarData | IWheelData) => {
        const logicalKey = getVehicleLogicalKey(data);
        const existing = vehicles.find((v) => getVehicleLogicalKey(v.data) === logicalKey);
        if (existing) {
            setCurrentCarId(existing.id);
            return existing.id;
        }
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setVehicles((prev) => [{ id, data, addedAt: Date.now() }, ...prev]);
        setCurrentCarId(id);
        return id;
    };

    const removeVehicle = (id: string) => {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        // If removing current car, clear current car
        if (currentCarId === id) {
            setCurrentCarId(null);
        }
    };

    const clearGarage = () => {
        setVehicles([]);
        setCurrentCarId(null);
    };

    const setCurrentCar = (id: string | null) => {
        // Verify the car exists in the garage
        if (id && !vehicles.find(v => v.id === id)) {
            console.warn('Attempted to set current car to non-existent vehicle:', id);
            return;
        }
        setCurrentCarId(id);
    };

    const value = useMemo<IGarageContextValue>(
        () => ({ vehicles, currentCarId, addVehicle, removeVehicle, clearGarage, setCurrentCar }), 
        [vehicles, currentCarId]
    );

    return (
        <GarageContext.Provider value={value}>
            {children}
        </GarageContext.Provider>
    );
}

export function useGarage() {
    const ctx = useContext(GarageContext);
    if (!ctx) throw new Error('useGarage must be used within GarageProvider');
    return ctx;
}


