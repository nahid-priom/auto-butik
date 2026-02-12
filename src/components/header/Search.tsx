// react
import React, { useRef, useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
// application
import { Search20Svg } from '~/svg';
import { useGlobalMousedown } from '~/services/hooks';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { toast } from 'react-toastify';

const MIN_SEARCH_LENGTH = 2;

export function Search() {
    const intl = useIntl();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const { currentActiveCar } = useCurrentActiveCar();

    const rootRef = useRef<HTMLDivElement>(null);

    const handleInputFocus = (_event: React.FocusEvent<HTMLInputElement>) => {};

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmed = query.trim();
        if (!trimmed) return;

        if (trimmed.length < MIN_SEARCH_LENGTH) {
            toast.info(
                intl.formatMessage(
                    { id: 'TEXT_SEARCH_MIN_CHARS', defaultMessage: 'Enter at least {count} characters to search' },
                    { count: MIN_SEARCH_LENGTH }
                )
            );
            return;
        }

        const searchSegment = `search=${encodeURIComponent(trimmed)}`;
        const modelId =
            currentActiveCar?.data && 'modell_id' in currentActiveCar.data
                ? currentActiveCar.data.modell_id
                : null;

        if (modelId) {
            router.push(`/catalog/products/${modelId}?${searchSegment}`);
        } else {
            router.push(`/catalog/products?${searchSegment}`);
        }
    };

    const handleRootBlur = () => {
        setTimeout(() => {
            if (document.activeElement === document.body) {
                return;
            }

            // no dropdown to close anymore
        }, 10);
    };

    useGlobalMousedown((event) => {
        const outside = (
            rootRef.current
            && !rootRef.current.contains(event.target as HTMLElement)
        );

        if (outside) {
            // nothing to do
        }
    }, [rootRef]);

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

            </form>
        </div>
    );
}

export default Search;
