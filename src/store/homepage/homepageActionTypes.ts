/* eslint-disable import/prefer-default-export */

import { ICategoryTreeResponse } from '~/api/car.api';
import { AppAction } from '~/store/types';

export const HOMEPAGE_BRANDS_SET = 'homepage/brandsSet';
export const HOMEPAGE_BRANDS_LOADING = 'homepage/brandsLoading';
export const HOMEPAGE_BRANDS_FAILED = 'homepage/brandsFailed';
export const HOMEPAGE_CATEGORY_TREE_SET = 'homepage/categoryTreeSet';
export const HOMEPAGE_CATEGORY_TREE_LOADING = 'homepage/categoryTreeLoading';
export const HOMEPAGE_CATEGORY_TREE_FAILED = 'homepage/categoryTreeFailed';

export type HomepageBrandsSet = {
    type: typeof HOMEPAGE_BRANDS_SET;
    payload: { brands: string[]; fetchedAt: number };
};
export type HomepageBrandsLoading = { type: typeof HOMEPAGE_BRANDS_LOADING };
export type HomepageBrandsFailed = { type: typeof HOMEPAGE_BRANDS_FAILED; payload: string };
export type HomepageCategoryTreeSet = {
    type: typeof HOMEPAGE_CATEGORY_TREE_SET;
    payload: { data: ICategoryTreeResponse; modelId: string | null; fetchedAt: number };
};
export type HomepageCategoryTreeLoading = { type: typeof HOMEPAGE_CATEGORY_TREE_LOADING };
export type HomepageCategoryTreeFailed = { type: typeof HOMEPAGE_CATEGORY_TREE_FAILED; payload: string };

export type HomepageAction =
    | HomepageBrandsSet
    | HomepageBrandsLoading
    | HomepageBrandsFailed
    | HomepageCategoryTreeSet
    | HomepageCategoryTreeLoading
    | HomepageCategoryTreeFailed;

export type HomepageThunkAction<T = void> = AppAction<HomepageAction, T>;
