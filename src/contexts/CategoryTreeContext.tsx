import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ICategoryTreeNode } from '~/api/car.api';
import { logger } from '~/utils/logger';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { ICarData } from '~/interfaces/car';
import { buildHeaderCategoryMenuFromTree } from '~/data/buildHeaderCategoryMenuFromApiTree';
import { IMainMenuLink } from '~/interfaces/main-menu-link';
import { useHomepage } from '~/store/homepage/homepageHooks';
import { fetchCategoryTreeIfNeeded } from '~/store/homepage/homepageActions';
import { useAppAction } from '~/store/hooks';

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

const HOMEPAGE_DEFER_MS = 400;

export function CategoryTreeProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { currentActiveCar } = useCurrentActiveCar();
    const {
        categoryTree,
        categoryTreeModelId,
        categoryTreeStatus,
        categoryTreeError,
    } = useHomepage();
    const fetchTree = useAppAction(fetchCategoryTreeIfNeeded);

    const tree = categoryTree?.categories ?? null;
    const loading = categoryTreeStatus === 'loading';
    const error = categoryTreeError;
    const totalCategories = categoryTree?.totalCategories ?? 0;
    const rootCategories = categoryTree?.rootCategories ?? 0;
    const currentModelId = categoryTreeModelId;

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
        const carData = currentActiveCar.data as ICarData;
        if (carData.modell_id) return carData.modell_id;
        return null;
    }, [currentActiveCar]);

    const refreshTree = useCallback(async () => {
        const modelId = getModelIdFromCar();
        logger.debug('CategoryTreeContext - Refresh tree for modelId:', modelId);
        fetchTree(modelId, true);
    }, [getModelIdFromCar, fetchTree]);

    // Load tree on mount and when active car changes. On homepage defer so header+hero paint first.
    useEffect(() => {
        const modelId = getModelIdFromCar();
        logger.debug('CategoryTreeContext - Load tree for modelId:', modelId);
        const isHomepage = router.pathname === '/';
        if (isHomepage && typeof requestIdleCallback !== 'undefined') {
            const id = requestIdleCallback(() => fetchTree(modelId), { timeout: HOMEPAGE_DEFER_MS });
            return () => cancelIdleCallback(id);
        }
        if (isHomepage) {
            const t = setTimeout(() => fetchTree(modelId), HOMEPAGE_DEFER_MS);
            return () => clearTimeout(t);
        }
        fetchTree(modelId);
    }, [currentActiveCar, getModelIdFromCar, fetchTree, router.pathname]);

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
