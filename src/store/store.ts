// third-party
import thunk from 'redux-thunk';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import {
    applyMiddleware,
    createStore,
    Middleware,
    Store,
} from 'redux';
// application
import rootReducer from '~/store/root/rootReducer';
import version from '~/store/version';
import { IRootState } from '~/store/root/rootTypes';
import { logger } from '~/utils/logger';

const STORAGE_KEY = 'autobutik';

export const save = (state: any) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        logger.error('Failed to save Redux state to localStorage', error);
    }
};

export const load = () => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    let state;

    try {
        state = localStorage.getItem(STORAGE_KEY);

        if (typeof state === 'string') {
            state = JSON.parse(state);
        }

        if (state && state.version !== version) {
            state = undefined;
        }

        // Also check for user authentication token and restore user state
        if (state && !state.user?.current) {
            const token = localStorage.getItem('customerToken');
            if (token) {
                // Initialize user state as loading to prevent redirect to login
                state.user = {
                    current: { id: 'loading', email: '', firstName: '', lastName: '' },
                };
            }
        }
    } catch (error) {
        logger.error('Failed to load Redux state from localStorage', error);
    }

    return state || undefined;
};

const bindMiddleware = (...middleware: Middleware[]) => {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line global-require
        const { composeWithDevTools } = require('redux-devtools-extension');

        return composeWithDevTools(applyMiddleware(...middleware));
    }

    return applyMiddleware(...middleware);
};

const makeStore: MakeStore<Store<IRootState>> = () => (
    createStore(rootReducer, bindMiddleware(thunk))
);

export const wrapper = createWrapper<Store<IRootState>>(makeStore);
