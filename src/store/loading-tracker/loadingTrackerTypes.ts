export const LOADING_TRACKER_NAMESPACE = 'loadingTracker';

export interface ILoadingTrackerState {
    routePending: boolean;
    inflightCount: number;
}
