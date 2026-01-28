import { IVehicleCategory } from '~/api/car.api';
import { ILink } from '~/interfaces/link';

/**
 * Build breadcrumb path for a category by traversing up the parent chain
 * @param allCategories - All categories from the API (flat list)
 * @param currentCategory - The current category to build path for
 * @returns Array of breadcrumb items from root to current category
 */
export function buildCategoryBreadcrumb(
    allCategories: IVehicleCategory[],
    currentCategory: IVehicleCategory
): ILink[] {
    const categoryMap = new Map<string, IVehicleCategory>();
    allCategories.forEach(cat => {
        categoryMap.set(cat.id, cat);
    });

    const breadcrumb: ILink[] = [];
    let current: IVehicleCategory | undefined = currentCategory;

    // Traverse up the parent chain
    const visited = new Set<string>();
    while (current && !visited.has(current.id)) {
        visited.add(current.id);
        
        // Add current category to breadcrumb (will be reversed later)
        breadcrumb.push({
            title: current.name,
            url: current.hasChildren 
                ? `/catalog/${current.slug}` 
                : `/catalog/${current.slug}/products`,
        });

        // Move to parent
        // parentId is string | null, and root categories have parentId = "1" or null
        if (current.parentId && current.parentId !== '1' && current.parentId !== 'null') {
            current = categoryMap.get(current.parentId);
        } else {
            break; // Reached root (parentId = "1" or null)
        }
    }

    // Reverse to get root -> current order
    return breadcrumb.reverse();
}
