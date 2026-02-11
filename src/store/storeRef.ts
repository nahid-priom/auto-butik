/**
 * Reference to the Redux store for use outside React (e.g. API layer).
 * Set once when the app mounts so fetchWithLoader can dispatch loadingTracker actions.
 */
import { Store } from 'redux';
import { IRootState } from '~/store/root/rootTypes';
import { AppDispatch } from '~/store/types';

let storeRef: Store<IRootState> | null = null;

export function setStoreRef(store: Store<IRootState> | null) {
    storeRef = store;
}

export function getStoreRef(): Store<IRootState> | null {
    return storeRef;
}

export function getDispatch(): AppDispatch | null {
    return storeRef ? (storeRef.dispatch as AppDispatch) : null;
}
