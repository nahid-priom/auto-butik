// noinspection JSUnusedGlobalSymbols
module.exports = {
    env: {
        // Replace with your actual API URL
        NEXT_PUBLIC_API_URL: process.env.BASE_PATH || 'https://fa2b9fd9b3e1.ngrok-free.app',
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: '/shop-api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || process.env.BASE_PATH || 'http://localhost:3000'}/shop-api/:path*`,
            },
        ];
    },
    i18n: {
        locales: ['swe', 'en'],
        defaultLocale: 'swe',
        localeDetection: false,
    },
};
