/**
 * Builds header category menu (megamenu) from API category tree (/car/categories/tree).
 *
 * Structure:
 * - Bildelar (MENU_CAR_PARTS): All root categories EXCEPT Torkarblad, Oljor och bilvård, Biltillbehör, Verktyg.
 *   Two-column megamenu: left = those categories, right = their children (with images).
 * - Torkarblad (Vindrutetorkar system), Oljor och bilvård, Biltillbehör, Verktyg: Standalone menus
 *   with subcategories in a single grid (no left column).
 */

import { ICategoryTreeNode } from "~/api/car.api";
import { IMainMenuLink } from "~/interfaces/main-menu-link";
import { INestedLink } from "~/interfaces/link";

const FALLBACK_IMAGE = "/images/avatars/product.jpg";

/** Root category names that are shown as separate top-level menu items (not under Bildelar) */
const STANDALONE_MENU_NAMES = [
    "Vindrutetorkar system", // Torkarblad
    "Oljor och bilvård",
    "Biltillbehör",
    "Verktyg",
] as const;

function isStandaloneCategory(name: string): boolean {
    return STANDALONE_MENU_NAMES.includes(name as (typeof STANDALONE_MENU_NAMES)[number]);
}

/** Convert API category to INestedLink with full nesting (for Bildelar left column + right column) */
function categoryToNestedLinkBildelar(node: ICategoryTreeNode): INestedLink {
    const url = `/catalog/${node.id}`;
    return {
        title: node.name,
        url,
        customFields: {
            image: node.image || FALLBACK_IMAGE,
        },
        links:
            node.children && node.children.length > 0
                ? node.children.map((child) => categoryToNestedLinkBildelar(child))
                : undefined,
    };
}

/** Convert API category to flat INestedLink (no nested links) for single-column megamenu */
function categoryToFlatLink(node: ICategoryTreeNode): INestedLink {
    return {
        title: node.name,
        url: `/catalog/products?collectionId=${node.id}`,
        customFields: {
            image: node.image || FALLBACK_IMAGE,
        },
        links: undefined,
    };
}

/**
 * Build MENU_CAR_PARTS (Bildelar) megamenu from API tree.
 * Left column = root categories except the 4 standalone; right column = their children.
 */
function buildBildelarMenu(rootCategories: ICategoryTreeNode[]): IMainMenuLink {
    const bildelarCategories = rootCategories.filter((c) => !isStandaloneCategory(c.name));
    const links: INestedLink[] = bildelarCategories.map((cat) => categoryToNestedLinkBildelar(cat));

    return {
        title: "MENU_CAR_PARTS",
        url: "/catalog/products",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links,
                },
            ],
        },
    };
}

/**
 * Build standalone megamenu for Torkarblad, Oljor, Biltillbehör, Verktyg:
 * single grid of direct children (image + label).
 */
function buildStandaloneMenu(
    category: ICategoryTreeNode,
    menuTitleKey: string
): IMainMenuLink {
    const subcategoryLinks: INestedLink[] =
        category.children && category.children.length > 0
            ? category.children.map((child) => categoryToFlatLink(child))
            : [];

    return {
        title: menuTitleKey,
        url: `/catalog/products?collectionId=${category.id}`,
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: subcategoryLinks,
                },
            ],
        },
    };
}

/** Map standalone category name to i18n menu title key */
const STANDALONE_TITLE_KEYS: Record<string, string> = {
    "Vindrutetorkar system": "MENU_WIPER_BLADES",
    "Oljor och bilvård": "MENU_OILS_CAR_CARE",
    "Biltillbehör": "MENU_CAR_ACCESSORIES",
    "Verktyg": "MENU_TOOLS",
};

/**
 * Builds the full header category menu from API category tree.
 * Order: Bildelar, then Torkarblad, Oljor och bilvård, Biltillbehör, Verktyg.
 */
export function buildHeaderCategoryMenuFromTree(
    rootCategories: ICategoryTreeNode[]
): IMainMenuLink[] {
    const result: IMainMenuLink[] = [];

    result.push(buildBildelarMenu(rootCategories));

    for (const name of STANDALONE_MENU_NAMES) {
        const category = rootCategories.find((c) => c.name === name);
        const titleKey = STANDALONE_TITLE_KEYS[name];
        if (category && titleKey) {
            result.push(buildStandaloneMenu(category, titleKey));
        } else if (titleKey) {
            result.push({
                title: titleKey,
                url: "#",
            });
        }
    }

    return result;
}
