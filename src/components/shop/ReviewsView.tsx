// react
import React from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
// application
import AppLink from '~/components/shared/AppLink';
import ReviewsList from '~/components/shop/ReviewsList';
import { IProductPageLayout } from '~/interfaces/pages';
// import { shopApi } from '~/api';
import { useAsyncAction, useIsUnmountedRef } from '~/store/hooks';
import { useList } from '~/services/hooks';
import { useUser } from '~/store/user/userHooks';
import { validateEmail } from '~/services/validators';
import url from '~/services/url';
import { fetchProductReviews, fetchProductReviewStats, submitProductReview } from '~/api/graphql/reviews.api';
import { useEffect, useState } from 'react';

interface IForm {
    rating: string;
    author: string;
    email: string;
    content: string;
}

interface Props {
    productId: number;
    productPageLayout: IProductPageLayout;
}

function ReviewsView(props: Props) {
    const intl = useIntl();
    const { productId, productPageLayout } = props;
    const user = useUser();
    const isLoggedIn = !!user;
    const formMethods = useForm<IForm>();
    const isUnmountedRef = useIsUnmountedRef();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = formMethods;
    const defaultLimit = 8;
    const {
        list,
        options,
        load,
        onNavigate,
    } = useList((opts) => {
        const limit = opts.limit ?? defaultLimit;
        const page = opts.page ?? 1;
        const skip = (page - 1) * limit;
        return fetchProductReviews(productId, { take: limit, skip, sort: { createdAt: 'DESC' } });
    }, [productId]);

    const [stats, setStats] = useState<{ averageRating: number; totalReviews: number } | null>(null);
    useEffect(() => {
        let canceled = false;
        fetchProductReviewStats(productId).then((s) => {
            if (!canceled) setStats(s);
        });
        return () => {
            canceled = true;
        };
    }, [productId]);

    const [submit, submitInProgress] = useAsyncAction(async (data: IForm) => {
        await submitProductReview(productId, {
            rating: parseFloat(data.rating),
            review: data.content,
        });

        // Reload the list with options reset.
        await load({});

        if (isUnmountedRef.current) {
            return;
        }

        reset();

        toast.success(intl.formatMessage({ id: 'TEXT_TOAST_REVIEW_ADDED' }), { theme: 'colored' });
    }, [productId, reset]);

    return (
        <div className="reviews-view">
            {stats && (
                <div className="mb-3">
                    <strong><FormattedMessage id="TEXT_TAB_REVIEWS" />:</strong>
                    {' '}{stats.averageRating?.toFixed(1) || 0}/5 · {stats.totalReviews || 0} reviews
                </div>
            )}
            {list && (
                <div className="reviews-view__list">
                    <ReviewsList
                        list={list}
                        page={options.page}
                        onNavigate={onNavigate}
                    />
                </div>
            )}

            {isLoggedIn ? (
                <form className="reviews-view__form" onSubmit={handleSubmit(submit)}>
                    <h3 className="reviews-view__header">
                        <FormattedMessage id="HEADER_WRITE_REVIEW" />
                    </h3>
                    <div className="row">
                        <div
                            className={classNames({
                                'col-xxl-8 col-xl-10 col-lg-9 col-12': productPageLayout === 'full',
                                'col-xxl-12 col-xl-10 col-12': productPageLayout === 'sidebar',
                            })}
                        >
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="review-stars">
                                        <FormattedMessage id="INPUT_RATING_LABEL" />
                                    </label>
                                    <select
                                        id="review-stars"
                                        className={classNames('form-control', {
                                            'is-invalid': errors.rating,
                                        })}
                                        {...register('rating', { required: true })}
                                    >
                                        <option value="">
                                            {intl.formatMessage({ id: 'INPUT_RATING_PLACEHOLDER' })}
                                        </option>
                                        {[5, 4, 3, 2, 1].map((stars) => (
                                            <option key={stars} value={stars}>
                                                {intl.formatMessage({ id: 'INPUT_RATING_OPTION' }, { stars })}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        {errors.rating?.type === 'required' && (
                                            <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                        )}
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="review-author">
                                        <FormattedMessage id="INPUT_YOUR_NAME_LABEL" />
                                    </label>
                                    <input
                                        type="text"
                                        id="review-author"
                                        className={classNames('form-control', {
                                            'is-invalid': errors.author,
                                        })}
                                        placeholder={intl.formatMessage({ id: 'INPUT_YOUR_NAME_PLACEHOLDER' })}
                                        {...register('author', { required: true })}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.author?.type === 'required' && (
                                            <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                        )}
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="review-email">
                                        <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
                                    </label>
                                    <input
                                        type="text"
                                        id="review-email"
                                        className={classNames('form-control', {
                                            'is-invalid': errors.email,
                                        })}
                                        placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_ADDRESS_PLACEHOLDER' })}
                                        {...register('email', {
                                            required: true,
                                            validate: { email: validateEmail },
                                        })}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.email?.type === 'required' && (
                                            <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                        )}
                                        {errors.email?.type === 'email' && (
                                            <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="review-text">
                                    <FormattedMessage id="INPUT_YOUR_REVIEW_LABEL" />
                                </label>
                                <textarea
                                    id="review-text"
                                    rows={6}
                                    className={classNames('form-control', {
                                        'is-invalid': errors.content,
                                    })}
                                    placeholder={intl.formatMessage({ id: 'INPUT_YOUR_REVIEW_PLACEHOLDER' })}
                                    {...register('content', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.content?.type === 'required' && (
                                        <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                    )}
                                </div>
                            </div>
                            <div className="form-group mb-0 mt-4">
                                <button
                                    type="submit"
                                    className={classNames('btn', 'btn-primary', {
                                        'btn-loading': submitInProgress,
                                    })}
                                >
                                    <FormattedMessage id="BUTTON_POST_REVIEW" />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="reviews-view__login-message">
                    <h3 className="reviews-view__header">
                        <FormattedMessage id="HEADER_WRITE_REVIEW" />
                    </h3>
                    <div className="alert" role="alert" style={{ 
                        backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                        borderColor: 'rgba(220, 53, 69, 0.3)',
                        color: '#721c24',
                        textAlign: 'center',
                        padding: '2rem'
                    }}>
                        <FormattedMessage id="TEXT_LOGIN_TO_WRITE_REVIEW" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewsView;
