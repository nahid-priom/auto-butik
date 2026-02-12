// react
import React, { useEffect, useMemo } from 'react';
// third-party
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
// application
import { fetchBrandsIfNeeded } from '~/store/homepage/homepageActions';
import { pageLoadStart } from '~/store/page-load/pageLoadActions';
import { useAppAction } from '~/store/hooks';
import BlockVehicleSearchHero from '~/components/blocks/BlockVehicleSearchHero';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockSkeleton from '~/components/shared/BlockSkeleton';
import LazySection from '~/components/shared/LazySection';
import SEO from '~/components/shared/SEO';

const BlockCategoryNavigation = dynamic(
    () => import('~/components/blocks/BlockCategoryNavigation'),
    { loading: () => <BlockSkeleton minHeight={140} />, ssr: false }
);
const BlockBanners = dynamic(
    () => import('~/components/blocks/BlockBanners'),
    { loading: () => <BlockSkeleton minHeight={120} />, ssr: false }
);
const BlockCategoryTabs = dynamic(
    () => import('~/components/blocks/BlockCategoryTabs'),
    { loading: () => <BlockSkeleton minHeight={220} />, ssr: false }
);
const BlockSlideshow = dynamic(
    () => import('~/components/blocks/BlockSlideshow'),
    { loading: () => <BlockSkeleton minHeight={320} />, ssr: false }
);
const BlockProductsCarousel = dynamic(
    () => import('~/components/blocks/BlockProductsCarousel'),
    { loading: () => <BlockSkeleton minHeight={280} />, ssr: false }
);
const BlockBenefits = dynamic(
    () => import('~/components/blocks/BlockBenefits'),
    { loading: () => <BlockSkeleton minHeight={160} />, ssr: false }
);
const BlockSale = dynamic(
    () => import('~/components/blocks/BlockSale'),
    { loading: () => <BlockSkeleton minHeight={340} />, ssr: false }
);
const BlockPosts = dynamic(
    () => import('~/components/blocks/BlockPosts'),
    { loading: () => <BlockSkeleton minHeight={300} />, ssr: false }
);
const BlockProductsColumns = dynamic(
    () => import('~/components/blocks/BlockProductsColumns'),
    { loading: () => <BlockSkeleton minHeight={200} />, ssr: false }
);
const BlockBrands = dynamic(
    () => import('~/components/blocks/BlockBrands'),
    { loading: () => <BlockSkeleton minHeight={180} />, ssr: false }
);
const BlockNewsletter = dynamic(
    () => import('~/components/blocks/BlockNewsletter'),
    { loading: () => <BlockSkeleton minHeight={200} />, ssr: false }
);
import url from '~/services/url';
import { AppDispatch } from '~/store/types';
import { optionsSetAll } from '~/store/options/optionsActions';
import { shopApi, blogApi } from '~/api';
import { useDeferredData, useProductColumns } from '~/services/hooks';
import { wrapper } from '~/store/store';
import { getOrganizationStructuredData, getWebsiteStructuredData } from '~/services/seo/structured-data';
import { getFeaturedProducts } from '~/data/featuredProducts';

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
    const dispatch = store.dispatch as AppDispatch;

    await dispatch(optionsSetAll({
        desktopHeaderVariant: 'classic/one',
        mobileHeaderVariant: 'one',
    }));

    return { props: {} };
});

