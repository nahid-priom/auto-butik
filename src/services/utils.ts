// application
import { IBaseCategory, ICategory } from '~/interfaces/category';
import { INavigation } from '~/interfaces/list';

export function baseUrl(url: string): string {
    if (/^\/([^/]|$)/.test(url)) {
        // Next.js exposes basePath to the app via process.env.basePath when configured.
        // Avoid using generic envs like BASE_PATH which may point to an API host.
        const basePath = process.env.basePath || '';
        const fullPath = `${basePath}${url}`;
        // Encode spaces and other unsafe characters while preserving URL structure
        return encodeURI(fullPath);
    }

    return url;
}

export function getCategoryPath<T extends IBaseCategory>(category: T | null | undefined): T[] {
    return category ? [...getCategoryPath(category.parent), category] : [];
}

export function getCategoryParents(category: ICategory): ICategory[] {
    return category.parent ? [...getCategoryParents(category.parent), category.parent] : [];
}

export function isArrayOfStrings(value: any): value is string[] {
    if (!Array.isArray(value)) {
        return false;
    }

    return !value.map((x) => typeof x !== 'string').includes(true);
}

export function isArrayOfNumbers(value: any): value is number[] {
    if (!Array.isArray(value)) {
        return false;
    }

    return !value.map((x) => typeof x !== 'number').includes(true);
}

export function isEmptyList(navigation: INavigation): boolean {
    return (
        // Page based navigation
        (navigation.type === 'page' && navigation.total === 0)
        // Cursor based navigation
        || (navigation.type === 'cursor' && navigation.startCursor === null && navigation.endCursor === null)
    );
}
