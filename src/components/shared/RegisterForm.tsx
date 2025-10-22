// react
import React, { useMemo } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext, FieldError } from 'react-hook-form';
// application
import { useDetachableForm } from '~/services/hooks';
import { validateEmail } from '~/services/validators';

export interface IRegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface Props {
    namespace?: string;
    disabled?: boolean;
    idPrefix?: string;
}

type RegisterFormErrors = Partial<Record<keyof IRegisterForm, FieldError>>;

export function getRegisterFormDefaultValue(initialData: IRegisterForm | null = null): IRegisterForm {
    return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        ...initialData,
    };
}

function RegisterForm(props: Props) {
    const { namespace, disabled, idPrefix } = props;
    const formMethods = useFormContext();
    const { errors: errorsProps } = formMethods.formState;
    const { getValues } = formMethods;
    const errors: RegisterFormErrors = namespace
        ? ((errorsProps as Record<string, RegisterFormErrors | undefined>)[namespace] || {})
        : (errorsProps as RegisterFormErrors);
    const intl = useIntl();
    const fieldId = idPrefix ? `${idPrefix}-` : '';
    const ns = useMemo(() => (namespace ? `${namespace}.` : ''), [namespace]);
    const register = useDetachableForm(formMethods, disabled || false);

    return (
        <React.Fragment>
            <div className="form-group">
                <label htmlFor={`${fieldId}first-name`}>
                    <FormattedMessage id="INPUT_FIRST_NAME_LABEL" />
                </label>
                <input
                    type="text"
                    id={`${fieldId}first-name`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.firstName,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_FIRST_NAME_PLACEHOLDER' })}
                    {...register(`${ns}firstName`, { required: true })}
                />
                <div className="invalid-feedback">
                    {errors?.firstName?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`${fieldId}last-name`}>
                    <FormattedMessage id="INPUT_LAST_NAME_LABEL" />
                </label>
                <input
                    type="text"
                    id={`${fieldId}last-name`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.lastName,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_LAST_NAME_PLACEHOLDER' })}
                    {...register(`${ns}lastName`, { required: true })}
                />
                <div className="invalid-feedback">
                    {errors?.lastName?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`${fieldId}email`}>
                    <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
                </label>
                <input
                    type="text"
                    id={`${fieldId}email`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.email,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_ADDRESS_PLACEHOLDER' })}
                    {...register(`${ns}email`, { required: true, validate: { email: validateEmail } })}
                />
                <div className="invalid-feedback">
                    {errors?.email?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                    {errors?.email?.type === 'email' && (
                        <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`${fieldId}phone`}>
                    <FormattedMessage id="INPUT_PHONE_LABEL" />
                </label>
                <input
                    type="tel"
                    id={`${fieldId}phone`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.phone,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_PHONE_PLACEHOLDER' })}
                    {...register(`${ns}phone`, { required: true })}
                />
                <div className="invalid-feedback">
                    {errors?.phone?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`${fieldId}password`}>
                    <FormattedMessage id="INPUT_PASSWORD_LABEL" />
                </label>
                <input
                    type="password"
                    id={`${fieldId}password`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.password,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_PLACEHOLDER' })}
                    {...register(`${ns}password`, { required: true })}
                />
                <div className="invalid-feedback">
                    {errors?.password?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                </div>
            </div>

            <div className="form-group mb-0">
                <label htmlFor={`${fieldId}confirm-password`}>
                    <FormattedMessage id="INPUT_PASSWORD_REPEAT_LABEL" />
                </label>
                <input
                    type="password"
                    id={`${fieldId}confirm-password`}
                    className={classNames('form-control', {
                        'is-invalid': errors?.confirmPassword,
                    })}
                    disabled={disabled}
                    placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_REPEAT_PLACEHOLDER' })}
                    {...register(`${ns}confirmPassword`, {
                        required: true,
                        validate: {
                            match: (value) => value === getValues(`${ns}password`),
                        },
                    })}
                />
                <div className="invalid-feedback">
                    {errors?.confirmPassword?.type === 'required' && (
                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                    )}
                    {errors?.confirmPassword?.type === 'match' && (
                        <FormattedMessage id="ERROR_FORM_PASSWORD_DOES_NOT_MATCH" />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

export default RegisterForm;
