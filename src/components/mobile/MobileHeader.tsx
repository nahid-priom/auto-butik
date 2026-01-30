// react
import React, { useRef, useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
// application
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import VehiclePickerModal from '~/components/shared/VehiclePickerModal';
import { IVehicle } from '~/interfaces/vehicle';
import { useGarage } from '~/contexts/GarageContext';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { useGarageSetCurrent } from '~/store/garage/garageHooks';
import { useGlobalMousedown } from '~/services/hooks';
import { useMobileMenuOpen } from '~/store/mobile-menu/mobileMenuHooks';
import { toast } from 'react-toastify';
import { CarDropdown } from '~/components/header/CarIndicator';
import {
    Car20Svg,
    Cross20Svg,
    Menu18x14Svg,
    Person20Svg,
    Search20Svg,
} from '~/svg';

function MobileHeader() {
    const intl = useIntl();
    const router = useRouter();
    const mobileMenuOpen = useMobileMenuOpen();
    const { vehicles, currentCarId } = useGarage();
    const garageSetCurrent = useGarageSetCurrent();
    const { currentActiveCar } = useCurrentActiveCar();
    const searchFormRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const searchIndicatorRef = useRef<HTMLDivElement | null>(null);
    const garageDropdownRef = useRef<HTMLDivElement | null>(null);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [vehiclePickerIsOpen, setVehiclePickerIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [garageOpen, setGarageOpen] = useState(false);

    const openSearch = () => {
        setSearchIsOpen(true);

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const closeSearch = () => {
        setSearchIsOpen(false);
    };

    const openVehiclePicker = () => {
        setVehiclePickerIsOpen(true);
    };

    const onVehiclePickerClose = () => {
        setVehiclePickerIsOpen(false);

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const onVehiclePickerSelect = (selectedVehicle: IVehicle | null) => {
        garageSetCurrent(selectedVehicle?.id || null);
    };

    const MIN_SEARCH_LENGTH = 2;

    const onSearchInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setSearchQuery(event.currentTarget.value);
    };

    const onSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = searchQuery.trim();
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
        closeSearch();
        const searchSegment = `search=${encodeURIComponent(trimmed)}`;
        const modelId =
            currentActiveCar?.data && 'modell_id' in currentActiveCar.data
                ? (currentActiveCar.data as { modell_id: string }).modell_id
                : null;
        if (modelId) {
            router.push(`/catalog/products/${modelId}?${searchSegment}`);
        } else {
            router.push(`/catalog/products?${searchSegment}`);
        }
    };

    useGlobalMousedown((event) => {
        const outsideForm = (
            searchFormRef.current
            && !searchFormRef.current.contains(event.target as HTMLElement)
        );
        const outsideIndicator = (
            searchIndicatorRef.current
            && !searchIndicatorRef.current.contains(event.target as HTMLElement)
        );
        const outsideGarage = (
            garageDropdownRef.current
            && !garageDropdownRef.current.contains(event.target as HTMLElement)
        );

        if (outsideForm && outsideIndicator && searchIsOpen && !vehiclePickerIsOpen) {
            closeSearch();
        }
        if (outsideGarage) {
            setGarageOpen(false);
        }
    }, [searchFormRef, searchIsOpen, vehiclePickerIsOpen]);

    const currentVehicle = currentCarId
        ? vehicles.find((v) => v.id === currentCarId)
        : undefined;
    const searchPlaceholder = currentVehicle
        ? intl.formatMessage({ id: 'INPUT_SEARCH_PLACEHOLDER_VEHICLE' }, { ...(currentVehicle.data as any) })
        : intl.formatMessage({ id: 'INPUT_SEARCH_PLACEHOLDER' });

    return (
        <div className="mobile-header">
            <VehiclePickerModal
                value={currentVehicle as any}
                isOpen={vehiclePickerIsOpen}
                onClose={onVehiclePickerClose}
                onSelect={onVehiclePickerSelect}
            />

            <div className="container">
                <div className="mobile-header__body">
                    <button
                        className="mobile-header__menu-button"
                        type="button"
                        onClick={mobileMenuOpen}
                    >
                        <Menu18x14Svg />
                    </button>
                    <AppLink href={url.home()} className="mobile-header__logo">
                        <img
                            src="/images/Logo.png"
                            alt="Autobutik Logo"
                            className="mobile-header__logo-img"
                        />
                    </AppLink>
                    <div
                        ref={searchFormRef}
                        className={classNames('mobile-header__search mobile-search', {
                            'mobile-header__search--open': searchIsOpen,
                        })}
                    >
                        <form className="mobile-search__body" onSubmit={onSearchSubmit}>
                            <label className="sr-only" htmlFor="mobile-site-search">
                                <FormattedMessage id="INPUT_SEARCH_LABEL" />
                            </label>
                            <input
                                ref={searchInputRef}
                                type="text"
                                id="mobile-site-search"
                                className="mobile-search__input"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={onSearchInputChange}
                                autoCapitalize="off"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                className="mobile-search__vehicle-picker"
                                onClick={openVehiclePicker}
                            >
                                <Car20Svg />
                                <span className="mobile-search__vehicle-picker-label">
                                    <FormattedMessage id="BUTTON_SEARCH_SELECT_VEHICLE_MOBILE" />
                                </span>
                            </button>
                            <button type="submit" className="mobile-search__button mobile-search__button--search">
                                <Search20Svg />
                            </button>
                            <button
                                type="button"
                                className="mobile-search__button mobile-search__button--close"
                                onClick={closeSearch}
                            >
                                <Cross20Svg />
                            </button>
                            <div className="mobile-search__field" />
                        </form>
                    </div>
                    <div className="mobile-header__indicators" ref={garageDropdownRef}>
                        <div className="mobile-indicator mobile-indicator--search" ref={searchIndicatorRef}>
                            <button type="button" className="mobile-indicator__button" onClick={openSearch}>
                                <span className="mobile-indicator__icon">
                                    <Search20Svg />
                                </span>
                            </button>
                        </div>
                        <div className="mobile-indicator">
                            <AppLink href={url.accountDashboard()} className="mobile-indicator__button">
                                <span className="mobile-indicator__icon">
                                    <Person20Svg />
                                </span>
                            </AppLink>
                        </div>
                        <div
                            className={classNames('mobile-header__garage', {
                                'mobile-header__garage--open': garageOpen,
                            })}
                        >
                            <button
                                type="button"
                                className={classNames('mobile-header__garage-button', {
                                    'mobile-header__garage-button--empty': !currentVehicle,
                                })}
                                onClick={() => setGarageOpen((prev) => !prev)}
                                aria-expanded={garageOpen}
                                aria-haspopup="true"
                            >
                                <span className="mobile-header__garage-icon">
                                    <img src="/images/vehicle-garage.svg" alt="" aria-hidden />
                                    {!currentVehicle && vehicles.length === 0 && (
                                        <span className="mobile-header__garage-warn" aria-hidden>!</span>
                                    )}
                                </span>
                                <span className="mobile-header__garage-label">
                                    {currentVehicle
                                        ? `${(currentVehicle.data as any).C_merke} ${(currentVehicle.data as any).C_modell}`
                                        : <FormattedMessage id="TEXT_NO_VEHICLES" defaultMessage="No vehicle" />}
                                </span>
                            </button>
                            {garageOpen && (
                                <div className="mobile-header__garage-dropdown">
                                    <CarDropdown onCloseMenu={() => setGarageOpen(false)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(MobileHeader);
