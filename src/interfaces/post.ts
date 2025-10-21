export interface IPost {
    id: number;
    title: string;
    titleKey?: string; // Translation key for multilingual support
    image: string;
    categories: string[];
    date: string;
}
