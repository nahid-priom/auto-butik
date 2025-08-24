import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ICarData, IWheelData } from '~/interfaces/car';

export interface IGarageVehicle {
    id: string;
    data: ICarData | IWheelData;
    addedAt: number;
}

interface IGarageContextValue {
    vehicles: IGarageVehicle[];
    addVehicle: (data: ICarData | IWheelData) => void;
    removeVehicle: (id: string) => void;
    clearGarage: () => void;
}

const GarageContext = createContext<IGarageContextValue | undefined>(undefined);

const STORAGE_KEY = 'garageVehicles';

export function GarageProvider({ children }: { children: React.ReactNode }) {
    const [vehicles, setVehicles] = useState<IGarageVehicle[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as IGarageVehicle[];
                setVehicles(parsed);
            }
        } catch (e) {
            console.error('Failed to load garage from localStorage', e);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
        } catch (e) {
            console.error('Failed to save garage to localStorage', e);
        }
    }, [vehicles]);

    const addVehicle = (data: ICarData | IWheelData) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setVehicles((prev) => [{ id, data, addedAt: Date.now() }, ...prev]);
    };

    const removeVehicle = (id: string) => {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
    };

    const clearGarage = () => setVehicles([]);

    const value = useMemo<IGarageContextValue>(() => ({ vehicles, addVehicle, removeVehicle, clearGarage }), [vehicles]);

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


