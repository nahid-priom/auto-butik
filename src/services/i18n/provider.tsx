// react
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
} from 'react';
// third-party
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
// application
import GlobalIntlProvider from '~/services/i18n/global-intl';
import { ILanguage } from '~/interfaces/language';
import { LanguageLocaleContext, LanguageSetLocaleContext } from '~/services/i18n/context';
import {
    getDefaultLanguage,
    getDefaultLocale,
    getLanguageByLocale,
    loadMessages,
} from '~/services/i18n/utils';

export interface ILanguageProviderProps {
    messages: Record<string, string>;
}

const cache: Record<string, Promise<Record<string, string>>> = {};

export async function getLanguageInitialProps(language: ILanguage | null): Promise<ILanguageProviderProps> {
    const locale = language ? language.locale : getDefaultLocale();

    if (typeof window !== 'undefined') {
        if (!cache[locale]) {
            cache[locale] = loadMessages(locale);
        }

        return { messages: await cache[locale] };
    }

    return {
        messages: await loadMessages(locale),
    };
}

function LanguageProvider(props: PropsWithChildren<ILanguageProviderProps>) {
    const { children, messages } = props;
    const router = useRouter();
    const language = getLanguageByLocale(router.locale!) || getDefaultLanguage();
    const { locale } = language;

    // Puts the initial translation into the cache.
    useEffect(() => {
        if (!cache[locale]) {
            cache[locale] = Promise.resolve(messages);
        }
    }, [locale, messages]);

    const setLocale = useCallback((newLocale: string) => {
        setTimeout(() => {
            router.push(router.asPath, undefined, { locale: newLocale }).then(() => {
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            });
        }, 0);
    }, [router]);

    useEffect(() => {
        document.documentElement.lang = language.locale;
        document.documentElement.dir = language.direction;
    }, [language]);

    // Suppress MISSING_TRANSLATION in production; in dev do not throw so UI keeps working (see doc/i18n/README.md)
    const handleIntlError = useCallback((err: { code?: string }) => {
        if (err?.code === 'MISSING_TRANSLATION') {
            return;
        }
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            throw err;
        }
    }, []);

    return (
        <LanguageLocaleContext.Provider value={locale}>
            <LanguageSetLocaleContext.Provider value={setLocale}>
                <IntlProvider locale={locale} messages={messages} onError={handleIntlError}>
                    <GlobalIntlProvider>
                        {children}
                    </GlobalIntlProvider>
                </IntlProvider>
            </LanguageSetLocaleContext.Provider>
        </LanguageLocaleContext.Provider>
    );
}

export default LanguageProvider;
