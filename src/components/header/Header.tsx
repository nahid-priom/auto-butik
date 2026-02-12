// react
import React, { useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '~/hooks/useIsomorphicLayoutEffect';
// third-party
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
// application
import AccountMenu from '~/components/header/AccountMenu';
import AppLink from '~/components/shared/AppLink';
import CarIndicator from '~/components/header/CarIndicator';
import CurrencyFormat from '~/components/shared/CurrencyFormat';
import Departments from '~/components/header/Departments';
import Dropcart from '~/components/header/Dropcart';
import Indicator, { IIndicatorController } from '~/components/header/Indicator';
import Logo from '~/components/header/Logo';
import MainMenu from '~/components/header/MainMenu';
import Search from '~/components/header/Search';
import Topbar from '~/components/header/Topbar';
import url from '~/services/url';
import { HeartIcon, UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '~/store/cart/cartHooks';
import { useOptions } from '~/store/options/optionsHooks';
import { useUser } from '~/store/user/userHooks';
import { useWishlist } from '~/store/wishlist/wishlistHooks';

// Hysteresis: enter compact only after scrolling past ENTER; exit only when back above EXIT.
const SCROLL_ENTER_COMPACT_PX = 80;
const SCROLL_EXIT_COMPACT_PX = 32;
// Ignore tiny scroll deltas to avoid 1px jitter and re-renders.
const SCROLL_DELTA_MIN_PX = 8;
// After toggling compact, ignore opposite transition briefly (avoids layout feedback loop).
const COMPACT_COOLDOWN_MS = 120;

function Header() {
    const user = useUser();
    const wishlist = useWishlist();
    const options = useOptions();
    const desktopLayout = options.desktopHeaderLayout;
    const [isCompact, setIsCompact] = useState(false);
    const lastCompactRef = useRef(false);
    const lastScrollYRef = useRef(0);
    const lastToggleAtRef = useRef(0);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;
        let ticking = false;

        const updateCompact = () => {
            const y = window.scrollY;
            const now = Date.now();
            const cooldownActive = now - lastToggleAtRef.current < COMPACT_COOLDOWN_MS;

            if (cooldownActive) {
                ticking = false;
                return;
            }

            const nextCompact = lastCompactRef.current
                ? y > SCROLL_EXIT_COMPACT_PX
                : y > SCROLL_ENTER_COMPACT_PX;

            if (nextCompact !== lastCompactRef.current) {
                lastCompactRef.current = nextCompact;
                lastToggleAtRef.current = now;
                setIsCompact(nextCompact);
            }
            ticking = false;
        };

        const onScroll = () => {
            const y = window.scrollY;
            const delta = Math.abs(y - lastScrollYRef.current);
            const nearEnter = Math.abs(y - SCROLL_ENTER_COMPACT_PX) <= SCROLL_DELTA_MIN_PX;
            const nearExit = Math.abs(y - SCROLL_EXIT_COMPACT_PX) <= SCROLL_DELTA_MIN_PX;
            const shouldUpdate = delta >= SCROLL_DELTA_MIN_PX || nearEnter || nearExit;

            if (!shouldUpdate) {
                return;
            }
            lastScrollYRef.current = y;

            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateCompact);
            }
        };

        // Sync with initial scroll before first paint (no extra setState flash).
        const initialY = window.scrollY;
        lastScrollYRef.current = initialY;
        lastCompactRef.current = initialY > SCROLL_ENTER_COMPACT_PX;
        setIsCompact(lastCompactRef.current);

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const departmentsLabel = useMemo(() => (
        desktopLayout === 'spaceship'
            ? <FormattedMessage id="BUTTON_DEPARTMENTS" />
            : <FormattedMessage id="BUTTON_DEPARTMENTS_LONG" />
    ), [desktopLayout]);

    const accountIndicatorLabel = user ? user.email : <FormattedMessage id="TEXT_INDICATOR_ACCOUNT_LABEL" />;
    const accountIndicatorValue = <FormattedMessage id="TEXT_INDICATOR_ACCOUNT_VALUE" />;
    const accountIndicatorCtrl = useRef<IIndicatorController | null>(null);

    const cart = useCart();
    const cartIndicatorLabel = <FormattedMessage id="TEXT_INDICATOR_CART_LABEL" />;
    const cartIndicatorCtrl = useRef<IIndicatorController | null>(null);

    /** Ref to the categories row (navbar) for mega menu dropdown anchoring (desktop). */
    const categoriesRowRef = useRef<HTMLDivElement>(null);

    return (
        <div className={classNames('header', isCompact && 'header--compact')}>
            <div className="header__megamenu-area megamenu-area" />
            {desktopLayout === 'spaceship' && (
                <React.Fragment>
                    <div className="header__topbar-start-bg" />
                    <div className="header__topbar-start">
                        <Topbar layout="spaceship-start" />
                    </div>
                    <div className="header__topbar-end-bg" />
                    <div className="header__topbar-end">
                        <Topbar layout="spaceship-end" />
                    </div>
                </React.Fragment>
            )}
            {desktopLayout === 'classic' && (
                <React.Fragment>
                    <div className="header__topbar-classic-bg" />
                    <div className="header__topbar-classic">
                        <Topbar layout="classic" />
                    </div>
                </React.Fragment>
            )}

            <Logo className="header__logo" />
            
            <div className="header__search">
                <Search />
            </div>

            <div className="header__indicators">
                <Indicator
                    href={url.wishlist()}
                    icon={<HeartIcon />}
                    counter={wishlist.items.length}
                />

                <Indicator
                    href={url.accountDashboard()}
                    icon={<UserCircleIcon />}
                    label={accountIndicatorLabel}
                    value={accountIndicatorValue}
                    trigger="click"
                    controllerRef={accountIndicatorCtrl}
                >
                    <AccountMenu onCloseMenu={() => accountIndicatorCtrl.current?.close()} />
                </Indicator>

                <CarIndicator />

                <Indicator
                    href={url.cart()}
                    icon={<ShoppingCartIcon />}
                    label={cartIndicatorLabel}
                    value={<CurrencyFormat value={cart.total} />}
                    counter={cart.quantity}
                    trigger="click"
                    controllerRef={cartIndicatorCtrl}
                >
                    <Dropcart onCloseMenu={() => cartIndicatorCtrl.current?.close()} />
                </Indicator>
            </div>

            <div className="header__navbar" ref={categoriesRowRef}>
                <div className="header__navbar-departments">
                    <Departments label={departmentsLabel} />
                </div>
                <div className="header__navbar-menu">
                    <MainMenu categoriesRowRef={categoriesRowRef} />
                </div>
                {desktopLayout === 'classic' && (
                    <div className="header__navbar-contact">
                        <AppLink href={url.pageContactUs()} className="contact-button">
                            <FormattedMessage id="BUTTON_CONTACT_US" />
                        </AppLink>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(Header);
