// react
import { useMemo, useState, useCallback } from 'react';
// third-party
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
// application
import { useAsyncAction } from '~/store/hooks';
import { useUserSignUp } from '~/store/user/userHooks';

interface ISignUpFormOptions {
    onSuccess?: () => void;
}

export interface ISignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export function useSignUpForm(options: ISignUpFormOptions = {}) {
    const signUp = useUserSignUp();
    const intl = useIntl();
    const { onSuccess } = options;
    const [serverError, setServerError] = useState<string | null>(null);
    const methods = useForm<ISignUpForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });
    const { handleSubmit } = methods;
    const [submit, submitInProgress] = useAsyncAction(async (data: ISignUpForm) => {
        setServerError(null);

        // Client-side validation for password match
        if (data.password !== data.confirmPassword) {
            setServerError('ERROR_PASSWORDS_DO_NOT_MATCH');
            return;
        }

        try {
            await signUp(data.email, data.password, data.firstName, data.lastName, data.phone);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            // Handle specific error messages from the API
            let errorMessage = 'ERROR_API_UNKNOWN';
            
            if (error instanceof Error) {
                // Map common error messages to user-friendly ones
                const errorMap: Record<string, string> = {
                    'email_already_exists': 'ERROR_EMAIL_ALREADY_EXISTS',
                    'invalid_email': 'ERROR_INVALID_EMAIL',
                    'password_too_short': 'ERROR_PASSWORD_TOO_SHORT',
                    'password_too_weak': 'ERROR_PASSWORD_TOO_WEAK',
                    'invalid_input': 'ERROR_INVALID_INPUT'
                };

                // Check if the error message matches any in our map
                const errorCode = error.message.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                errorMessage = errorMap[errorCode] || `ERROR_API_${error.message}`;
            }
            
            setServerError(errorMessage);
            // Show error toast
            toast.error(intl.formatMessage({ id: errorMessage }), { theme: 'colored' });
            throw error; // Re-throw to let the form handle it
        }
    }, [signUp, onSuccess]);

    return {
        submit: useMemo(() => handleSubmit(submit), [handleSubmit, submit]),
        submitInProgress: submitInProgress || methods.formState.isSubmitting,
        serverError,
        errors: methods.formState.errors,
        register: methods.register,
        watch: methods.watch,
    };
}
