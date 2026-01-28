// react
import React, { useRef, useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
// application
import { Search20Svg } from '~/svg';
import { useGlobalMousedown } from '~/services/hooks';
import { carApi } from '~/api/car.api';
import { useGarage } from '~/contexts/GarageContext';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { toast } from 'react-toastify';
import { addCarSearchToHistory } from '~/services/car-search-history';

export function Search() {
    const intl = useIntl();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { addVehicle } = useGarage();
    const { setCurrentActiveCar } = useCurrentActiveCar();

    const rootRef = useRef<HTMLDivElement>(null);

    const handleInputFocus = (_event: React.FocusEvent<HTMLInputElement>) => {};

    const vinSearch = async (cleanedRegNumber: string, originalQuery: string) => {
        if (isSearching) return;
        setIsSearching(true);
        try {
            const response = await carApi.getCarByRegistration(cleanedRegNumber);
            const carData = response.data;

            // Save to browsing history, as in banner search
            addCarSearchToHistory(carData, 'registration', { registrationNumber: cleanedRegNumber });

            addVehicle(carData); // auto-sets current via context
            setCurrentActiveCar({
                regNr: (carData as any).RegNr,
                data: carData as any,
                fetchedAt: Date.now(),
            });
            const carName = (carData as any).C_merke + ' ' + (carData as any).C_modell;
            toast.success(
                intl.formatMessage(
                    { id: 'TEXT_VEHICLE_ADDED_TO_GARAGE', defaultMessage: '{vehicleName} added to garage' },
                    { vehicleName: carName }
                ),
                { theme: 'colored' }
            );
            setQuery('');
            router.push('/catalog');
        } catch (e) {
            toast.error(intl.formatMessage({ id: 'ERROR_VIN_NOT_FOUND' }));
            // keep the query as-is so user can edit or submit for product search
            setQuery(originalQuery);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const valueRaw = event.currentTarget.value;
        // Match banner formatting for VIN/Registration: XXX XXX
        let formatted = valueRaw.toUpperCase();
        formatted = formatted.replace(/\s+/g, '');
        formatted = formatted.substring(0, 6);
        if (formatted.length > 3) {
            formatted = formatted.substring(0, 3) + ' ' + formatted.substring(3);
        }
        setQuery(formatted);

        // Auto-search when 6 characters are entered (excluding space)
        const cleanedValue = formatted.replace(/\s+/g, '');
        if (cleanedValue.length === 6) {
            vinSearch(cleanedValue, valueRaw);
        }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedDisplayed = query.trim();
        if (!trimmedDisplayed) return;

        // If value looks like a Swedish registration (6 chars ignoring space), do VIN lookup
        const cleanedRegNumber = trimmedDisplayed.replace(/\s+/g, '').toUpperCase();
        const isRegNumber = cleanedRegNumber.length === 6;

        (async () => {
            try {
                if (isRegNumber) {
                    await vinSearch(cleanedRegNumber, trimmedDisplayed);
                } else {
                    const rawQuery = trimmedDisplayed; // keep original casing for product search
                    router.push(`/catalog/products?search=${encodeURIComponent(rawQuery)}`);
                }
            } catch (e) {
                // On VIN lookup failure fall back to product search
                router.push(`/catalog/products?search=${encodeURIComponent(trimmedDisplayed)}`);
            }
        })();
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
