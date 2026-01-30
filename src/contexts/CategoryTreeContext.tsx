import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { carApi, ICategoryTreeNode, ICategoryTreeResponse } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { ICarData } from '~/interfaces/car';

interface CategoryTreeContextValue {
    tree: ICategoryTreeNode[] | null;
    loading: boolean;
    error: string | null;
    totalCategories: number;
    rootCategories: number;
    currentModelId: string | null;
    findCategoryById: (id: number) => ICategoryTreeNode | null;
    getChildren: (categoryId: number) => ICategoryTreeNode[];
    getBreadcrumb: (categoryId: number) => ICategoryTreeNode[];
    isLeafCategory: (categoryId: number) => boolean;
    refreshTree: () => Promise<void>;
}

const CategoryTreeContext = createContext<CategoryTreeContextValue | null>(null);

export function CategoryTreeProvider({ children }: { children: React.ReactNode }) {
    const [tree, setTree] = useState<ICategoryTreeNode[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCategories, setTotalCategories] = useState(0);
    const [rootCategories, setRootCategories] = useState(0);
    const [currentModelId, setCurrentModelId] = useState<string | null>(null);
    const loadingRef = useRef(false);
    const lastModelIdRef = useRef<string | null>(null);
    
    // Get the current active car
    const { currentActiveCar } = useCurrentActiveCar();

    // Helper function to find a category by ID in the tree (recursive)
    const findInTree = useCallback((nodes: ICategoryTreeNode[], id: number): ICategoryTreeNode | null => {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = findInTree(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }, []);

    // Find category by ID
    const findCategoryById = useCallback((id: number): ICategoryTreeNode | null => {
        if (!tree) return null;
        return findInTree(tree, id);
    }, [tree, findInTree]);

    // Get children of a category
    const getChildren = useCallback((categoryId: number): ICategoryTreeNode[] => {
        const category = findCategoryById(categoryId);
        return category?.children || [];
    }, [findCategoryById]);

    // Get breadcrumb path from root to a category
    const getBreadcrumb = useCallback((categoryId: number): ICategoryTreeNode[] => {
        if (!tree) return [];
        
        const path: ICategoryTreeNode[] = [];
        
        const findPath = (nodes: ICategoryTreeNode[], targetId: number): boolean => {
            for (const node of nodes) {
                if (node.id === targetId) {
                    path.push(node);
                    return true;
                }
                if (node.children && node.children.length > 0) {
                    if (findPath(node.children, targetId)) {
                        path.unshift(node);
                        return true;
                    }
                }
            }
            return false;
        };
        
        findPath(tree, categoryId);
        return path;
    }, [tree]);

    // Check if a category is a leaf (no children)
    const isLeafCategory = useCallback((categoryId: number): boolean => {
        const category = findCategoryById(categoryId);
        return category ? category.children.length === 0 : true;
    }, [findCategoryById]);

    // Extract modelId from active car
    const getModelIdFromCar = useCallback((): string | null => {
        if (!currentActiveCar?.data) return null;
        
        // Check if it's ICarData (has modell_id) or IWheelData (has WHEELID)
        const carData = currentActiveCar.data as ICarData;
        if (carData.modell_id) {
            return carData.modell_id;
        }
        
        return null;
    }, [currentActiveCar]);

    // Load the category tree
    const loadTree = useCallback(async (modelId?: string | null) => {
        // Prevent duplicate requests for the same modelId
        if (loadingRef.current) {
            return;
        }

        // If we already have data for this modelId, skip
        if (lastModelIdRef.current === (modelId || null) && tree !== null) {
            return;
        }

        loadingRef.current = true;
        try {
            setLoading(true);
            setError(null);
            console.log('CategoryTreeContext - Loading category tree...', modelId ? `for modelId: ${modelId}` : '(all categories)');
            const data: ICategoryTreeResponse = await carApi.getCategoryTree(modelId || undefined);
            console.log('CategoryTreeContext - Tree loaded:', data.totalCategories, 'categories', modelId ? `for vehicle ${modelId}` : '(all)');
            setTree(data.categories);
            setTotalCategories(data.totalCategories);
            setRootCategories(data.rootCategories);
            setCurrentModelId(modelId || null);
            lastModelIdRef.current = modelId || null;
        } catch (err) {
            console.error('CategoryTreeContext - Error loading tree:', err);
            setError(err instanceof Error ? err.message : 'Failed to load category tree');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [tree]);

    // Force refresh the tree
    const refreshTree = useCallback(async () => {
        const modelId = getModelIdFromCar();
        lastModelIdRef.current = null; // Force refresh
        await loadTree(modelId);
    }, [loadTree, getModelIdFromCar]);

    // Load tree when active car changes
    useEffect(() => {
        const modelId = getModelIdFromCar();
        
        // Only reload if modelId changed
        if (modelId !== lastModelIdRef.current) {
            console.log('CategoryTreeContext - Active car changed, reloading tree for modelId:', modelId);
            loadTree(modelId);
        }
    }, [currentActiveCar, getModelIdFromCar, loadTree]);

    return (
        <CategoryTreeContext.Provider
            value={{
                tree,
                loading,
                error,
                totalCategories,
                rootCategories,
                currentModelId,
                findCategoryById,
                getChildren,
                getBreadcrumb,
                isLeafCategory,
                refreshTree,
            }}
        >
            {children}
        </CategoryTreeContext.Provider>
    );
}

export function useCategoryTree() {
    const context = useContext(CategoryTreeContext);
    if (!context) {
        throw new Error('useCategoryTree must be used within a CategoryTreeProvider');
    }
    return context;
}

// Optional hook that returns safe defaults if context is not available
export function useCategoryTreeSafe() {
    const context = useContext(CategoryTreeContext);
    if (!context) {
        return {
            tree: null,
            loading: false,
            error: null,
            totalCategories: 0,
            rootCategories: 0,
            currentModelId: null,
            findCategoryById: () => null,
            getChildren: () => [],
            getBreadcrumb: () => [],
            isLeafCategory: () => true,
            refreshTree: async () => {},
        };
    }
    return context;
}
