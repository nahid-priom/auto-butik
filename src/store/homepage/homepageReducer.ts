// application
import {
    HOMEPAGE_BRANDS_FAILED,
    HOMEPAGE_BRANDS_LOADING,
    HOMEPAGE_BRANDS_SET,
    HOMEPAGE_CATEGORY_TREE_FAILED,
    HOMEPAGE_CATEGORY_TREE_LOADING,
    HOMEPAGE_CATEGORY_TREE_SET,
    HomepageAction,
} from '~/store/homepage/homepageActionTypes';
import { IHomepageState } from '~/store/homepage/homepageTypes';

const initialState: IHomepageState = {
    brands: null,
    brandsFetchedAt: null,
    brandsStatus: 'idle',
    brandsError: null,

    categoryTree: null,
    categoryTreeModelId: null,
    categoryTreeFetchedAt: null,
    categoryTreeStatus: 'idle',
    categoryTreeError: null,
};

export default function homepageReducer(state: IHomepageState = initialState, action: HomepageAction): IHomepageState {
    switch (action.type) {
    case HOMEPAGE_BRANDS_LOADING:
        return { ...state, brandsStatus: 'loading', brandsError: null };
    case HOMEPAGE_BRANDS_SET:
        return {
            ...state,
            brands: action.payload.brands,
            brandsFetchedAt: action.payload.fetchedAt,
            brandsStatus: 'succeeded',
            brandsError: null,
        };
    case HOMEPAGE_BRANDS_FAILED:
        return {
            ...state,
            brandsStatus: 'failed',
            brandsError: action.payload,
        };
    case HOMEPAGE_CATEGORY_TREE_LOADING:
        return { ...state, categoryTreeStatus: 'loading', categoryTreeError: null };
    case HOMEPAGE_CATEGORY_TREE_SET:
        return {
            ...state,
            categoryTree: action.payload.data,
            categoryTreeModelId: action.payload.modelId,
            categoryTreeFetchedAt: action.payload.fetchedAt,
            categoryTreeStatus: 'succeeded',
            categoryTreeError: null,
        };
    case HOMEPAGE_CATEGORY_TREE_FAILED:
        return {
            ...state,
            categoryTreeStatus: 'failed',
            categoryTreeError: action.payload,
        };
    default:
        return state;
    }
}
