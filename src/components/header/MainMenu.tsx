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

/** Update mega menu dropdown position to align under the categories row (anchor-based). */
function updateMegamenuPosition(
    categoriesRowRef: React.RefObject<HTMLDivElement | null>,
    submenuRef: React.RefObject<HTMLDivElement | null>
) {
    const anchor = categoriesRowRef.current;
    const dropdown = submenuRef.current;
    if (!anchor || !dropdown) return;
    const rect = anchor.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
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
    const megamenuSubmenuRef = useRef<HTMLDivElement | null>(null);
    const megamenuTriggerRef = useRef<HTMLSpanElement | null>(null);

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

    // Outside click: close megamenu when clicking outside panel and trigger.
    // Capture phase so we run before any stopPropagation() in child (e.g. other dropdowns).
    useEffect(() => {
        if (!isMegamenuOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            const panel = megamenuSubmenuRef.current;
            const trigger = megamenuTriggerRef.current;
            if (!panel) return;
            if (panel.contains(target)) return;
            if (trigger?.contains(target)) return;
            setCurrentItem(null);
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [isMegamenuOpen]);

    // Lock body scroll when megamenu is open
    useEffect(() => {
        if (typeof document === "undefined") return;
        if (isMegamenuOpen) {
            document.body.classList.add(MEGAMENU_BODY_CLASS);
        } else {
            document.body.classList.remove(MEGAMENU_BODY_CLASS);
        }
        return () => document.body.classList.remove(MEGAMENU_BODY_CLASS);
    }, [isMegamenuOpen]);

    // Escape closes megamenu and returns focus to trigger
    useEffect(() => {
        if (!isMegamenuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setCurrentItem(null);
            megamenuTriggerRef.current?.focus();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isMegamenuOpen]);

    // Anchor mega menu dropdown to categories row: position under navbar (desktop only)
    useIsomorphicLayoutEffect(() => {
        if (!isMegamenuOpen || !categoriesRowRef) return;
        updateMegamenuPosition(categoriesRowRef, megamenuSubmenuRef);
        const onUpdate = () => updateMegamenuPosition(categoriesRowRef, megamenuSubmenuRef);
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
                                    ref={isMegamenuItem && item === currentItem ? megamenuTriggerRef : undefined}
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
                                    ref={item.submenu?.type === "megamenu" && item === currentItem ? megamenuSubmenuRef : undefined}
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
