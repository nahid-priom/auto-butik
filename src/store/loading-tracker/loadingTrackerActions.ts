import {
    LOADING_TRACKER_END_REQUEST,
    LOADING_TRACKER_END_ROUTE,
    LOADING_TRACKER_START_REQUEST,
    LOADING_TRACKER_START_ROUTE,
} from '~/store/loading-tracker/loadingTrackerActionTypes';

export function loadingTrackerStartRoute() {
    return { type: LOADING_TRACKER_START_ROUTE };
}

export function loadingTrackerEndRoute() {
    return { type: LOADING_TRACKER_END_ROUTE };
}

export function loadingTrackerStartRequest(key: string) {
    return { type: LOADING_TRACKER_START_REQUEST, payload: key };
}

export function loadingTrackerEndRequest(key: string, ok: boolean) {
    return { type: LOADING_TRACKER_END_REQUEST, payload: { key, ok } };
}
