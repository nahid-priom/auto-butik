// Helper function to get translation key from category slug
export function getCategoryTranslationKey(slug: string): string {
    // Convert slug to uppercase and replace hyphens with underscores
    // e.g., 'headlights-lighting' => 'CATEGORY_HEADLIGHTS_LIGHTING'
    return `CATEGORY_${slug.toUpperCase().replace(/-/g, '_')}`;
}

