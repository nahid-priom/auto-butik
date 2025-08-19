import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ICurrentActiveCar, ICarData } from '~/interfaces/car';

interface ICarContextValue {
    currentActiveCar: ICurrentActiveCar | null;
    setCurrentActiveCar: (car: ICurrentActiveCar | null) => void;
    clearCurrentActiveCar: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const CarContext = createContext<ICarContextValue | undefined>(undefined);

const STORAGE_KEY = 'currentActiveCar';

interface CarProviderProps {
    children: ReactNode;
}

export function CarProvider({ children }: CarProviderProps) {
    const [currentActiveCar, setCurrentActiveCarState] = useState<ICurrentActiveCar | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load car data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedCar = localStorage.getItem(STORAGE_KEY);
                if (storedCar) {
                    const parsedCar: ICurrentActiveCar = JSON.parse(storedCar);
                    // Check if the stored car data is not too old (24 hours)
                    const now = Date.now();
                    const twentyFourHours = 24 * 60 * 60 * 1000;
                    
                    if (now - parsedCar.fetchedAt < twentyFourHours) {
                        setCurrentActiveCarState(parsedCar);
                    } else {
                        // Remove expired data
                        localStorage.removeItem(STORAGE_KEY);
                    }
                }
            } catch (error) {
                console.error('Error loading car data from localStorage:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Save car data to localStorage whenever it changes
    const setCurrentActiveCar = (car: ICurrentActiveCar | null) => {
        setCurrentActiveCarState(car);
        
        if (typeof window !== 'undefined') {
            try {
                if (car) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(car));
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (error) {
                console.error('Error saving car data to localStorage:', error);
            }
        }
    };

    const clearCurrentActiveCar = () => {
        setCurrentActiveCar(null);
    };

    const value: ICarContextValue = {
        currentActiveCar,
        setCurrentActiveCar,
        clearCurrentActiveCar,
        isLoading,
        setIsLoading,
    };

    return (
        <CarContext.Provider value={value}>
            {children}
        </CarContext.Provider>
    );
}

export function useCurrentActiveCar(): ICarContextValue {
    const context = useContext(CarContext);
    if (context === undefined) {
        throw new Error('useCurrentActiveCar must be used within a CarProvider');
    }
    return context;
}
