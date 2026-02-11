/* eslint-disable import/prefer-default-export */

import { AppAction } from '~/store/types';

export const PAGE_LOAD_CRITICAL_INCREMENT = 'pageLoad/criticalIncrement';
export const PAGE_LOAD_CRITICAL_DECREMENT = 'pageLoad/criticalDecrement';
export const PAGE_LOAD_PROGRESS = 'pageLoad/progress';
export const PAGE_LOAD_COMPLETE = 'pageLoad/complete';
export const PAGE_LOAD_START = 'pageLoad/start';

export type PageLoadCriticalIncrement = { type: typeof PAGE_LOAD_CRITICAL_INCREMENT };
export type PageLoadCriticalDecrement = { type: typeof PAGE_LOAD_CRITICAL_DECREMENT };
export type PageLoadProgress = { type: typeof PAGE_LOAD_PROGRESS; payload: number };
export type PageLoadComplete = { type: typeof PAGE_LOAD_COMPLETE };
export type PageLoadStart = { type: typeof PAGE_LOAD_START };

export type PageLoadAction =
    | PageLoadCriticalIncrement
    | PageLoadCriticalDecrement
    | PageLoadProgress
    | PageLoadComplete
    | PageLoadStart;

export type PageLoadThunkAction<T = void> = AppAction<PageLoadAction, T>;
