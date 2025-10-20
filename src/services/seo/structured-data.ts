// application
import theme from '~/data/theme';
import { IProduct } from '~/interfaces/product';
import { IShopCategory } from '~/interfaces/category';

/**
 * Organization structured data
 */
export const getOrganizationStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: theme.name,
    url: theme.url,
    logo: `${theme.url}/images/logo.png`,
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: theme.contacts.phone[0],
        contactType: 'Customer Service',
        email: theme.contacts.email[0],
        areaServed: 'SE',
        availableLanguage: ['Swedish', 'English'],
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Stockholm',
        addressCountry: 'SE',
    },
    sameAs: [
        // Add social media links here when available
    ],
});

/**
 * Website structured data
 */
export const getWebsiteStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: theme.name,
    url: theme.url,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${theme.url}/catalog/products?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
});

/**
 * Product structured data
 */
export const getProductStructuredData = (product: IProduct) => {
    const availability = product.stock === 'in-stock'
        ? 'https://schema.org/InStock'
        : product.stock === 'out-of-stock'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/PreOrder';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || product.excerpt,
        sku: product.sku,
        mpn: product.partNumber,
        image: product.images && product.images.length > 0
            ? product.images.map(img => `${theme.url}${img}`)
            : [],
        brand: product.brand ? {
            '@type': 'Brand',
            name: product.brand.name,
        } : undefined,
        offers: {
            '@type': 'Offer',
            url: `${theme.url}/products/${product.slug}`,
            priceCurrency: 'SEK',
            price: product.price,
            availability,
            seller: {
                '@type': 'Organization',
                name: theme.name,
            },
        },
        aggregateRating: product.reviews > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviews,
        } : undefined,
    };
};

/**
 * Breadcrumb structured data
 */
export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${theme.url}${item.url}`,
    })),
});

/**
 * Collection page (Category) structured data
 */
export const getCollectionStructuredData = (category: IShopCategory, products: IProduct[]) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: `Browse our selection of ${category.name}. Quality auto parts with fast delivery.`,
    url: `${theme.url}/catalog/${category.slug}`,
    mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${theme.url}/products/${product.slug}`,
            name: product.name,
        })),
    },
});

/**
 * Article (Blog post) structured data
 */
export const getArticleStructuredData = (article: {
    title: string;
    description: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    url: string;
}) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${theme.url}${article.image}` : undefined,
    author: article.author ? {
        '@type': 'Person',
        name: article.author,
    } : {
        '@type': 'Organization',
        name: theme.name,
    },
    publisher: {
        '@type': 'Organization',
        name: theme.name,
        logo: {
            '@type': 'ImageObject',
            url: `${theme.url}/images/logo.png`,
        },
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url,
    },
});

/**
 * FAQ Page structured data
 */
export const getFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
});

/**
 * Contact Page structured data
 */
export const getContactPageStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    description: 'Get in touch with Autobutik for any questions or support.',
    url: `${theme.url}/contact-us`,
    mainEntity: {
        '@type': 'Organization',
        name: theme.name,
        telephone: theme.contacts.phone[0],
        email: theme.contacts.email[0],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Stockholm',
            addressCountry: 'SE',
        },
    },
});

