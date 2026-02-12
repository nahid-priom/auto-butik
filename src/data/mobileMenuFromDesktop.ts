// application
import { IMainMenuLink } from '~/interfaces/main-menu-link';
import { IMobileMenuLink } from '~/interfaces/mobile-menu-link';
import { INestedLink } from '~/interfaces/link';
import dataHeaderCategoryMenu from '~/data/headerCategoryMenu';

const DESKTOP_LAYOUT = 'classic';

/**
 * Convert nested links (megamenu/menu structure) to mobile menu link tree.
 */
function nestedToMobile(links: INestedLink[]): IMobileMenuLink[] {
    return links.map((link) => ({
        title: link.title,
        url: link.url,
        image: link.customFields?.image,
        customFields: link.customFields,
        submenu:
            link.links && link.links.length > 0 ? nestedToMobile(link.links) : undefined,
    }));
}

/**
 * Convert one desktop main menu item to mobile menu format.
 */
function mainMenuLinkToMobile(item: IMainMenuLink): IMobileMenuLink {
    const result: IMobileMenuLink = {
        title: item.title,
        url: item.url,
        customFields: item.customFields,
    };
    if (item.submenu?.type === 'megamenu' && item.submenu.columns) {
        const topLinks = item.submenu.columns.flatMap((col) => col.links || []);
        result.submenu = topLinks.map((link) => ({
            title: link.title,
            url: link.url,
            image: link.customFields?.image,
            customFields: link.customFields,
            submenu:
                link.links && link.links.length > 0
                    ? nestedToMobile(link.links)
                    : undefined,
        }));
    }
    if (item.submenu?.type === 'menu' && item.submenu.links) {
        result.submenu = nestedToMobile(item.submenu.links);
    }
    return result;
}

/**
 * Build mobile menu links from a given desktop header menu (e.g. from API).
 * Filters by desktop layout so mobile matches visible desktop items.
 */
export function getMobileMenuLinksFromMenu(items: IMainMenuLink[]): IMobileMenuLink[] {
    const filtered = items.filter(
        (item) =>
            !item.customFields?.ignoreIn?.includes(DESKTOP_LAYOUT)
    );
    return filtered.map(mainMenuLinkToMobile);
}

/**
 * Build mobile menu links from static desktop header category menu (fallback).
 * Prefer getMobileMenuLinksFromMenu(headerMenu) with API-driven menu when available.
 */
export function getMobileMenuLinksFromDesktop(): IMobileMenuLink[] {
    return getMobileMenuLinksFromMenu(dataHeaderCategoryMenu);
}

export default getMobileMenuLinksFromDesktop;
