// react
import React, { useMemo } from 'react';
// third-party
import { useIntl } from 'react-intl';
// application
import BlockBanners from '~/components/blocks/BlockBanners';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockCategories from '~/components/blocks/BlockCategories';
import BlockFeatures from '~/components/blocks/BlockFeatures';
import BlockPosts from '~/components/blocks/BlockPosts';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import BlockProductsColumns from '~/components/blocks/BlockProductsColumns';
import BlockSale from '~/components/blocks/BlockSale';
import BlockSlideshow from '~/components/blocks/BlockSlideshow';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockVehicleSearchHero from '~/components/blocks/BlockVehicleSearchHero';
import SEO from '~/components/shared/SEO';
import url from '~/services/url';
import { AppDispatch } from '~/store/types';
import { optionsSetAll } from '~/store/options/optionsActions';
import { shopApi, blogApi } from '~/api';
import { useDeferredData, useProductColumns, useProductTabs } from '~/services/hooks';
import { wrapper } from '~/store/store';
import { getOrganizationStructuredData, getWebsiteStructuredData } from '~/services/seo/structured-data';

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

    const slides = useMemo(() => [
        {
            url: '/catalog/products',
            desktopImage: '/images/banner web/banner1.png',
            mobileImage: '/images/banner app/1.png',
            title: intl.formatMessage({ id: 'SLIDE_1_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_1_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/banner web/banner2.png',
            mobileImage: '/images/banner app/2.png',
            title: intl.formatMessage({ id: 'SLIDE_2_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_2_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/banner web/banner3.png',
            mobileImage: '/images/banner app/3.png',
            title: intl.formatMessage({ id: 'SLIDE_3_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_3_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
        {
            url: '/catalog/products',
            desktopImage: '/images/banner web/banner4.png',
            mobileImage: '/images/banner app/4.png',
            title: intl.formatMessage({ id: 'SLIDE_4_TITLE' }),
            details: intl.formatMessage({ id: 'SLIDE_4_DETAILS' }),
            buttonLabel: intl.formatMessage({ id: 'BUTTON_SHOP_NOW' }),
        },
    ], [intl]);

    const brands = useDeferredData(() => shopApi.getBrands({ limit: 48 }), []);

    const popularCategories = useDeferredData(() => shopApi.getCategories({
        slugs: [
            'headlights-lighting',
            'fuel-system',
            'body-parts',
            'interior-parts',
            'tires-wheels',
            'engine-drivetrain',
        ],
        depth: 1,
    }), []);

    /**
     * Featured products.
     */
    const featuredProducts = useProductTabs(
        useMemo(() => [
            { id: 1, name: intl.formatMessage({ id: 'TAB_ALL' }), categorySlug: null },
            { id: 2, name: intl.formatMessage({ id: 'TAB_POWER_TOOLS' }), categorySlug: 'power-tools' },
            { id: 3, name: intl.formatMessage({ id: 'TAB_HAND_TOOLS' }), categorySlug: 'hand-tools' },
            { id: 4, name: intl.formatMessage({ id: 'TAB_PLUMBING' }), categorySlug: 'plumbing' },
        ], [intl]),
        (tab) => shopApi.getFeaturedProducts(tab.categorySlug, 8),
    );

    const blockSale = useDeferredData(() => shopApi.getSpecialOffers(8), []);

    const latestPosts = useDeferredData(() => blogApi.getLatestPosts(8), []);
    const latestPostsLinks = useMemo(() => [
        { title: intl.formatMessage({ id: 'LINK_SPECIAL_OFFERS' }), url: url.blog() },
        { title: intl.formatMessage({ id: 'LINK_NEW_ARRIVALS' }), url: url.blog() },
        { title: intl.formatMessage({ id: 'LINK_REVIEWS' }), url: url.blog() },
    ], [intl]);

    /**
     * Product columns.
     */
    const columns = useProductColumns(
        useMemo(() => [
            {
                title: intl.formatMessage({ id: 'HEADER_TOP_RATED_PRODUCTS' }),
                source: () => shopApi.getTopRatedProducts(null, 3),
            },
            {
                title: intl.formatMessage({ id: 'LINK_SPECIAL_OFFERS' }),
                source: () => shopApi.getSpecialOffers(3),
            },
            {
                title: intl.formatMessage({ id: 'HEADER_BESTSELLERS' }),
                source: () => shopApi.getPopularProducts(null, 3),
            },
        ], [intl]),
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
            <BlockSpace layout="divider-xs" />
            <BlockSlideshow slides={slides} />
            <BlockSpace layout="divider-nl" />
            <BlockBrands
                layout="columns-8-full"
                brands={brands.data}
            />
            <BlockSpace layout="divider-nl" />
            <BlockCategories
                blockTitle={intl.formatMessage({ id: 'HEADER_POPULAR_CATEGORIES' })}
                categories={popularCategories.data}
            />
            <BlockSpace layout="divider-nl" />
            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_FEATURED_PRODUCTS' })}
                layout="grid-5"
                loading={featuredProducts.isLoading}
                products={featuredProducts.data}
                groups={featuredProducts.tabs}
                currentGroup={featuredProducts.tabs.find((x) => x.current)}
                onChangeGroup={featuredProducts.handleTabChange}
            />
            <BlockSpace layout="divider-nl" />
            <BlockBanners />
            <BlockSpace layout="divider-nl" />
            <BlockSale
                products={blockSale.data}
                loading={blockSale.isLoading}
            />
            <BlockSpace layout="divider-nl" />
            <BlockPosts
                blockTitle={intl.formatMessage({ id: 'HEADER_LATEST_NEWS' })}
                layout="list"
                loading={latestPosts.isLoading}
                posts={latestPosts.data}
                links={latestPostsLinks}
            />
            <BlockSpace layout="divider-nl" className="d-xl-block d-none" />
            <BlockProductsColumns columns={columns} />
            <BlockSpace layout="divider-nl" />
            <BlockFeatures layout="bottom-strip" />
        </React.Fragment>
    );
}

export default Page;