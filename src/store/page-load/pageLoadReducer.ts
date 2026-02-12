// application
import {
    PAGE_LOAD_COMPLETE,
    PAGE_LOAD_CRITICAL_DECREMENT,
    PAGE_LOAD_CRITICAL_INCREMENT,
    PAGE_LOAD_PROGRESS,
    PAGE_LOAD_START,
    PageLoadAction,
} from '~/store/page-load/pageLoadActionTypes';
import { IPageLoadState } from '~/store/page-load/pageLoadTypes';

const initialState: IPageLoadState = {
    criticalLoadingCount: 0,
    progressPercent: 0,
    visible: false,
};

export default function pageLoadReducer(state: IPageLoadState = initialState, action: PageLoadAction): IPageLoadState {
    switch (action.type) {
    case PAGE_LOAD_START:
        return {
            ...state,
            progressPercent: 10,
            visible: true,
        };
    case PAGE_LOAD_CRITICAL_INCREMENT:
        return {
            ...state,
            criticalLoadingCount: state.criticalLoadingCount + 1,
        };
    case PAGE_LOAD_CRITICAL_DECREMENT: {
        const count = Math.max(0, state.criticalLoadingCount - 1);
        return {
            ...state,
            criticalLoadingCount: count,
        };
    }
    case PAGE_LOAD_PROGRESS:
        return {
            ...state,
            progressPercent: Math.min(100, Math.max(0, action.payload)),
        };
    case PAGE_LOAD_COMPLETE:
        return {
            ...state,
            progressPercent: 100,
            criticalLoadingCount: 0,
            visible: false,
        };
    default:
        return state;
    }
}
