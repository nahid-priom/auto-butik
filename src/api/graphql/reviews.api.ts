import { gql } from '@apollo/client';
import { graphqlClient } from './account.api';
import { IReviewsList } from '~/interfaces/list';
import { IReview } from '~/interfaces/review';

// GraphQL operations based on ProductReview plugin docs
export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $options: ProductReviewListOptions) {
    productReviews(productId: $productId, options: $options) {
      items {
        id
        review
        rating
        createdAt
        author {
          id
          firstName
          lastName
        }
      }
      totalItems
    }
  }
`;

export const GET_PRODUCT_REVIEW_STATS = gql`
  query GetProductReviewStats($productId: ID!) {
    productReviewStats(productId: $productId) {
      averageRating
      totalReviews
    }
  }
`;

export const SUBMIT_PRODUCT_REVIEW = gql`
  mutation SubmitProductReview($input: CreateProductReviewInput!) {
    submitProductReview(input: $input) {
      id
      review
      rating
      state
      createdAt
    }
  }
`;

export interface ProductReviewItem {
  id: string;
  review: string;
  rating: number;
  createdAt: string;
  author?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}

export interface ProductReviewsResponse {
  productReviews: {
    items: ProductReviewItem[];
    totalItems: number;
  };
}

export interface ProductReviewStatsResponse {
  productReviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface SubmitProductReviewResponse {
  submitProductReview: {
    id: string;
    review: string;
    rating: number;
    state: string;
    createdAt: string;
  };
}

function mapGraphqlReviewToIReview(item: ProductReviewItem): IReview {
  const authorName = [item.author?.firstName, item.author?.lastName].filter(Boolean).join(' ').trim();
  return {
    id: Number(item.id),
    date: item.createdAt,
    author: authorName || 'Anonymous',
    avatar: '/images/avatars/avatar-1.jpg',
    rating: item.rating,
    content: item.review,
  };
}

export async function fetchProductReviews(
  productId: number,
  options?: { skip?: number; take?: number; sort?: { createdAt?: 'ASC' | 'DESC' } }
): Promise<IReviewsList> {
  const take = options?.take ?? 8;
  const skip = options?.skip ?? 0;
  const sort = options?.sort ?? { createdAt: 'DESC' as const };

  const { data } = await graphqlClient.query<ProductReviewsResponse>({
    query: GET_PRODUCT_REVIEWS,
    variables: {
      productId: String(productId),
      options: { take, skip, sort },
    },
    fetchPolicy: 'network-only',
  });

  const items = (data.productReviews.items || []).map(mapGraphqlReviewToIReview);
  const total = data.productReviews.totalItems || 0;

  // Adapt to IReviewsList (page-based navigation)
  const page = Math.floor(skip / take) + 1;
  const pages = Math.max(1, Math.ceil(total / take));
  const from = total === 0 ? 0 : (page - 1) * take + 1;
  const to = Math.min(page * take, total);

  return {
    items,
    sort: `createdAt:${sort.createdAt || 'DESC'}`,
    navigation: {
      type: 'page',
      page,
      limit: take,
      total,
      pages,
      from,
      to,
    },
  } as IReviewsList;
}

export async function submitProductReview(
  productId: number,
  input: { rating: number; review: string }
): Promise<void> {
  await graphqlClient.mutate<SubmitProductReviewResponse>({
    mutation: SUBMIT_PRODUCT_REVIEW,
    variables: {
      input: {
        productId: String(productId),
        rating: input.rating,
        review: input.review,
      },
    },
  });
}

export async function fetchProductReviewStats(productId: number): Promise<{ averageRating: number; totalReviews: number }> {
  const { data } = await graphqlClient.query<ProductReviewStatsResponse>({
    query: GET_PRODUCT_REVIEW_STATS,
    variables: { productId: String(productId) },
    fetchPolicy: 'network-only',
  });
  return data.productReviewStats || { averageRating: 0, totalReviews: 0 };
}


