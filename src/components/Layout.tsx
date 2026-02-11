// react
import React, { PropsWithChildren, useEffect } from 'react';
// third-party
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
// application
import Footer from '~/components/footer/Footer';
import Header from '~/components/header/Header';
import MobileHeader from '~/components/mobile/MobileHeader';
import MobileMenu from '~/components/mobile/MobileMenu';
import Quickview from '~/components/shared/Quickview';
import TopLoader from '~/components/shared/TopLoader';
import { useOptions } from '~/store/options/optionsHooks';
import { pageLoadStart } from '~/store/page-load/pageLoadActions';
import { loadingTrackerEndRoute, loadingTrackerStartRoute } from '~/store/loading-tracker/loadingTrackerActions';
import { useAppAction } from '~/store/hooks';

interface Props extends PropsWithChildren<{}>{ }

function Layout(props: Props) {
    const { children } = props;
    const router = useRouter();
    const { desktopHeaderLayout, desktopHeaderScheme, mobileHeaderVariant } = useOptions();
    const startPageLoad = useAppAction(pageLoadStart);
    const startRoute = useAppAction(loadingTrackerStartRoute);
    const endRoute = useAppAction(loadingTrackerEndRoute);

    // Global: TopLoader on route transitions (header category clicks, any navigation)
    useEffect(() => {
        const onStart = () => {
            startRoute();
            startPageLoad();
        };
        const onEnd = () => endRoute();
        router.events.on('routeChangeStart', onStart);
        router.events.on('routeChangeComplete', onEnd);
        router.events.on('routeChangeError', onEnd);
        return () => {
            router.events.off('routeChangeStart', onStart);
            router.events.off('routeChangeComplete', onEnd);
            router.events.off('routeChangeError', onEnd);
        };
    }, [router.events, startRoute, endRoute, startPageLoad]);

    // Start top loader immediately on homepage so it shows before index useEffect runs
    useEffect(() => {
        if (router.pathname === '/') {
            startPageLoad();
        }
    }, [router.pathname, startPageLoad]);
    const desktopVariantClass = `${desktopHeaderLayout}-${desktopHeaderScheme}`;
    const mobileVariantClass = `mobile-${mobileHeaderVariant}`;

    const classes = classNames(
        'site',
        `site--desktop-header--${desktopVariantClass}`,
        `site--mobile-header--${mobileVariantClass}`,
    );

    return (
        <div className={classes}>
            <TopLoader />
            <ToastContainer autoClose={5000} hideProgressBar />

            <div className="site__container">
                <header className="site__mobile-header">
                    <MobileHeader />
                </header>

                <header className="site__header">
                    <Header />
                </header>

                <div className="site__body">
                    {children}
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>

            <MobileMenu />

            <Quickview />
        </div>
    );
}

export default Layout;
