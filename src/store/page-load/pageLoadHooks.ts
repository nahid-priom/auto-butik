// application
import { PAGE_LOAD_NAMESPACE } from '~/store/page-load/pageLoadTypes';
import { useAppSelector } from '~/store/hooks';
import { IRootState } from '~/store/root/rootTypes';

export function usePageLoad() {
    return useAppSelector((state: IRootState) => state[PAGE_LOAD_NAMESPACE]);
}
