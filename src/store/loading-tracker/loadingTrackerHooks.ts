import { useAppSelector } from '~/store/hooks';
import { IRootState } from '~/store/root/rootTypes';
import { LOADING_TRACKER_NAMESPACE } from '~/store/loading-tracker/loadingTrackerTypes';
import { ILoadingTrackerState } from '~/store/loading-tracker/loadingTrackerTypes';

export function useLoadingTracker(): ILoadingTrackerState & { isLoading: boolean } {
    const state = useAppSelector((s: IRootState) => s[LOADING_TRACKER_NAMESPACE]) as ILoadingTrackerState;
    const isLoading = state.routePending || state.inflightCount > 0;
    return { ...state, isLoading };
}
