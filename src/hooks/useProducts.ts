import { useState, useEffect } from 'react';
import { fetchProducts, searchProducts, Product, ProductSearchItem } from '~/api/graphql/products.api';

// Import the actual IProduct interface from the project
import { IProduct } from '~/interfaces/product';

export interface IProductsList {
  items: IProduct[];
  page: number;
  limit: number;
  sort: string;
  total: number;
  pages: number;
  from: number;
  to: number;
  filters: any[];
  navigation: {
    type: 'page';
    page: number;
    from: number;
    to: number;
    total: number;
    limit: number;
    pages: number;
  };
}

// Helper function to handle stock levels
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

// Convert Vendure Product to IProduct interface
const convertVendureProductToIProduct = (vendureProduct: Product): IProduct => {
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
    images.push('/images/products/product-placeholder.jpg');
  }

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

// Convert Vendure Search Item to IProduct interface
const convertVendureSearchItemToIProduct = (searchItem: ProductSearchItem): IProduct => {
  const images: string[] = [];
  
  if (searchItem.productVariantAsset?.preview) {
    images.push(searchItem.productVariantAsset.preview);
  } else if (searchItem.productAsset?.preview) {
    images.push(searchItem.productAsset.preview);
  }
  
  // If still no images, add a placeholder
  if (images.length === 0) {
    images.push('/images/products/product-placeholder.jpg');
  }

  const stockStatus = searchItem.inStock ? 'in-stock' : 'out-of-stock';
  const description = `Auto part: ${searchItem.productName}`;

  return {
    id: parseInt(searchItem.productId, 10),
    name: searchItem.productName,
    excerpt: description,
    description,
    slug: searchItem.slug,
    sku: searchItem.sku,
    partNumber: searchItem.sku, // Use SKU as part number
    stock: stockStatus as 'in-stock' | 'out-of-stock',
    price: searchItem.priceWithTax.value,
    compareAtPrice: null, // Not provided by Vendure
    images,
    badges: [], // Default empty badges
    rating: 5, // Default rating
    reviews: 0, // Default reviews
    availability: stockStatus as 'in-stock' | 'out-of-stock',
    compatibility: 'all' as const, // Default to compatible with all vehicles
    brand: null, // Not provided in search results
    tags: [], // Default empty tags
    type: {
      name: 'Auto Part',
      slug: 'auto-part',
      attributeGroups: [],
      customFields: {},
    },
    categories: [], // Not provided in search results
    attributes: [], // Default empty attributes array
    options: [], // Default empty options array
    customFields: {},
  };
};

export interface UseProductsOptions {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<IProductsList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 24, sort = 'name_asc', search } = options;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const skip = (page - 1) * limit;
        const sortOptions = getSortOptions(sort);

        let result;
        let convertedProducts: IProduct[];

        if (search && search.trim()) {
          // Use search API
          const searchResult = await searchProducts({
            term: search,
            groupByProduct: true,
            skip,
            take: limit,
            sort: sortOptions,
          });

          convertedProducts = searchResult.items.map(convertVendureSearchItemToIProduct);
          result = {
            totalItems: searchResult.totalItems,
            items: convertedProducts,
          };
        } else {
          // Use products API
          const productsResult = await fetchProducts({
            skip,
            take: limit,
            sort: sortOptions,
          });

          convertedProducts = productsResult.items.map(convertVendureProductToIProduct);
          result = productsResult;
        }

        const totalPages = Math.ceil(result.totalItems / limit);
        const from = skip + 1;
        const to = Math.min(skip + limit, result.totalItems);

        const productsList: IProductsList = {
          items: convertedProducts,
          page,
          limit,
          sort,
          total: result.totalItems,
          pages: totalPages,
          from,
          to,
          filters: [], // TODO: Add filters support
          navigation: {
            type: 'page',
            page,
            from,
            to,
            total: result.totalItems,
            limit,
            pages: totalPages,
          },
        };

        setProducts(productsList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, limit, sort, search]);

  return { products, loading, error };
};

// Helper function to convert sort options
const getSortOptions = (sort: string): { [key: string]: 'ASC' | 'DESC' } => {
  switch (sort) {
    case 'name_asc':
      return { name: 'ASC' };
    case 'name_desc':
      return { name: 'DESC' };
    case 'price_asc':
      return { price: 'ASC' };
    case 'price_desc':
      return { price: 'DESC' };
    case 'created_asc':
      return { createdAt: 'ASC' };
    case 'created_desc':
      return { createdAt: 'DESC' };
    default:
      return { name: 'ASC' };
  }
};
