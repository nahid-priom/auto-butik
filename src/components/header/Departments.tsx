// react
import React, { useCallback, useEffect, useRef, useState } from 'react';
// third-party
import classNames from 'classnames';
// application
import AppLink from '~/components/shared/AppLink';
import Megamenu from '~/components/header/Megamenu';
import { ArrowRoundedDown9x6Svg, ArrowRoundedRight7x11Svg, Menu16x12Svg } from '~/svg';
import { IDepartmentsLink } from '~/interfaces/departments-link';
import { useGlobalMousedown } from '~/services/hooks';
// data
import dataHeaderDepartments from '~/data/headerDepartments';

const DEPARTMENTS_MENU_ID = 'departments-menu';

interface Props {
    label: React.ReactNode;
}

function Departments(props: Props) {
    const { label } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<IDepartmentsLink | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const handleButtonClick = useCallback(() => {
        setIsOpen((state) => !state);
    }, []);

    const handleBodyMouseLeave = useCallback(() => {
        setCurrentItem(null);
    }, []);

    const handleListPaddingMouseEnter = useCallback(() => {
        setCurrentItem(null);
    }, []);

    const handleItemMouseEnter = useCallback((item: IDepartmentsLink) => {
        setCurrentItem(item);
    }, []);

    const handleItemClick = useCallback(() => {
        setIsOpen(false);
        setCurrentItem(null);
    }, []);

    useGlobalMousedown((event) => {
        if (rootRef.current && !rootRef.current.contains(event.target as HTMLElement)) {
            setIsOpen(false);
        }
    }, [rootRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const classes = classNames('departments', {
        'departments--open': isOpen,
    });

    return (
        <div className={classes} ref={rootRef}>
            <button
                className="departments__button"
                type="button"
                onClick={handleButtonClick}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={DEPARTMENTS_MENU_ID}
            >
                <span className="departments__button-icon">
                    <Menu16x12Svg />
                </span>
                <span className="departments__button-title">
                    {label}
                </span>
                <span className="departments__button-arrow">
                    <ArrowRoundedDown9x6Svg />
                </span>
            </button>
            <div
                id={DEPARTMENTS_MENU_ID}
                className="departments__menu"
                role="menu"
                aria-orientation="vertical"
            >
                <div className="departments__arrow" />
                <div className="departments__body" onMouseLeave={handleBodyMouseLeave}>
                    <ul className="departments__list">
                        <li
                            className="departments__list-padding"
                            role="presentation"
                            onMouseEnter={handleListPaddingMouseEnter}
                        />
                        {dataHeaderDepartments.map((item, index) => {
                            const itemHasSubmenu = !!item.submenu;
                            const itemClasses = classNames('departments__item', {
                                'departments__item--has-submenu': itemHasSubmenu,
                                'departments__item--submenu--megamenu': item.submenu?.type === 'megamenu',
                                'departments__item--hover': item === currentItem,
                            });
                            const titleText = typeof item.title === 'string' ? item.title : undefined;

                            return (
                                <li
                                    className={itemClasses}
                                    key={index}
                                    role="none"
                                    onMouseEnter={() => handleItemMouseEnter(item)}
                                >
                                    <AppLink
                                        className="departments__item-link"
                                        href={item.url}
                                        onClick={handleItemClick}
                                        title={titleText}
                                        role="menuitem"
                                        {...item.customFields?.anchorProps}
                                    >
                                        {item.title}
                                        {itemHasSubmenu && (
                                            <span className="departments__item-arrow">
                                                <ArrowRoundedRight7x11Svg />
                                            </span>
                                        )}
                                    </AppLink>
                                </li>
                            );
                        })}
                        <li
                            className="departments__list-padding"
                            role="presentation"
                            onMouseEnter={handleListPaddingMouseEnter}
                        />
                    </ul>

                    <div className="departments__menu-container">
                        {dataHeaderDepartments.map((item, index) => {
                            if (!item.submenu) {
                                return null;
                            }

                            const itemClasses = classNames(
                                'departments__megamenu',
                                `departments__megamenu--size--${item.submenu.size}`,
                                {
                                    'departments__megamenu--open': item === currentItem,
                                },
                            );

                            return (
                                <Megamenu
                                    className={itemClasses}
                                    menu={item.submenu}
                                    key={index}
                                    onItemClick={handleItemClick}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Departments);
