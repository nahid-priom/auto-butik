// react
import React, { useRef, useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import classNames from 'classnames';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import CurrencyFormat from '~/components/shared/CurrencyFormat';
import Rating from '~/components/shared/Rating';
import url from '~/services/url';
import { Search20Svg } from '~/svg';
import { IProduct } from '~/interfaces/product';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import { useGlobalMousedown } from '~/services/hooks';

export function Search() {
    const intl = useIntl();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestionsIsOpen, setSuggestionsIsOpen] = useState(false);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<IShopCategory[]>([]);

    const searchCancelFnRef = useRef(() => {});
    const rootRef = useRef<HTMLDivElement>(null);

    const search = (value: string) => {
        searchCancelFnRef.current();

        let canceled = false;

        searchCancelFnRef.current = () => {
            canceled = true;
        };

        shopApi.getSearchSuggestions(value, {
            limitProducts: 3,
            limitCategories: 4,
        }).then((result) => {
            if (canceled) {
                return;
            }

            if (result.products.length === 0 && result.categories.length === 0) {
                setHasSuggestions(false);
                return;
            }

            setHasSuggestions(true);
            setProducts(result.products);
            setCategories(result.categories);
        });

        setQuery(value);
    };

    const toggleSuggestions = (force?: boolean) => {
        setSuggestionsIsOpen((prevState) => {
            return force !== undefined ? force : !prevState;
        });
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const input = event.currentTarget;

        toggleSuggestions(true);
        search(input.value);
    };

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        search(input.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toggleSuggestions(false);
        
        // Navigate to products page with search query
        if (query.trim()) {
            router.push(`/catalog/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleRootBlur = () => {
        setTimeout(() => {
            if (document.activeElement === document.body) {
                return;
            }

            // Close suggestions if the focus received an external element.
            if (document.activeElement && document.activeElement.closest('.search') !== rootRef.current) {
                toggleSuggestions(false);
            }
        }, 10);
    };

    useGlobalMousedown((event) => {
        const outside = (
            rootRef.current
            && !rootRef.current.contains(event.target as HTMLElement)
        );

        if (outside && suggestionsIsOpen) {
            setHasSuggestions(false);
        }
    }, [rootRef, suggestionsIsOpen, setHasSuggestions]);

    const searchPlaceholder = intl.formatMessage({ id: 'INPUT_SEARCH_PLACEHOLDER' });

    return (
        <div className="search" ref={rootRef} onBlur={handleRootBlur}>
            <form className="search__body" onSubmit={handleFormSubmit}>
                <div className="search__shadow" />

                <label className="sr-only" htmlFor="site-search">
                    <FormattedMessage id="INPUT_SEARCH_LABEL" />
                </label>

                <input
                    type="text"
                    className="search__input"
                    id="site-search"
                    autoCapitalize="off"
                    autoComplete="off"
                    spellCheck="false"
                    name="search"
                    value={query}
                    placeholder={searchPlaceholder}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                />


                <button className="search__button search__button--end" type="submit">
                    <span className="search__button-icon">
                        <Search20Svg />
                    </span>
                </button>

                <div className="search__box" />
                <div className="search__decor">
                    <div className="search__decor-start" />
                    <div className="search__decor-end" />
                </div>

                <div
                    className={classNames('search__dropdown', 'search__dropdown--suggestions', 'suggestions', {
                        'search__dropdown--open': suggestionsIsOpen && hasSuggestions,
                    })}
                >
                    {products.length > 0 && (
                        <div className="suggestions__group">
                            <div className="suggestions__group-title">
                                <FormattedMessage id="TEXT_PRODUCTS" />
                            </div>
                            <div className="suggestions__group-content">
                                {products.map((product) => (
                                    <AppLink
                                        key={product.id}
                                        href={url.product(product)}
                                        className="suggestions__item suggestions__product"
                                        onClick={() => toggleSuggestions(false)}
                                    >
                                        <div className="suggestions__product-image">
                                            <AppImage src={product.images && product.images[0]} />
                                        </div>
                                        <div className="suggestions__product-info">
                                            <div className="suggestions__product-name">
                                                {product.name}
                                            </div>
                                            <div className="suggestions__product-rating">
                                                <div className="suggestions__product-rating-stars">
                                                    <Rating value={product.rating || 0} />
                                                </div>
                                                <div className="suggestions__product-rating-label">
                                                    <FormattedMessage
                                                        id="TEXT_RATING_LABEL"
                                                        values={{
                                                            rating: product.rating,
                                                            reviews: product.reviews,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" suggestions__product-price">
                                            <CurrencyFormat value={product.price} />
                                        </div>

                                    </AppLink>
                                ))}
                            </div>
                        </div>
                    )}
                    {categories.length > 0 && (
                        <div className="suggestions__group">
                            <div className="suggestions__group-title">
                                <FormattedMessage id="TEXT_CATEGORIES" />
                            </div>
                            <div className="suggestions__group-content">
                                {categories.map((category) => (
                                    <AppLink
                                        key={category.id}
                                        href={url.category(category)}
                                        className="suggestions__item suggestions__category"
                                        onClick={() => toggleSuggestions(false)}
                                    >
                                        {category.name}
                                    </AppLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </form>
        </div>
    );
}

export default Search;
