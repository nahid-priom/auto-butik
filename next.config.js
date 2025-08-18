// noinspection JSUnusedGlobalSymbols
module.exports = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.BASE_PATH || 'http://localhost:3000',
    },
    i18n: {
        locales: ['en', 'ru', 'ar'],
        defaultLocale: 'en',
    },
};