function Page() {
    const intl = useIntl();
    const fetchBrands = useAppAction(fetchBrandsIfNeeded);
    const startPageLoad = useAppAction(pageLoadStart);

    useEffect(() => {
        startPageLoad();
        fetchBrands(true);
    }, [startPageLoad, fetchBrands]);

    const slides = useMemo(() => [
        {
            url: '/catalog/products',
            desktopImage: '/images/Hero1.webp',
            mobileImage: '/images/Hero1.webp',
            title: intl.formatMessage({ id: 'SLIDE_1_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_1_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/Hero2.webp',
            mobileImage: '/images/Hero2.webp',
            title: intl.formatMessage({ id: 'SLIDE_2_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_2_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/Hero3.webp',
            mobileImage: '/images/Hero3.webp',
            title: intl.formatMessage({ id: 'SLIDE_3_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_3_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/Hero4.webp',
            mobileImage: '/images/Hero4.webp',
            title: intl.formatMessage({ id: 'SLIDE_4_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_4_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
    ], [intl]);

    const brands = useDeferredData(() => shopApi.getBrands({ limit: 48 }), []);
    const blockSale = useDeferredData(() => shopApi.getSpecialOffers(8), []);

    /**
     * Featured products (static list).
     */
    const featuredProducts = useMemo(() => ({
        data: getFeaturedProducts(),
        isLoading: false,
    }), []);


    const latestPosts = useDeferredData(() => blogApi.getLatestPosts(12), []);
    const latestPostsLinks = useMemo(() => [
        { title: intl.formatMessage({ id: 'LINK_SPECIAL_OFFERS' }), url: url.blog() },
        { title: intl.formatMessage({ id: 'LINK_NEW_ARRIVALS' }), url: url.blog() },
        { title: intl.formatMessage({ id: 'LINK_REVIEWS' }), url: url.blog() },
    ], [intl]);

    const newsTabGroups = useMemo(
        () => [
            { id: 'special', name: intl.formatMessage({ id: 'LINK_SPECIAL_OFFERS' }) },
            { id: 'news', name: intl.formatMessage({ id: 'LINK_NEW_ARRIVALS' }) },
            { id: 'reviews', name: intl.formatMessage({ id: 'LINK_REVIEWS' }) },
        ],
        [intl],
    );

    /**
     * Product columns (top rated, special offers, bestsellers).
     */
    const productColumnsResult = useProductColumns(
        useMemo(
            () => [
                {
                    title: intl.formatMessage({ id: 'HEADER_TOP_RATED_PRODUCTS' }),
                    source: () => shopApi.getTopRatedProducts(null, 6),
                },
                {
                    title: intl.formatMessage({ id: 'LINK_SPECIAL_OFFERS' }),
                    source: () => shopApi.getSpecialOffers(6),
                },
                {
                    title: intl.formatMessage({ id: 'HEADER_BESTSELLERS' }),
                    source: () => shopApi.getPopularProducts(null, 6),
                },
            ],
            [intl],
        ),
    );

    // Structured data for homepage
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            getOrganizationStructuredData(),
            getWebsiteStructuredData(),
        ],
    };

    return (
        <React.Fragment>
            <SEO
                title="Quality Auto Parts For Every Vehicle"
                description="Find quality auto parts for all vehicle makes and models. Fast delivery, competitive prices, and expert service. Shop brake pads, filters, engine parts, and more."
                keywords="auto parts, car parts, vehicle parts, automotive parts, spare parts, car accessories, brake pads, filters, engine parts, suspension parts, online auto shop Sweden"
                type="website"
                structuredData={structuredData}
            />
            <BlockVehicleSearchHero />
            <LazySection minHeight={140}>
                <BlockCategoryNavigation />
            </LazySection>
            <LazySection minHeight={120}>
                <BlockBanners />
            </LazySection>
            <LazySection minHeight={220}>
                <BlockCategoryTabs />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={320}>
                <BlockSlideshow slides={slides} />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_FEATURED_PRODUCTS' })}
                layout="grid-5"
                loading={featuredProducts.isLoading}
                products={featuredProducts.data}
            />
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={160}>
                <BlockBenefits />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={340}>
                <BlockSale products={blockSale.data} loading={blockSale.isLoading} showHeader={false} />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={300}>
                <BlockPosts
                    blockTitle={intl.formatMessage({ id: 'HEADER_LATEST_NEWS' })}
                    layout="list"
                    loading={latestPosts.isLoading}
                    posts={latestPosts.data}
                    error={latestPosts.error}
                    retry={latestPosts.retry}
                    tabGroups={newsTabGroups}
                    defaultTabId="special"
                    links={latestPostsLinks}
                />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={200}>
                <BlockProductsColumns
                    columns={productColumnsResult.columns}
                    loading={productColumnsResult.isLoading}
                    error={productColumnsResult.error}
                    retry={productColumnsResult.retry}
                />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={180}>
                <BlockBrands
                    blockTitle={intl.formatMessage({ id: 'HEADER_POPULAR_MANUFACTURERS' })}
                    layout="columns-8-full"
                    brands={brands.data}
                />
            </LazySection>
            <BlockSpace layout="divider-nl" />
            <LazySection minHeight={200}>
                <BlockNewsletter />
            </LazySection>
        </React.Fragment>
    );
}

export default Page;