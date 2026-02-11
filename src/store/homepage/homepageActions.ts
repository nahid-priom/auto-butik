// application
import { carApi, ICategoryTreeResponse } from '~/api/car.api';
import {
    HOMEPAGE_BRANDS_FAILED,
    HOMEPAGE_BRANDS_LOADING,
    HOMEPAGE_BRANDS_SET,
    HOMEPAGE_CATEGORY_TREE_FAILED,
    HOMEPAGE_CATEGORY_TREE_LOADING,
    HOMEPAGE_CATEGORY_TREE_SET,
    HomepageThunkAction,
} from '~/store/homepage/homepageActionTypes';
import { IHomepageState } from '~/store/homepage/homepageTypes';
import { HOMEPAGE_TTL_MS } from '~/store/homepage/homepageTypes';
import { pageLoadCriticalDecrement, pageLoadCriticalIncrement, pageLoadProgress } from '~/store/page-load/pageLoadActions';
import { IRootState } from '~/store/root/rootTypes';
import { AppDispatch } from '~/store/types';

function isBrandsFresh(fetchedAt: number | null): boolean {
    return fetchedAt != null && Date.now() - fetchedAt < HOMEPAGE_TTL_MS;
}

function isCategoryTreeFresh(fetchedAt: number | null, modelId: string | null, requestedModelId: string | null): boolean {
    return (
        fetchedAt != null
        && Date.now() - fetchedAt < HOMEPAGE_TTL_MS
        && (requestedModelId ?? null) === (modelId ?? null)
    );
}

/** Fetch brands for hero dropdown; uses cache with TTL; dedupes; drives critical loading count. */
export function fetchBrandsIfNeeded(isCritical: boolean = true): HomepageThunkAction<Promise<void>> {
    return async (dispatch: AppDispatch, getState: () => IRootState) => {
        const state = getState();
        const homepage = state.homepage as IHomepageState;
        if (homepage.brands != null && isBrandsFresh(homepage.brandsFetchedAt)) {
            if (isCritical) dispatch(pageLoadCriticalDecrement());
            return;
        }
        if (homepage.brandsStatus === 'loading') return;

        if (isCritical) dispatch(pageLoadCriticalIncrement());
        dispatch({ type: HOMEPAGE_BRANDS_LOADING });
        try {
            const brands = await carApi.getBrands();
            const fetchedAt = Date.now();
            dispatch({ type: HOMEPAGE_BRANDS_SET, payload: { brands, fetchedAt } });
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                performance.mark('hero-brands-ready');
            }
            if (isCritical) {
                dispatch(pageLoadProgress(80));
            }
        } catch (err) {
            dispatch({
                type: HOMEPAGE_BRANDS_FAILED,
                payload: err instanceof Error ? err.message : 'Failed to load brands',
            });
        } finally {
            if (isCritical) dispatch(pageLoadCriticalDecrement());
        }
    };
}

/** Fetch category tree; uses cache with TTL and modelId; dedupes. Does not drive critical count. */
export function fetchCategoryTreeIfNeeded(modelId?: string | null, force?: boolean): HomepageThunkAction<Promise<void>> {
    return async (dispatch: AppDispatch, getState: () => IRootState) => {
        const state = getState();
        const homepage = state.homepage as IHomepageState;
        const requested = modelId ?? null;
        if (
            !force
            && homepage.categoryTree != null
            && isCategoryTreeFresh(homepage.categoryTreeFetchedAt, homepage.categoryTreeModelId, requested)
        ) {
            return;
        }
        if (homepage.categoryTreeStatus === 'loading') return;

        dispatch({ type: HOMEPAGE_CATEGORY_TREE_LOADING });
        try {
            const data: ICategoryTreeResponse = await carApi.getCategoryTree(modelId || undefined);
            const fetchedAt = Date.now();
            dispatch({
                type: HOMEPAGE_CATEGORY_TREE_SET,
                payload: { data, modelId: requested, fetchedAt },
            });
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                performance.mark('category-tree-ready');
            }
        } catch (err) {
            dispatch({
                type: HOMEPAGE_CATEGORY_TREE_FAILED,
                payload: err instanceof Error ? err.message : 'Failed to load category tree',
            });
        }
    };
}
