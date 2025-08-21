// react
import { useMemo, useState, useCallback } from 'react';
// third-party
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
// application
import { useAsyncAction } from '~/store/hooks';
import { useUserSignIn } from '~/store/user/userHooks';

interface ISignInFormOptions {
    onSuccess?: () => void;
}

export interface ISignInForm {
    email: string;
    password: string;
    remember: boolean;
}

export function useSignInForm(options: ISignInFormOptions = {}) {
    const signIn = useUserSignIn();
    const intl = useIntl();
    const { onSuccess } = options;
    const [serverError, setServerError] = useState<string | null>(null);
    const methods = useForm<ISignInForm>({
        defaultValues: {
            email: 'red-parts@example.com',
            password: '123456',
            remember: false,
        },
    });
    const { handleSubmit } = methods;
    const [submit, submitInProgress] = useAsyncAction(async (data: ISignInForm) => {
        setServerError(null);

        try {
            await signIn(data.email, data.password);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            // Handle specific error messages from the API
            let errorMessage = 'ERROR_API_UNKNOWN';
            
            if (error instanceof Error) {
                // Clean up the error message and convert to lowercase with underscores
                const normalizedError = error.message.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                
                // Map common error messages to user-friendly ones
                const errorMap: Record<string, string> = {
                    'invalid_credentials': 'ERROR_INVALID_CREDENTIALS',
                    'invalidcredentials': 'ERROR_INVALID_CREDENTIALS',
                    'email_not_verified': 'EMAIL_VERIFICATION_REQUIRED',
                    'email_notverified': 'EMAIL_VERIFICATION_REQUIRED',
                    'not_verified_error': 'EMAIL_VERIFICATION_REQUIRED',
                    'account_locked': 'ERROR_ACCOUNT_LOCKED',
                    'too_many_attempts': 'ERROR_TOO_MANY_ATTEMPTS',
                    'email_verification_required': 'EMAIL_VERIFICATION_REQUIRED',
                    // Add any other error mappings here
                };
                
                // Check if the normalized error matches any in our map
                errorMessage = errorMap[normalizedError] || `ERROR_API_${error.message}`;
            }
            
            setServerError(errorMessage);
            // Show error toast instead of throwing error to prevent runtime error display
            toast.error(intl.formatMessage({ id: errorMessage }), { theme: 'colored' });
            // Don't re-throw the error to prevent the runtime error interface
        }
    }, [signIn, onSuccess]);

    return {
        submit: useMemo(() => handleSubmit(submit), [handleSubmit, submit]),
        submitInProgress: submitInProgress || methods.formState.isSubmitting,
        serverError,
        errors: methods.formState.errors,
        register: methods.register,
        watch: methods.watch,
    };
}
