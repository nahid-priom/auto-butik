export const LOADING_TRACKER_START_ROUTE = 'loadingTracker/startRoute';
export const LOADING_TRACKER_END_ROUTE = 'loadingTracker/endRoute';
export const LOADING_TRACKER_START_REQUEST = 'loadingTracker/startRequest';
export const LOADING_TRACKER_END_REQUEST = 'loadingTracker/endRequest';

export type LoadingTrackerStartRoute = { type: typeof LOADING_TRACKER_START_ROUTE };
export type LoadingTrackerEndRoute = { type: typeof LOADING_TRACKER_END_ROUTE };
export type LoadingTrackerStartRequest = { type: typeof LOADING_TRACKER_START_REQUEST; payload: string };
export type LoadingTrackerEndRequest = { type: typeof LOADING_TRACKER_END_REQUEST; payload: { key: string; ok: boolean } };

export type LoadingTrackerAction =
    | LoadingTrackerStartRoute
    | LoadingTrackerEndRoute
    | LoadingTrackerStartRequest
    | LoadingTrackerEndRequest;
