import { ICategoryTreeResponse } from '~/api/car.api';

export const HOMEPAGE_NAMESPACE = 'homepage';

export type HomepageStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface IHomepageState {
    brands: string[] | null;
    brandsFetchedAt: number | null;
    brandsStatus: HomepageStatus;
    brandsError: string | null;

    categoryTree: ICategoryTreeResponse | null;
    categoryTreeModelId: string | null;
    categoryTreeFetchedAt: number | null;
    categoryTreeStatus: HomepageStatus;
    categoryTreeError: string | null;
}

export const HOMEPAGE_TTL_MS = 10 * 60 * 1000; // 10 minutes
