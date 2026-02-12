/**
 * Builds header category menu (megamenu) from catalog_tree.json.
 *
 * Structure:
 * - Bildelar (MENU_CAR_PARTS): All categories with parentId 9588 EXCEPT 9603, 9604, 9605, 9606.
 * - Torkarblad (9603), Oljor och bilvård (9604), Biltillbehör (9605), Verktyg (9606): Standalone menus with subcategories from catalog.
 */

import catalogTreeData from "./catalog_tree.json";
import { IMainMenuLink } from "~/interfaces/main-menu-link";
import { INestedLink } from "~/interfaces/link";

const BILDELAR_PARENT_ID = 9588;
const EXCLUDED_FROM_BILDELAR = [9603, 9604, 9605, 9606]; // Torkarblad, Oljor och bilvård, Biltillbehör, Verktyg

const FALLBACK_IMAGE = "/images/avatars/product.jpg";

interface CatalogCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    tecdocNodeId: string;
    tecdocPath: string;
    image: string | null;
    productCount: number;
    parentId: number;
    children: CatalogCategory[];
    hasChildren?: boolean;
}

interface CatalogTreeResponse {
    success: boolean;
    categories: CatalogCategory[];
}

const catalogTree = catalogTreeData as CatalogTreeResponse;
const allCategories = catalogTree.categories || [];

function categoryToNestedLink(cat: CatalogCategory): INestedLink {
    const url = `/catalog/products?collectionId=${cat.id}`;
    return {
        title: cat.name,
        url,
        customFields: {
            image: cat.image || FALLBACK_IMAGE,
        },
        links:
            cat.children && cat.children.length > 0
                ? cat.children.map((child) => categoryToNestedLink(child))
                : undefined,
    };
}

/** Same as categoryToNestedLink but URL is /catalog/{id} (category page) for Bildelar only */
function categoryToNestedLinkBildelar(cat: CatalogCategory): INestedLink {
    const url = `/catalog/${cat.id}`;
    return {
        title: cat.name,
        url,
        customFields: {
            image: cat.image || FALLBACK_IMAGE,
        },
        links:
            cat.children && cat.children.length > 0
                ? cat.children.map((child) => categoryToNestedLinkBildelar(child))
                : undefined,
    };
}

/** Categories under Bildelar: parentId 9588, exclude 9603, 9604, 9605, 9606 */
function getBildelarCategories(): CatalogCategory[] {
    return allCategories.filter(
        (c) =>
            c.parentId === BILDELAR_PARENT_ID &&
            !EXCLUDED_FROM_BILDELAR.includes(c.id)
    );
}

function findCategoryById(id: number): CatalogCategory | undefined {
    return allCategories.find((c) => c.id === id);
}

/** Build MENU_CAR_PARTS (Bildelar) megamenu from catalog; links go to /catalog/{id} (category page), not products */
function buildBildelarMenu(): IMainMenuLink {
    const categories = getBildelarCategories();
    const links: INestedLink[] = categories.map((cat) => categoryToNestedLinkBildelar(cat));

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

/** Subcategory as flat link (no nested links) for single-column megamenu */
function categoryToFlatLink(cat: CatalogCategory): INestedLink {
    return {
        title: cat.name,
        url: `/catalog/products?collectionId=${cat.id}`,
        customFields: {
            image: cat.image || FALLBACK_IMAGE,
        },
        links: undefined,
    };
}

/** Build standalone megamenu for Torkarblad, Oljor, Biltillbehör, Verktyg: show only subcategories in a grid (no left category row) */
function buildStandaloneCategoryMenu(
    categoryId: number,
    menuTitleKey: string
): IMainMenuLink {
    const category = findCategoryById(categoryId);
    if (!category) {
        return {
            title: menuTitleKey,
            url: `/catalog/products?collectionId=${categoryId}`,
        };
    }

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

/**
 * Builds the full header category menu from catalog_tree.json.
 * Keeps menu title keys (MENU_CAR_PARTS, MENU_WIPER_BLADES, etc.) for i18n and BlockCategoryTabs.
 */
export function buildHeaderCategoryMenuFromCatalog(): IMainMenuLink[] {
    return [
        buildBildelarMenu(),
        buildStandaloneCategoryMenu(9603, "MENU_WIPER_BLADES"),   // Torkarblad
        buildStandaloneCategoryMenu(9604, "MENU_OILS_CAR_CARE"),   // Oljor och bilvård
        buildStandaloneCategoryMenu(9605, "MENU_CAR_ACCESSORIES"),  // Biltillbehör
        buildStandaloneCategoryMenu(9606, "MENU_TOOLS"),            // Verktyg
    ];
}
