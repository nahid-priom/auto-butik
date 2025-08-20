// noinspection JSUnusedGlobalSymbols
module.exports = {
    env: {
        // Replace with your actual API URL
        NEXT_PUBLIC_API_URL: process.env.BASE_PATH || 'https://fa2b9fd9b3e1.ngrok-free.app',
    },
    i18n: {
        locales: ['swe', 'en'],
        defaultLocale: 'swe',
        localeDetection: false,
    },
};
