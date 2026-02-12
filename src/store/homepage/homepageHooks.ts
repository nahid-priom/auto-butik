// application
import { useAppSelector } from '~/store/hooks';
import { IRootState } from '~/store/root/rootTypes';
import { HOMEPAGE_NAMESPACE } from '~/store/homepage/homepageTypes';
import { IHomepageState } from '~/store/homepage/homepageTypes';

export function useHomepage() {
    return useAppSelector((state: IRootState) => state[HOMEPAGE_NAMESPACE]) as IHomepageState;
}

export function useHeroBrands(): {
    brands: string[];
    loading: boolean;
    error: string | null;
} {
    const { brands, brandsStatus, brandsError } = useHomepage();
    return {
        brands: brands ?? [],
        loading: brandsStatus === 'loading',
        error: brandsError,
    };
}
