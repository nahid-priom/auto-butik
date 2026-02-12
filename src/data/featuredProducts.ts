/**
 * Shared featured/related products data.
 * Used on homepage (featured) and product page (related products).
 */
import { IProduct } from '~/interfaces/product';

export interface FeaturedProductRaw {
    productId: number;
    productName: string;
    slug: string;
    description: string;
    sku: string;
    tecDoc: string;
    icIndex: string;
    price: number;
    currencyCode: string;
    imagePreview: string;
}

export const FEATURED_PRODUCTS_RAW: FeaturedProductRaw[] = [
    {
        productId: 165505,
        productName: 'Kabelreparationssats, torkarmotor',
        slug: '50390266-kabelreparationssats-torkarmotor',
        description: 'Kabelreparationssats, torkarmotor',
        sku: '50390266',
        tecDoc: '50390266',
        icIndex: '50390266',
        price: 8899,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/50390266_A.JPG',
    },
    {
        productId: 554465,
        productName: 'Laddluftslang',
        slug: 'gat09-1374-laddluftslang',
        description: 'Laddluftslang',
        sku: 'GAT09-1374',
        tecDoc: '09-1374',
        icIndex: 'GAT09-1374',
        price: 121549,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/09-1374-1_ANG_A.JPG',
    },
    {
        productId: 554473,
        productName: 'Laddluftslang',
        slug: 'gat09-1385-laddluftslang',
        description: 'Laddluftslang',
        sku: 'GAT09-1385',
        tecDoc: '09-1385',
        icIndex: 'GAT09-1385',
        price: 59350,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/09-1385-1_ANG_A.JPG',
    },
    {
        productId: 451647,
        productName: 'Packning, avgasrör',
        slug: 'el737660-packning-avgasror',
        description: 'Packning, avgasrör',
        sku: 'EL737660',
        tecDoc: '737.660',
        icIndex: 'EL737660',
        price: 12499,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/07376600EZ9999_00.JPG',
    },
    {
        productId: 167166,
        productName: 'Kabelreparationssats, blinklykta',
        slug: '51277249-kabelreparationssats-blinklykta',
        description: 'Kabelreparationssats, blinklykta',
        sku: '51277249',
        tecDoc: '51277249',
        icIndex: '51277249',
        price: 13599,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/51277249.JPG',
    },
    {
        productId: 2349,
        productName: 'Lambdasond',
        slug: '0-258-030-0bv-lambdasond',
        description: 'Lambdasond',
        sku: '0 258 030 0BV',
        tecDoc: '0 258 030 0BV',
        icIndex: '0 258 030 0BV',
        price: 84749,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/02580300BVPH01WHCO0000.JPG',
    },
    {
        productId: 2287,
        productName: 'Lambdasond',
        slug: '0-258-027-083-lambdasond',
        description: 'Lambdasond',
        sku: '0 258 027 083',
        tecDoc: '0 258 027 083',
        icIndex: '0 258 027 083',
        price: 106199,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/0258027083PH01WHCO0000.JPG',
    },
    {
        productId: 251774,
        productName: 'Lambdasond',
        slug: '70685111-lambdasond',
        description: 'Lambdasond',
        sku: '70685111',
        tecDoc: '70685111',
        icIndex: '70685111',
        price: 95249,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/70685111.JPG',
    },
    {
        productId: 251767,
        productName: 'Lambdasond',
        slug: '70685104-lambdasond',
        description: 'Lambdasond',
        sku: '70685104',
        tecDoc: '70685104',
        icIndex: '70685104',
        price: 84695,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/70685104.JPG',
    },
    {
        productId: 178243,
        productName: 'Rep.sats, tryckledning (sot-/partikelfilter)',
        slug: '54271045-repsats-tryckledning-sot-partikelfilter',
        description: 'Rep.sats, tryckledning (sot-/partikelfilter)',
        sku: '54271045',
        tecDoc: '54271045',
        icIndex: '54271045',
        price: 72799,
        currencyCode: 'USD',
        imagePreview: 'https://autobutik-assets-prod.s3.eu-north-1.amazonaws.com/tecdoc-images/PIC_FILES/54271045.JPG',
    },
];

function featuredProductToIProduct(p: FeaturedProductRaw, index: number): IProduct {
    const images = p.imagePreview ? [p.imagePreview] : ['/images/products/product-placeholder.jpg'];
    return {
        id: p.productId,
        name: p.productName,
        excerpt: p.description || p.productName,
        description: p.description || p.productName,
        slug: p.slug,
        sku: p.sku,
        partNumber: p.sku,
        stock: 'in-stock',
        price: p.price,
        compareAtPrice: null,
        images,
        badges: [],
        rating: 5,
        reviews: 0,
        availability: 'in-stock',
        compatibility: 'all',
        brand: null,
        tags: [],
        type: { name: 'Auto Part', slug: 'auto-part', attributeGroups: [], customFields: {} },
        categories: [],
        attributes: [],
        options: [],
        customFields: { tecDoc: p.tecDoc, icIndex: p.icIndex },
    };
}

/** Returns the shared featured/related products as IProduct[]. */
export function getFeaturedProducts(): IProduct[] {
    return FEATURED_PRODUCTS_RAW.map(featuredProductToIProduct);
}
