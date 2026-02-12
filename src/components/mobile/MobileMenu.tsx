/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */

// react
import React, { useRef } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import MobileMenuConveyor, { IMobileMenuConveyorController } from '~/components/mobile/MobileMenuConveyor';
import MobileMenuIndicators from '~/components/mobile/MobileMenuIndicators';
import MobileMenuLinks from '~/components/mobile/MobileMenuLinks';
import MobileMenuPanel from '~/components/mobile/MobileMenuPanel';
import MobileMenuSettings from '~/components/mobile/MobileMenuSettings';
import url from '~/services/url';
import { Cross12Svg } from '~/svg';
import { useMobileMenu, useMobileMenuClose } from '~/store/mobile-menu/mobileMenuHooks';
import { useCategoryTreeSafe } from '~/contexts/CategoryTreeContext';
import { getMobileMenuLinksFromMenu, getMobileMenuLinksFromDesktop } from '~/data/mobileMenuFromDesktop';

function getMobileMenuLinks(headerMenu: ReturnType<typeof useCategoryTreeSafe>['headerMenu']) {
    const items = headerMenu
        ? getMobileMenuLinksFromMenu(headerMenu)
        : getMobileMenuLinksFromDesktop();
    return [
        { title: 'LINK_HOME', url: '/' as const },
        ...items,
    ];
}

function MobileMenu() {
    const mobileMenu = useMobileMenu();
    const mobileMenuClose = useMobileMenuClose();
    const bodyRef = useRef<HTMLDivElement>(null);
    const conveyorRef = useRef<IMobileMenuConveyorController>(null);
    const { headerMenu } = useCategoryTreeSafe();
    const mobileMenuLinksFromDesktop = getMobileMenuLinks(headerMenu);

    const rootClasses = classNames('mobile-menu', {
        'mobile-menu--open': mobileMenu.open,
    });

    const onMenuClosed = () => {
        if (conveyorRef.current) {
            conveyorRef.current.reset();
        }
    };

    const onTransitionEnd = (event: React.TransitionEvent) => {
        if (event.target === bodyRef.current && event.propertyName === 'transform' && !mobileMenu.open) {
            onMenuClosed();
        }
    };

    return (
        <div className={rootClasses}>
            <div className="mobile-menu__backdrop" onClick={mobileMenuClose} />
            <div className="mobile-menu__body" ref={bodyRef} onTransitionEnd={onTransitionEnd}>
                <button className="mobile-menu__close" type="button" onClick={mobileMenuClose}>
                    <Cross12Svg />
                </button>

                <MobileMenuConveyor controllerRef={conveyorRef}>
                    <MobileMenuPanel label={<FormattedMessage id="TEXT_MOBILE_MENU_TITLE" defaultMessage="Menu" />}>
                        <MobileMenuSettings />
                        <div className="mobile-menu__divider" />
                        <MobileMenuIndicators />
                        <div className="mobile-menu__divider" />
                        <MobileMenuLinks
                            items={mobileMenuLinksFromDesktop}
                            onItemClick={(item) => {
                                if (!item.submenu || item.submenu.length === 0) {
                                    mobileMenuClose();
                                }
                            }}
                        />

                        <div className="mobile-menu__spring" />
                        <div className="mobile-menu__divider" />
                        <AppLink href={url.pageContactUs()} className="mobile-menu__contacts" onClick={mobileMenuClose}>
                            <div className="mobile-menu__contacts-subtitle">
                                <FormattedMessage id="BUTTON_CONTACT_US" />
                            </div>
                            <div className="mobile-menu__contacts-title">800 060-0730</div>
                        </AppLink>
                    </MobileMenuPanel>
                </MobileMenuConveyor>
            </div>
        </div>
    );
}

export default React.memo(MobileMenu);
