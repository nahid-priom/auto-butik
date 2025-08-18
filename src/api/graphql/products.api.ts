import { gql } from '@apollo/client';
import { graphqlClient } from './account.api';
import { IProduct } from '~/interfaces/product';

// GraphQL Types based on Vendure Shop API
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  featuredAsset?: {
    preview: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  customFields?: {
    tecDoc?: string;
  };
  featuredAsset?: {
    preview: string;
  };
  assets: Array<{
    id: string;
    preview: string;
    source: string;
    width: number;
    height: number;
  }>;
  variants: ProductVariant[];
}

export interface ProductsListResponse {
  products: {
    totalItems: number;
    items: Product[];
  };
}

export interface ProductSearchItem {
  productId: string;
  productName: string;
  slug: string;
  productAsset?: {
    preview: string;
  };
  productVariantId: string;
  productVariantName: string;
  sku: string;
  priceWithTax: {
    value: number;
    currencyCode: string;
  };
  price: {
    value: number;
    currencyCode: string;
  };
  currencyCode: string;
  inStock: boolean;
  enabled: boolean;
  productVariantAsset?: {
    preview: string;
  };
}

export interface ProductSearchResponse {
  search: {
    totalItems: number;
    items: ProductSearchItem[];
  };
}

export interface ProductDetailResponse {
  product: Product;
}

// GraphQL Queries
export const GET_PRODUCTS_QUERY = gql`
  query Products($options: ProductListOptions) {
    products(options: $options) {
      totalItems
      items {
        id
        name
        slug
        description
        customFields {
          tecDoc
        }
        featuredAsset {
          preview
        }
        assets {
          id
          preview
          source
          width
          height
        }
        variants {
          id
          name
          sku
          priceWithTax
          currencyCode
          stockLevel
          featuredAsset {
            preview
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = gql`
  query ProductSearch($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        productId
        productName
        slug
        productAsset {
          preview
        }
        productVariantId
        productVariantName
        sku
        priceWithTax {
          value
          currencyCode
        }
        price {
          value
          currencyCode
        }
        currencyCode
        inStock
        enabled
        productVariantAsset {
          preview
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
  query ProductDetail($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      customFields {
        tecDoc
      }
      featuredAsset {
        preview
      }
      assets {
        id
        preview
        source
        width
        height
      }
      variants {
        id
        name
        sku
        priceWithTax
        currencyCode
        stockLevel
        featuredAsset {
          preview
        }
      }
    }
  }
`;

// API Functions
export const fetchProducts = async (options: {
  skip?: number;
  take?: number;
  sort?: { [key: string]: 'ASC' | 'DESC' };
} = {}) => {
  const { data } = await graphqlClient.query<ProductsListResponse>({
    query: GET_PRODUCTS_QUERY,
    variables: {
      options: {
        skip: options.skip || 0,
        take: options.take || 24,
        sort: options.sort || { name: 'ASC' },
      },
    },
  });

  return data.products;
};

export const searchProducts = async (input: {
  term?: string;
  groupByProduct?: boolean;
  skip?: number;
  take?: number;
  sort?: { [key: string]: 'ASC' | 'DESC' };
  collectionId?: string;
  facetValueIds?: string[];
} = {}) => {
  const { data } = await graphqlClient.query<ProductSearchResponse>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: {
      input: {
        term: input.term || '',
        groupByProduct: input.groupByProduct ?? true,
        skip: input.skip || 0,
        take: input.take || 24,
        sort: input.sort || { name: 'ASC' },
        ...(input.collectionId && { collectionId: input.collectionId }),
        ...(input.facetValueIds && { facetValueIds: input.facetValueIds }),
      },
    },
  });

  return data.search;
};

// Convert Vendure Product to IProduct interface for detail page
const convertVendureProductDetailToIProduct = (vendureProduct: Product): IProduct => {
  const primaryVariant = vendureProduct.variants[0];
  const images: string[] = [];
  
  // Get images from assets
  if (vendureProduct.assets && vendureProduct.assets.length > 0) {
    vendureProduct.assets.forEach(asset => {
      if (asset.preview) {
        images.push(asset.preview);
      }
    });
  }
  
  // Fallback to featuredAsset if no assets
  if (images.length === 0 && vendureProduct.featuredAsset?.preview) {
    images.push(vendureProduct.featuredAsset.preview);
  }
  
  // If still no images, add a placeholder
  if (images.length === 0) {
    images.push('/images/products/product-placeholder.jpg'); // You can add a placeholder image
  }

  // Handle different stock levels
  const getStockStatus = (stockLevel: string): 'in-stock' | 'out-of-stock' | 'on-backorder' => {
    switch (stockLevel) {
      case 'IN_STOCK':
        return 'in-stock';
      case 'OUT_OF_STOCK':
        return 'out-of-stock';
      case 'LOW_STOCK':
        return 'in-stock'; // Treat low stock as in stock
      default:
        return 'out-of-stock';
    }
  };

  const stockStatus = getStockStatus(primaryVariant?.stockLevel || 'OUT_OF_STOCK');
  
  // Create description or excerpt from available data
  const description = vendureProduct.description || `Auto part: ${vendureProduct.name}`;
  const excerpt = description.length > 150 ? description.substring(0, 150) + '...' : description;

  return {
    id: parseInt(vendureProduct.id, 10),
    name: vendureProduct.name,
    excerpt,
    description,
    slug: vendureProduct.slug,
    sku: primaryVariant?.sku || '',
    partNumber: primaryVariant?.sku || '', // Use SKU as part number
    stock: stockStatus,
    price: primaryVariant?.priceWithTax || 0,
    compareAtPrice: null, // Not provided by Vendure
    images,
    badges: [], // Default empty badges
    rating: 5, // Default rating since not provided by Vendure
    reviews: 0, // Default reviews since not provided by Vendure
    availability: stockStatus === 'in-stock' ? 'in-stock' : 'out-of-stock',
    compatibility: 'all' as const, // Default to compatible with all vehicles
    brand: null, // Not provided in current GraphQL query
    tags: [], // Default empty tags
    type: {
      name: 'Auto Part',
      slug: 'auto-part',
      attributeGroups: [],
      customFields: {},
    },
    categories: [], // Not provided in current GraphQL query
    attributes: [], // Default empty attributes array
    options: [], // Default empty options array
    customFields: vendureProduct.customFields || {},
  };
};

export const fetchProductDetail = async (slug: string) => {
  try {
    const { data } = await graphqlClient.query<ProductDetailResponse>({
      query: GET_PRODUCT_DETAIL_QUERY,
      variables: { slug },
    });

    if (!data.product) {
      return null;
    }

    return convertVendureProductDetailToIProduct(data.product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return null;
  }
};
