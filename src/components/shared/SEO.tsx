// react
import React from 'react';
// third-party
import Head from 'next/head';
import { useRouter } from 'next/router';
// application
import theme from '~/data/theme';

export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    price?: number;
    currency?: string;
    availability?: 'in stock' | 'out of stock' | 'preorder';
    brand?: string;
    noindex?: boolean;
    structuredData?: object;
}

function SEO(props: SEOProps) {
    const {
        title,
        description,
        keywords,
        image,
        url,
        type = 'website',
        author,
        publishedTime,
        modifiedTime,
        price,
        currency = 'SEK',
        availability,
        brand,
        noindex = false,
        structuredData,
    } = props;

    const router = useRouter();
    const currentUrl = url || `${theme.url}${router.asPath}`;
    const siteTitle = theme.name;
    
    // Build full title
    const fullTitle = title ? `${title} — ${siteTitle}` : siteTitle;
    
    // Default description
    const defaultDescription = 'Autobutik - Your trusted source for quality auto parts. Fast delivery, competitive prices, and expert service for all your vehicle needs.';
    const metaDescription = description || defaultDescription;
    
    // Default image
    const defaultImage = `${theme.url}/images/og-image.jpg`;
    const metaImage = image || defaultImage;

    // Default keywords
    const defaultKeywords = 'auto parts, car parts, vehicle parts, automotive parts, spare parts, car accessories, online auto shop';
    const metaKeywords = keywords || defaultKeywords;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            {author && <meta name="author" content={author} />}
            
            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
            
            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="sv_SE" />
            
            {/* Article specific */}
            {type === 'article' && (
                <>
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
                    {author && <meta property="article:author" content={author} />}
                </>
            )}
            
            {/* Product specific */}
            {type === 'product' && (
                <>
                    {price && <meta property="product:price:amount" content={price.toString()} />}
                    {currency && <meta property="product:price:currency" content={currency} />}
                    {availability && <meta property="product:availability" content={availability} />}
                    {brand && <meta property="product:brand" content={brand} />}
                </>
            )}
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            
            {/* Additional Meta Tags */}
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#e52727" />
            
            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
        </Head>
    );
}

export default SEO;

