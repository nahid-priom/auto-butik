// application
import { ICurrency } from '~/interfaces/currency';

const dataShopCurrencies: ICurrency[] = [
    {
        code: 'SEK',
        symbol: 'kr',
        name: 'Swedish Krona',
        rate: 1,
    },
    {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        rate: 0.095,
    },
    {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        rate: 0.087,
    },
];

const dataShopDefaultCurrencyCode = 'SEK';

export const dataShopDefaultCurrency: ICurrency = dataShopCurrencies.find((x) => (
    x.code === dataShopDefaultCurrencyCode
))!;

export default dataShopCurrencies;
