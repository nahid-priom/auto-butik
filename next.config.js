// noinspection JSUnusedGlobalSymbols
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BASE_PATH || 'http://localhost:3000';

module.exports = {
    env: {
        // Expose backend URL to client-side code
        NEXT_PUBLIC_API_URL: BACKEND_URL,
        NEXT_PUBLIC_BACKEND_URL: BACKEND_URL,
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
                destination: `${BACKEND_URL}/shop-api/:path*`,
            },
        ];
    },
    i18n: {
        locales: ['swe', 'en'],
        defaultLocale: 'swe',
        localeDetection: false,
    },
};
