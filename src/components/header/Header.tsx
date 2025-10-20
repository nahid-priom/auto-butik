// react
import React, { useMemo, useRef } from 'react';
// third-party
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

function Header() {
    const user = useUser();
    const wishlist = useWishlist();
    const options = useOptions();
    const desktopLayout = options.desktopHeaderLayout;

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

    return (
        <div className="header">
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

            <div className="header__navbar">
                <div className="header__navbar-departments">
                    <Departments label={departmentsLabel} />
                </div>
                <div className="header__navbar-menu">
                    <MainMenu />
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
