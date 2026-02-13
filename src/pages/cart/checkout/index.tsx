/* eslint-disable no-alert */

// react
import React, { useEffect, useRef, useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
// application
import AppLink from '~/components/shared/AppLink';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import Checkbox from '~/components/shared/Checkbox';
import CheckoutCart from '~/components/shop/CheckoutCart';
import CheckoutForm from '~/components/shop/CheckoutForm';
import PageTitle from '~/components/shared/PageTitle';
import url from '~/services/url';
import { getAddressFormDefaultValue, IAddressForm } from '~/components/shared/AddressForm';
import { getRegisterFormDefaultValue, IRegisterForm } from '~/components/shared/RegisterForm';
import { useAsyncAction } from '~/store/hooks';
import { useCart } from '~/store/cart/cartHooks';
import { useUser, useUserSignUp } from '~/store/user/userHooks';
import { renderKcoSnippet } from '~/utils/renderKcoSnippet';
import { isVercelDomain } from '~/lib/kustom/domain';

interface IForm {
    billingAddress: IAddressForm;
    createAccount: boolean;
    account: IRegisterForm;
    shipToDifferentAddress: boolean;
    shippingAddress: IAddressForm;
    comment: string;
    agree: boolean;
}

type CheckoutPhase = 'form' | 'payment';

function Page() {
    const router = useRouter();
    const intl = useIntl();
    const user = useUser();
    const userSignUp = useUserSignUp();
    const cart = useCart();
    const [phase, setPhase] = useState<CheckoutPhase>('form');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [htmlSnippet, setHtmlSnippet] = useState<string | null>(null);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const kcoContainerRef = useRef<HTMLDivElement>(null);
    const domainToastShownRef = useRef(false);

    const formMethods = useForm<IForm>({
        defaultValues: {
            billingAddress: getAddressFormDefaultValue(),
            createAccount: false,
            account: getRegisterFormDefaultValue(),
            shipToDifferentAddress: false,
            shippingAddress: getAddressFormDefaultValue(),
            comment: '',
        },
    });
    const { handleSubmit, register, formState: { errors } } = formMethods;

    const [submitCheckout, checkoutInProgress] = useAsyncAction(async (data: IForm) => {
        setCheckoutError(null);
        const billingAddress = data.billingAddress;
        const shippingAddress = data.shipToDifferentAddress ? data.shippingAddress : data.billingAddress;

        if (data.createAccount) {
            try {
                await userSignUp(
                    data.account.email,
                    data.account.password,
                    data.account.firstName,
                    data.account.lastName,
                    data.account.phone,
                );
            } catch (error) {
                if (error instanceof Error) {
                    alert(intl.formatMessage({ id: `ERROR_API_${error.message}` }));
                }
                return;
            }
        }

        const body = {
            items: cart.items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                unit_price: item.price,
                options: item.options.map((o) => ({ name: o.name, value: o.value })),
            })),
            billingAddress,
            shippingAddress,
            comment: data.comment || undefined,
        };

        const res = await fetch('/api/kustom/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            setCheckoutError(json.error || res.statusText || 'Checkout failed');
            return;
        }

        if (json.order_id && json.html_snippet) {
            setOrderId(json.order_id);
            setHtmlSnippet(json.html_snippet);
            setPhase('payment');
        } else {
            setCheckoutError('Invalid response from checkout');
        }
    }, [intl, cart, userSignUp]);

    useEffect(() => {
        if (cart.stateFrom === 'client' && cart.items.length < 1) {
            router.replace(url.cart()).then();
        }
    }, [cart.stateFrom, cart.items.length, router]);

    useEffect(() => {
        if (typeof window === 'undefined' || domainToastShownRef.current) return;
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
        if (!appUrl) return;
        domainToastShownRef.current = true;
        if (isVercelDomain(appUrl)) {
            toast.warning(
                <>
                    <strong>Checkout domain configuration</strong>
                    <br />
                    This environment uses a Vercel URL. Before going live, update NEXT_PUBLIC_APP_URL to your real domain so Kustom merchant URLs (terms/checkout/confirmation/push) match the production domain.
                </>,
                { theme: 'colored', autoClose: 10000 },
            );
        }
        const origin = window.location.origin.replace(/\/$/, '');
        if (origin !== appUrl) {
            toast.warning(
                <>
                    <strong>Domain mismatch</strong>
                    <br />
                    Merchant URLs base differs from current site origin. Update NEXT_PUBLIC_APP_URL.
                </>,
                { theme: 'colored', autoClose: 10000 },
            );
        }
    }, []);

    useEffect(() => {
        if (phase !== 'payment' || !htmlSnippet || !kcoContainerRef.current) return;
        renderKcoSnippet(kcoContainerRef.current, htmlSnippet);
    }, [phase, htmlSnippet]);

    if (cart.items.length < 1) {
        return null;
    }

    const { ref: agreeRef, ...agreeProps } = register('agree', { required: true });

    if (phase === 'payment' && orderId && htmlSnippet) {
        return (
            <React.Fragment>
                <PageTitle>{intl.formatMessage({ id: 'HEADER_CHECKOUT' })}</PageTitle>
                <BlockHeader
                    pageTitle={<FormattedMessage id="HEADER_CHECKOUT" />}
                    breadcrumb={[
                        { title: (<FormattedMessage id="LINK_HOME" />), url: url.home() },
                        { title: (<FormattedMessage id="LINK_CART" />), url: url.cart() },
                        { title: (<FormattedMessage id="LINK_CHECKOUT" />), url: url.checkout() },
                    ]}
                />
                <BlockSpace layout="spaceship-ledge-height" />
                <div className="block checkout-kustom">
                    <div className="container container--max--xl">
                        <div
                            id="kco-checkout-container"
                            ref={kcoContainerRef}
                            className="checkout-kustom__snippet"
                        />
                        <p className="mt-3 text-muted">
                            <FormattedMessage id="TEXT_CHECKOUT_COMPLETE_REDIRECT" defaultMessage="After completing payment you will be redirected to the confirmation page." />
                            {' '}
                            <AppLink href={url.checkoutSuccess(orderId)}>
                                <FormattedMessage id="LINK_VIEW_ORDER_CONFIRMATION" defaultMessage="View order confirmation" />
                            </AppLink>
                        </p>
                    </div>
                </div>
                <BlockSpace layout="before-footer" />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <PageTitle>{intl.formatMessage({ id: 'HEADER_CHECKOUT' })}</PageTitle>

            <BlockHeader
                pageTitle={<FormattedMessage id="HEADER_CHECKOUT" />}
                breadcrumb={[
                    { title: (<FormattedMessage id="LINK_HOME" />), url: url.home() },
                    { title: (<FormattedMessage id="LINK_CART" />), url: url.cart() },
                    { title: (<FormattedMessage id="LINK_CHECKOUT" />), url: url.checkout() },
                ]}
            />

            <FormProvider {...formMethods}>
                <form className="checkout block" onSubmit={handleSubmit(submitCheckout)}>
                    <div className="container container--max--xl">
                        {checkoutError && (
                            <div className="col-12 mb-3">
                                <div className="alert alert-danger">{checkoutError}</div>
                            </div>
                        )}
                        <div className="row">
                            {!user && (
                                <div className="col-12 mb-3">
                                    <div className="alert alert-lg alert-primary">
                                        <FormattedMessage
                                            id="TEXT_ALERT_RETURNING_CUSTOMER"
                                            values={{
                                                link: (
                                                    <AppLink href={url.signIn()}>
                                                        <FormattedMessage id="TEXT_ALERT_RETURNING_CUSTOMER_LINK" />
                                                    </AppLink>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="col-12 col-lg-6 col-xl-7">
                                <div className="card mb-lg-0">
                                    <div className="card-body card-body--padding--2">
                                        <CheckoutForm />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                                <div className="card mb-0">
                                    <div className="card-body card-body--padding--2">
                                        <h3 className="card-title">
                                            <FormattedMessage id="HEADER_YOUR_ORDER" />
                                        </h3>

                                        <CheckoutCart />

                                        <div className="checkout__agree form-group">
                                            <div className="form-check">
                                                <Checkbox
                                                    id="checkout-form-agree"
                                                    className={classNames('form-check-input', {
                                                        'is-invalid': errors.agree,
                                                    })}
                                                    inputRef={agreeRef}
                                                    {...agreeProps}
                                                />
                                                <label className="form-check-label" htmlFor="checkout-form-agree">
                                                    <FormattedMessage
                                                        id="INPUT_TERMS_AGREE_LABEL"
                                                        values={{
                                                            link: (
                                                                <AppLink href={url.pageTerms()} target="_blank">
                                                                    <FormattedMessage
                                                                        id="INPUT_TERMS_AGREE_LABEL_LINK"
                                                                    />
                                                                </AppLink>
                                                            ),
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className={classNames(
                                                'btn',
                                                'btn-primary',
                                                'btn-xl',
                                                'btn-block',
                                                {
                                                    'btn-loading': checkoutInProgress,
                                                },
                                            )}
                                        >
                                            <FormattedMessage id="BUTTON_PLACE_ORDER" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
