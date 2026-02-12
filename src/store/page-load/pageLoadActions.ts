/* eslint-disable import/prefer-default-export */

// application
import {
    PAGE_LOAD_COMPLETE,
    PAGE_LOAD_CRITICAL_DECREMENT,
    PAGE_LOAD_CRITICAL_INCREMENT,
    PAGE_LOAD_PROGRESS,
    PAGE_LOAD_START,
    PageLoadThunkAction,
} from '~/store/page-load/pageLoadActionTypes';
import { IPageLoadState } from '~/store/page-load/pageLoadTypes';
import { IRootState } from '~/store/root/rootTypes';
import { AppDispatch } from '~/store/types';

export function pageLoadStart(): { type: typeof PAGE_LOAD_START } {
    return { type: PAGE_LOAD_START };
}

export function pageLoadCriticalIncrement(): { type: typeof PAGE_LOAD_CRITICAL_INCREMENT } {
    return { type: PAGE_LOAD_CRITICAL_INCREMENT };
}

export function pageLoadCriticalDecrement(): { type: typeof PAGE_LOAD_CRITICAL_DECREMENT } {
    return { type: PAGE_LOAD_CRITICAL_DECREMENT };
}

export function pageLoadProgress(percent: number): { type: typeof PAGE_LOAD_PROGRESS; payload: number } {
    return { type: PAGE_LOAD_PROGRESS, payload: percent };
}

export function pageLoadComplete(): { type: typeof PAGE_LOAD_COMPLETE } {
    return { type: PAGE_LOAD_COMPLETE };
}

/** Finish bar (100%) and hide. Used when route + API loading is done (TopLoader drives from loadingTracker). */
export function pageLoadFinishWhenCriticalReady(): PageLoadThunkAction<void> {
    return (dispatch: AppDispatch) => {
        dispatch(pageLoadProgress(100));
        setTimeout(() => {
            dispatch(pageLoadComplete());
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                performance.mark('page-load-ready');
            }
        }, 120);
    };
}
