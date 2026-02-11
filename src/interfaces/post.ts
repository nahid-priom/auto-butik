export interface IPost {
    id: number;
    title: string;
    titleKey?: string; // Translation key for multilingual support
    image: string;
    categories: string[];
    date: string;
    /** Optional excerpt; clamped to 2–3 lines in UI when set */
    excerpt?: string;
}
