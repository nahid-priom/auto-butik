// application
import { ILanguage } from '~/interfaces/language';

const dataShopLanguages: ILanguage[] = [
    {
        locale: 'swe',
        code: 'swe',
        name: 'Svenska',
        icon: '/images/languages/language-swe.png',
        direction: 'ltr',
    },
    {
        locale: 'en',
        code: 'en',
        name: 'English',
        icon: '/images/languages/language-1.png',
        direction: 'ltr',
    },
];

export const dataShopDefaultLocale = 'swe';

export default dataShopLanguages;
