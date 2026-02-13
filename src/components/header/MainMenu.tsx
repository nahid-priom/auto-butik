// react
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";

// SSR-safe: useLayoutEffect runs only on client to avoid hydration warning
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
// third-party
import classNames from "classnames";
// application
import AppLink from "~/components/shared/AppLink";
import { FormattedMessage } from "react-intl";
import Megamenu from "~/components/header/Megamenu";
import Menu from "~/components/header/Menu";
import { ArrowDownSm7x5Svg } from "~/svg";
import { IMainMenuLink } from "~/interfaces/main-menu-link";
import { useOptions } from "~/store/options/optionsHooks";
import { useCategoryTreeSafe } from "~/contexts/CategoryTreeContext";

const MEGAMENU_BODY_CLASS = "megamenu-open";

/** Match header container: xxl (1330) + grid-gutter (30) = 1360. Same max width as header content. */
const MEGAMENU_DESKTOP_MAX_WIDTH = 1360;
const MEGAMENU_DESKTOP_BREAKPOINT = 992;

/** Update mega menu dropdown: under categories row; desktop = centered, header-width; mobile = anchor width. */
function updateMegamenuPosition(
    categoriesRowRef: React.RefObject<HTMLDivElement | null>,
    menuRef: React.RefObject<HTMLDivElement | null>
) {
    const anchor = categoriesRowRef.current;
    const dropdown = menuRef.current;
    if (!anchor || !dropdown) return;
    const rect = anchor.getBoundingClientRect();
    const viewportWidth = typeof document !== "undefined" ? document.documentElement.clientWidth : 0;
    const isDesktop = viewportWidth >= MEGAMENU_DESKTOP_BREAKPOINT;

    if (isDesktop) {
        const width = Math.min(MEGAMENU_DESKTOP_MAX_WIDTH, Math.max(0, viewportWidth - 32));
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${(viewportWidth - width) / 2}px`;
        dropdown.style.width = `${width}px`;
    } else {
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
    }
}

interface MainMenuProps {
    /** Ref to the categories row (header__navbar) for mega menu dropdown anchoring. */
    categoriesRowRef?: React.RefObject<HTMLDivElement | null>;
}

function MainMenu({ categoriesRowRef }: MainMenuProps) {
    const { headerMenu } = useCategoryTreeSafe();
    const items: IMainMenuLink[] = headerMenu ?? [];
    const [currentItem, setCurrentItem] = useState<IMainMenuLink | null>(null);
    const options = useOptions();
    const desktopLayout = options.desktopHeaderLayout;
    const isMegamenuOpen = !!currentItem?.submenu && currentItem.submenu.type === "megamenu";
    const menuRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLSpanElement | null>(null);

    // Hover: only for non-megamenu items (small dropdowns). Megamenu is click-only.
    const handleItemMouseEnter = useCallback((item: IMainMenuLink) => {
        if (item.submenu?.type === "megamenu") return;
        setCurrentItem(item);
    }, []);

    const handleItemMouseLeave = useCallback((item: IMainMenuLink) => {
        if (item.submenu?.type === "megamenu") return;
        if (currentItem === item) setCurrentItem(null);
    }, [currentItem]);

    // Click: close when navigating (link click inside menu)
    const handleItemClick = useCallback(() => {
        setCurrentItem(null);
    }, []);

    // Megamenu: open/close on trigger click (toggle)
    const handleMegamenuTriggerClick = useCallback((item: IMainMenuLink) => (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentItem((prev) => (prev === item ? null : item));
    }, []);

    // Outside click: single document listener (capture) so hero/overlays don't block; close when click is outside menu and trigger.
    useEffect(() => {
        if (!isMegamenuOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (triggerRef.current?.contains(target)) return;
            setCurrentItem(null);
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [isMegamenuOpen]);

    // Lock body scroll when megamenu is open + reserve scrollbar width to prevent layout shift
    useEffect(() => {
        if (typeof document === "undefined") return;
        const body = document.body;
        if (isMegamenuOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const prevPaddingRight = body.style.paddingRight;
            const prevOverflow = body.style.overflow;
            body.classList.add(MEGAMENU_BODY_CLASS);
            if (scrollbarWidth > 0) {
                body.style.paddingRight = `${scrollbarWidth}px`;
            }
            return () => {
                body.classList.remove(MEGAMENU_BODY_CLASS);
                body.style.paddingRight = prevPaddingRight;
                body.style.overflow = prevOverflow;
            };
        } else {
            body.classList.remove(MEGAMENU_BODY_CLASS);
            return () => body.classList.remove(MEGAMENU_BODY_CLASS);
        }
    }, [isMegamenuOpen]);

    // Escape closes megamenu and returns focus to trigger
    useEffect(() => {
        if (!isMegamenuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setCurrentItem(null);
            triggerRef.current?.focus();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isMegamenuOpen]);

    // Anchor mega menu dropdown to categories row: position under navbar (desktop only)
    useIsomorphicLayoutEffect(() => {
        if (!isMegamenuOpen || !categoriesRowRef) return;
        updateMegamenuPosition(categoriesRowRef, menuRef);
        const onUpdate = () => updateMegamenuPosition(categoriesRowRef, menuRef);
        window.addEventListener("resize", onUpdate);
        window.addEventListener("scroll", onUpdate, true);
        return () => {
            window.removeEventListener("resize", onUpdate);
            window.removeEventListener("scroll", onUpdate, true);
        };
    }, [isMegamenuOpen, categoriesRowRef]);

    return (
        <div className="main-menu">
            <ul className="main-menu__list">
                {items.map((item, index) => {
                    if (item.customFields?.ignoreIn?.includes(desktopLayout)) {
                        return null;
                    }

                    const itemHasSubmenu = !!item.submenu;
                    const itemClasses = classNames("main-menu__item", {
                        "main-menu__item--has-submenu": itemHasSubmenu,
                        "main-menu__item--submenu--menu": item.submenu?.type === "menu",
                        "main-menu__item--submenu--megamenu": item.submenu?.type === "megamenu",
                        "main-menu__item--hover": item === currentItem,
                    });

                    const isMegamenuItem = item.submenu?.type === "megamenu";

                    return (
                        <li
                            className={itemClasses}
                            key={index}
                            onMouseEnter={() => handleItemMouseEnter(item)}
                            onMouseLeave={() => handleItemMouseLeave(item)}
                        >
                            {isMegamenuItem ? (
                                <span
                                    ref={isMegamenuItem && item === currentItem ? triggerRef : undefined}
                                    className="main-menu__link main-menu__link--no-nav"
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={item === currentItem}
                                    aria-haspopup="true"
                                    onClick={handleMegamenuTriggerClick(item)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setCurrentItem((prev) => (prev === item ? null : item));
                                        }
                                    }}
                                >
                                    {typeof item.title === "string" ? <FormattedMessage id={item.title} defaultMessage={item.title} /> : item.title}
                                    {itemHasSubmenu && <ArrowDownSm7x5Svg />}
                                </span>
                            ) : (
                                <AppLink
                                    className="main-menu__link"
                                    href={item.url}
                                    onClick={handleItemClick}
                                    {...item.customFields?.anchorProps}
                                >
                                    {typeof item.title === "string" ? <FormattedMessage id={item.title} defaultMessage={item.title} /> : item.title}
                                    {itemHasSubmenu && <ArrowDownSm7x5Svg />}
                                </AppLink>
                            )}

                            {itemHasSubmenu && (
                                <div
                                    className="main-menu__submenu"
                                    ref={item.submenu?.type === "megamenu" && item === currentItem ? menuRef : undefined}
                                >
                                    {item.submenu?.type === "menu" && (
                                        <Menu items={item.submenu.links} onItemClick={handleItemClick} />
                                    )}
                                    {item.submenu?.type === "megamenu" && (
                                        <div
                                            className={classNames(
                                                "main-menu__megamenu",
                                                `main-menu__megamenu--size--${item.submenu.size}`
                                            )}
                                        >
                                            <Megamenu menu={item.submenu} onItemClick={handleItemClick} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default MainMenu;
