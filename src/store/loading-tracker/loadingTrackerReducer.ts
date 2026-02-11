import {
    LOADING_TRACKER_END_REQUEST,
    LOADING_TRACKER_END_ROUTE,
    LOADING_TRACKER_START_REQUEST,
    LOADING_TRACKER_START_ROUTE,
    LoadingTrackerAction,
} from '~/store/loading-tracker/loadingTrackerActionTypes';
import { ILoadingTrackerState } from '~/store/loading-tracker/loadingTrackerTypes';

const initialState: ILoadingTrackerState = {
    routePending: false,
    inflightCount: 0,
};

export default function loadingTrackerReducer(
    state: ILoadingTrackerState = initialState,
    action: LoadingTrackerAction
): ILoadingTrackerState {
    switch (action.type) {
    case LOADING_TRACKER_START_ROUTE:
        return { ...state, routePending: true };
    case LOADING_TRACKER_END_ROUTE:
        return { ...state, routePending: false };
    case LOADING_TRACKER_START_REQUEST:
        return { ...state, inflightCount: state.inflightCount + 1 };
    case LOADING_TRACKER_END_REQUEST: {
        const next = Math.max(0, state.inflightCount - 1);
        return { ...state, inflightCount: next };
    }
    default:
        return state;
    }
}
