// react
import React, { ComponentType, useEffect, useMemo } from 'react';
// third-party
import AppBase, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { NextComponentType, NextPageContext } from 'next';
import { useStore } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
// application
import { AuthProvider } from '~/contexts/AuthContext';
import { graphqlClient } from '~/api/graphql/account.api';
// application
import config from '~/config';
import LanguageProvider, { getLanguageInitialProps, ILanguageProviderProps } from '~/services/i18n/provider';
import Layout from '~/components/Layout';
import PageTitle from '~/components/shared/PageTitle';
import { AppDispatch } from '~/store/types';
import { CurrentVehicleGarageProvider } from '~/services/current-vehicle';
import { getLanguageByLocale } from '~/services/i18n/utils';
import { load, save, wrapper } from '~/store/store';
import { optionsSetAll } from '~/store/options/optionsActions';
import { useApplyClientState } from '~/store/client';
import { useLoadUserVehicles } from '~/store/garage/garageHooks';
// styles
import '../scss/index.scss';
import '../scss/style.header-spaceship-variant-one.scss';
import '../scss/style.header-spaceship-variant-two.scss';
import '../scss/style.header-spaceship-variant-three.scss';
import '../scss/style.header-classic-variant-one.scss';
import '../scss/style.header-classic-variant-two.scss';
import '../scss/style.header-classic-variant-three.scss';
import '../scss/style.header-classic-variant-four.scss';
import '../scss/style.header-classic-variant-five.scss';
import '../scss/style.mobile-header-variant-one.scss';
import '../scss/style.mobile-header-variant-two.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Props extends AppProps {
    languageInitialProps: ILanguageProviderProps;
    Component: NextComponentType<NextPageContext, any> & {
        Layout: ComponentType,
    }
}

function App(props: Props) {
    const { Component, pageProps, languageInitialProps } = props;
    const store = useStore();
    const applyClientState = useApplyClientState();
    const loadUserVehicles = useLoadUserVehicles();

    // Loading and saving state on the client side (cart, wishlist, etc.).
    useEffect(() => {
        const state = load();

        applyClientState(state || {});

        if (process.browser) {
            store.subscribe(() => {
                save(store.getState());
            });
        }
    }, [store, applyClientState]);

    // Load user vehicles
    useEffect(() => {
        loadUserVehicles().then();
    }, [loadUserVehicles]);

    // preloader
    useEffect(() => {
        const preloader = document.querySelector('.site-preloader');

        if (!preloader) {
            return;
        }

        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 100);
    }, []);

    const page = useMemo(() => {
        const PageLayout = Component.Layout || React.Fragment;

        return (
            <PageLayout>
                <Component {...pageProps} />
            </PageLayout>
        );
    }, [Component, pageProps]);

    // noinspection HtmlRequiredTitleElement
    return (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ApolloProvider client={graphqlClient}>
                <LanguageProvider {...languageInitialProps}>
                    <AuthProvider>
                        <CurrentVehicleGarageProvider>
                            <Layout>
                                <PageTitle />
                                {page}
                            </Layout>
                        </CurrentVehicleGarageProvider>
                    </AuthProvider>
                </LanguageProvider>
            </ApolloProvider>
        </React.Fragment>
    );
}

App.getInitialProps = wrapper.getInitialAppProps((store) => async (context: AppContext) => {
    const dispatch = store.dispatch as AppDispatch;

    await dispatch(optionsSetAll({
        desktopHeaderVariant: config.desktopHeaderVariant,
        mobileHeaderVariant: config.mobileHeaderVariant,
    }));

    const language = getLanguageByLocale(context.router.locale!);

    return {
        ...(await AppBase.getInitialProps(context)),
        languageInitialProps: await getLanguageInitialProps(language),
    };
});

const WrappedApp = wrapper.withRedux(App);

// noinspection JSUnusedGlobalSymbols
export default WrappedApp;
