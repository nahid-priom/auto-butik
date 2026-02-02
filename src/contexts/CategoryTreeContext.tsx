import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react';
import { carApi, ICategoryTreeNode, ICategoryTreeResponse } from '~/api/car.api';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { ICarData } from '~/interfaces/car';
import { buildHeaderCategoryMenuFromTree } from '~/data/buildHeaderCategoryMenuFromApiTree';
import { IMainMenuLink } from '~/interfaces/main-menu-link';

const CATEGORY_TREE_CACHE_KEY = 'autobutik_category_tree';
const CATEGORY_TREE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function readCategoryTreeFromCache(): ICategoryTreeNode[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CATEGORY_TREE_CACHE_KEY);
        if (!raw) return null;
        const { categories, timestamp } = JSON.parse(raw) as { categories: ICategoryTreeNode[]; timestamp: number };
        if (!Array.isArray(categories) || categories.length === 0) return null;
        if (Date.now() - timestamp > CATEGORY_TREE_CACHE_TTL_MS) return null;
        return categories;
    } catch {
        return null;
    }
}

function writeCategoryTreeToCache(categories: ICategoryTreeNode[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(
            CATEGORY_TREE_CACHE_KEY,
            JSON.stringify({ categories, timestamp: Date.now() })
        );
    } catch {
        // ignore quota / private mode
    }
}

interface CategoryTreeContextValue {
    tree: ICategoryTreeNode[] | null;
    loading: boolean;
    error: string | null;
    totalCategories: number;
    rootCategories: number;
    currentModelId: string | null;
    /** Header mega menu derived from category tree (for MainMenu, BlockCategoryTabs, mobile menu) */
    headerMenu: IMainMenuLink[] | null;
    findCategoryById: (id: number) => ICategoryTreeNode | null;
    getChildren: (categoryId: number) => ICategoryTreeNode[];
    getBreadcrumb: (categoryId: number) => ICategoryTreeNode[];
    isLeafCategory: (categoryId: number) => boolean;
    refreshTree: () => Promise<void>;
}

const CategoryTreeContext = createContext<CategoryTreeContextValue | null>(null);

export function CategoryTreeProvider({ children }: { children: React.ReactNode }) {
    // Start with null so server and client first render match (avoids hydration error).
    // Cache is applied in useLayoutEffect (client-only) so menu appears before paint when possible.
    const [tree, setTree] = useState<ICategoryTreeNode[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCategories, setTotalCategories] = useState(0);
    const [rootCategories, setRootCategories] = useState(0);
    const [currentModelId, setCurrentModelId] = useState<string | null>(null);
    const loadingRef = useRef(false);
    const lastModelIdRef = useRef<string | null>(null);
    /** Tracks if we have completed a fetch for the current modelId (so we don't skip when tree was from cache) */
    const fetchedForModelIdRef = useRef<string | null>(null);

    // Restore from cache on client only (after hydration). useLayoutEffect runs before paint so menu appears quickly.
    useLayoutEffect(() => {
        const cached = readCategoryTreeFromCache();
        if (cached) {
            setTree(cached);
        }
    }, []);

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

    // Header mega menu derived from category tree (for MainMenu, BlockCategoryTabs, mobile menu)
    const headerMenu = useMemo<IMainMenuLink[] | null>(() => {
        if (!tree || tree.length === 0) return null;
        return buildHeaderCategoryMenuFromTree(tree);
    }, [tree]);

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

        const modelKey = modelId || null;
        // If we already fetched for this modelId, skip (avoid duplicate requests)
        if (fetchedForModelIdRef.current === modelKey) {
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
            fetchedForModelIdRef.current = modelKey;
            // Cache full tree so next visit shows mega menu immediately
            if (!modelId) {
                writeCategoryTreeToCache(data.categories);
            }
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
        lastModelIdRef.current = null;
        fetchedForModelIdRef.current = null; // Force refresh
        await loadTree(modelId);
    }, [loadTree, getModelIdFromCar]);

    // Load tree on mount and when active car changes (revalidate even when we have cache)
    useEffect(() => {
        const modelId = getModelIdFromCar();
        const modelKey = modelId || null;
        // Fetch if we haven't yet for this modelId (covers initial load and cache restore)
        if (fetchedForModelIdRef.current !== modelKey) {
            console.log('CategoryTreeContext - Loading tree for modelId:', modelId ?? '(all)');
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
                headerMenu,
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
            headerMenu: null,
            findCategoryById: () => null,
            getChildren: () => [],
            getBreadcrumb: () => [],
            isLeafCategory: () => true,
            refreshTree: async () => {},
        };
    }
    return context;
}
