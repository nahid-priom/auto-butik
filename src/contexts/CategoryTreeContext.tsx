import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { carApi, ICategoryTreeNode, ICategoryTreeResponse } from '~/api/car.api';

interface CategoryTreeContextValue {
    tree: ICategoryTreeNode[] | null;
    loading: boolean;
    error: string | null;
    totalCategories: number;
    rootCategories: number;
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
    const loadingRef = useRef(false);
    const loadedRef = useRef(false);

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

    // Load the category tree
    const loadTree = useCallback(async () => {
        if (loadingRef.current || loadedRef.current) {
            return;
        }

        loadingRef.current = true;
        try {
            setLoading(true);
            setError(null);
            console.log('CategoryTreeContext - Loading category tree...');
            const data: ICategoryTreeResponse = await carApi.getCategoryTree();
            console.log('CategoryTreeContext - Tree loaded:', data.totalCategories, 'categories');
            setTree(data.categories);
            setTotalCategories(data.totalCategories);
            setRootCategories(data.rootCategories);
            loadedRef.current = true;
        } catch (err) {
            console.error('CategoryTreeContext - Error loading tree:', err);
            setError(err instanceof Error ? err.message : 'Failed to load category tree');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, []);

    // Force refresh the tree
    const refreshTree = useCallback(async () => {
        loadedRef.current = false;
        await loadTree();
    }, [loadTree]);

    // Load tree on mount
    useEffect(() => {
        loadTree();
    }, [loadTree]);

    return (
        <CategoryTreeContext.Provider
            value={{
                tree,
                loading,
                error,
                totalCategories,
                rootCategories,
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
            findCategoryById: () => null,
            getChildren: () => [],
            getBreadcrumb: () => [],
            isLeafCategory: () => true,
            refreshTree: async () => {},
        };
    }
    return context;
}
