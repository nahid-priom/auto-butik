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

const STORAGE_KEY = 'red-parts/react';

export const save = (state: any) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

export const load = () => {
    if (!process.browser) {
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
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
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
