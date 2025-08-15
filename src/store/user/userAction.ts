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
): UserThunkAction<Promise<void>> {
    return async (dispatch) => {
        try {
            // For registration, we only need to know if it was successful
            // The user will need to verify their email before signing in
            await customerApi.signUp(email, password, '', '');
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
        // In a real implementation, you would update the user's profile via GraphQL
        // For now, we'll just update the local state
        const currentUser = getState().user.current;
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone || currentUser.phone,
            };
            dispatch(userSetCurrent(updatedUser));
        }
    };
}
