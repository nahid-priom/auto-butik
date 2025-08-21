// application
import { IUser } from '~/interfaces/user';
import { USER_SET_CURRENT, UserSetCurrentAction, UserThunkAction } from '~/store/user/userActionTypes';
import customerApi from '~/api/graphql/account.api';

export function userSetCurrent(user: IUser | null): UserSetCurrentAction {
    return {
        type: USER_SET_CURRENT,
        payload: user,
    };
}

export function userSignIn(
    email: string,
    password: string,
): UserThunkAction<Promise<void>> {
    return async (dispatch) => {
        try {
            const user = await customerApi.signIn(email, password);
            dispatch(userSetCurrent(user));
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        }
    };
}

export function userSignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
): UserThunkAction<Promise<void>> {
    return async (dispatch) => {
        try {
            // Register the user
            await customerApi.signUp(email, password, firstName, lastName, phone);
            
            // Automatically sign in the user after successful registration
            const user = await customerApi.signIn(email, password);
            dispatch(userSetCurrent(user));
        } catch (error) {
            console.error('Sign up failed:', error);
            throw error;
        }
    };
}

export function userSignOut(): UserThunkAction<Promise<void>> {
    return async (dispatch) => {
        await customerApi.signOut();
        dispatch(userSetCurrent(null));
    };
}

export function userEditProfile(
    data: { firstName: string; lastName: string; email: string; phone?: string },
): UserThunkAction<Promise<void>> {
    return async (dispatch, getState) => {
        const updated = await customerApi.updateProfile(data);
        dispatch(userSetCurrent(updated));
    };
}
