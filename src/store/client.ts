// third-party
import { Action } from 'redux';
// application
import { AppReducer } from '~/store/types';
import { useAppAction } from '~/store/hooks';

const APPLY_CLIENT_STATE = 'APPLY_CLIENT_STATE';

type ApplyClientStateAction<T> = {
    type: typeof APPLY_CLIENT_STATE;
    state: T;
};

function isApplyClientStateAction<T extends object>(
    action: Action,
): action is ApplyClientStateAction<T> {
    return action.type === APPLY_CLIENT_STATE;
}

export function applyClientState<T extends object>(state: T): ApplyClientStateAction<T> {
    return {
        type: APPLY_CLIENT_STATE,
        state,
    };
}

export const useApplyClientState = () => useAppAction(applyClientState);

export type IStateFromServer = 'server';
export type IStateFromClient = 'client';
export type IStateFrom = IStateFromServer | IStateFromClient;

export function withClientState<
    TState extends object,
    TAction extends Action = Action
>(
    reducer: AppReducer<TState, TAction>,
    namespace: string,
): AppReducer<TState & { stateFrom: IStateFrom }, TAction | ApplyClientStateAction<Record<string, TState>>> {
    return (state: TState | undefined, action: TAction | ApplyClientStateAction<Record<string, TState>>) => {
        const childState = reducer(state as TState, action as TAction);

        if (isApplyClientStateAction<Record<string, TState>>(action)) {
            return {
                ...(action.state[namespace] || childState),
                stateFrom: 'client' as const,
            };
        }

        if ('stateFrom' in childState) {
            return childState as TState & { stateFrom: IStateFrom };
        }

        return {
            ...childState,
            stateFrom: 'server' as const,
        };
    };
}
