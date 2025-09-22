# ProductReview Plugin - Frontend Implementation Guide

## Overview

The ProductReview plugin provides a complete review system for products with admin approval workflow. This guide covers all the GraphQL operations available for frontend implementation.

## API Endpoints

- **Shop API**: `http://localhost:3000/shop-api` (Customer operations)
- **Admin API**: `http://localhost:3000/admin-api` (Admin operations)

## Authentication

All review submission operations require user authentication. Use the login mutation first:

```graphql
mutation Login {
  login(username: "user@example.com", password: "password") {
    ... on CurrentUser {
      id
      identifier
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
```

## Shop API Operations (Customer-facing)

### 1. Get Product Reviews

Retrieves all approved reviews for a specific product.

```graphql
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
```

**Variables:**
```json
{
  "productId": "1",
  "options": {
    "take": 10,
    "skip": 0,
    "sort": {
      "createdAt": "DESC"
    }
  }
}
```

### 2. Get Product Review Statistics

Get average rating and total review count for a product.

```graphql
query GetProductReviewStats($productId: ID!) {
  productReviewStats(productId: $productId) {
    averageRating
    totalReviews
  }
}
```

**Variables:**
```json
{
  "productId": "1"
}
```

### 2. Submit a Product Review

Allows logged-in customers to submit a new review for a product.

```graphql
mutation SubmitProductReview($input: CreateProductReviewInput!) {
  submitProductReview(input: $input) {
    id
    review
    rating
    state
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "productId": "1",
    "review": "This product exceeded my expectations. The quality is excellent and it arrived quickly.",
    "rating": 5
  }
}
```

**Validation Rules:**
- `rating`: Must be between 1 and 5
- `review`: Required, non-empty string
- User must be logged in
- User can only review each product once

### 4. Vote on Reviews

Allow users to upvote or downvote reviews.

```graphql
mutation VoteOnReview($reviewId: ID!, $type: String!) {
  voteOnReview(reviewId: $reviewId, type: $type) {
    id
    upvotes
    downvotes
  }
}
```

**Variables:**
```json
{
  "reviewId": "1",
  "type": "up"
}
```

**Vote Types:**
- `"up"`: Upvote the review
- `"down"`: Downvote the review

---

## Admin API Operations

### 1. Get All Reviews

Retrieve all reviews with filtering and sorting options.

```graphql
query GetAllReviews($options: ProductReviewListOptions) {
  productReviews(options: $options) {
    items {
      id
      review
      rating
      state
      createdAt
      updatedAt
      product {
        id
        name
      }
      author {
        id
        firstName
        lastName
        emailAddress
      }
    }
    totalItems
  }
}
```

**Variables:**
```json
{
  "options": {
    "take": 20,
    "skip": 0,
    "sort": {
      "createdAt": "DESC"
    },
    "filter": {
      "state": {
        "eq": "new"
      }
    }
  }
}
```

### 2. Get Single Review

Retrieve details of a specific review.

```graphql
query GetProductReview($id: ID!) {
  productReview(id: $id) {
    id
    title
    body
    summary
    rating
    authorName
    authorLocation
    state
    upvotes
    downvotes
    createdAt
    updatedAt
    product {
      id
      name
      slug
    }
    author {
      id
      firstName
      lastName
      emailAddress
    }
  }
}
```

### 3. Get Reviews by Product

Get all reviews for a specific product (including non-approved).

```graphql
query GetReviewsByProduct($productId: ID!, $options: ProductReviewListOptions) {
  productReviewsByProduct(productId: $productId, options: $options) {
    items {
      id
      title
      rating
      state
      authorName
      createdAt
    }
    totalItems
  }
}
```

### 4. Approve Review

Approve a review to make it visible on the shop.

```graphql
mutation ApproveProductReview($id: ID!) {
  approveProductReview(id: $id) {
    id
    state
    title
    updatedAt
  }
}
```

### 5. Reject Review

Reject a review to prevent it from being shown.

```graphql
mutation RejectProductReview($id: ID!) {
  rejectProductReview(id: $id) {
    id
    state
    title
    updatedAt
  }
}
```

### 6. Update Review

Edit review details (admin only).

```graphql
mutation UpdateProductReview($input: UpdateProductReviewInput!) {
  updateProductReview(input: $input) {
    id
    title
    body
    summary
    rating
    state
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "1",
    "title": "Updated title",
    "rating": 4,
    "state": "approved"
  }
}
```

### 7. Delete Review

Permanently delete a review.

```graphql
mutation DeleteProductReview($id: ID!) {
  deleteProductReview(id: $id)
}
```

## Data Types

### ReviewState Enum
- `new`: Newly submitted, awaiting approval
- `approved`: Approved and visible on shop
- `rejected`: Rejected and hidden

### ProductReview Type
```typescript
interface ProductReview {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  body: string;
  summary: string;
  rating: number; // 1-5
  authorName: string;
  authorLocation?: string;
  state: 'new' | 'approved' | 'rejected';
  upvotes: number;
  downvotes: number;
  product: Product;
  author?: Customer;
}
```

### ProductReviewStats Type
```typescript
interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
}
```

## Frontend Implementation Examples

### React Component Example

```jsx
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';

const ProductReviews = ({ productId }) => {
  const { data, loading } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { productId, options: { take: 10 } }
  });

  const { data: stats } = useQuery(GET_PRODUCT_REVIEW_STATS, {
    variables: { productId }
  });

  const [submitReview] = useMutation(SUBMIT_PRODUCT_REVIEW);

  const handleSubmitReview = async (reviewData) => {
    try {
      await submitReview({
        variables: {
          input: {
            productId,
            ...reviewData
          }
        }
      });
      // Show success message
      // Refetch reviews
    } catch (error) {
      // Handle error (authentication, validation, etc.)
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <div className="review-stats">
        <h3>Customer Reviews</h3>
        <p>Average: {stats?.productReviewStats.averageRating}/5</p>
        <p>Total: {stats?.productReviewStats.totalReviews} reviews</p>
      </div>

      <div className="reviews-list">
        {data?.productReviews.items.map(review => (
          <div key={review.id} className="review-item">
            <h4>{review.title}</h4>
            <div className="rating">{'★'.repeat(review.rating)}</div>
            <p>{review.body}</p>
            <div className="review-meta">
              <span>By {review.authorName}</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              <div className="votes">
                <button>👍 {review.upvotes}</button>
                <button>👎 {review.downvotes}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReviewForm onSubmit={handleSubmitReview} />
    </div>
  );
};
```

### Admin Dashboard Example

```jsx
const AdminReviews = () => {
  const { data, refetch } = useQuery(GET_ALL_REVIEWS, {
    variables: {
      options: {
        take: 20,
        filter: { state: { eq: 'new' } }
      }
    }
  });

  const [approveReview] = useMutation(APPROVE_PRODUCT_REVIEW);
  const [rejectReview] = useMutation(REJECT_PRODUCT_REVIEW);

  const handleApprove = async (reviewId) => {
    await approveReview({ variables: { id: reviewId } });
    refetch();
  };

  const handleReject = async (reviewId) => {
    await rejectReview({ variables: { id: reviewId } });
    refetch();
  };

  return (
    <div className="admin-reviews">
      <h2>Pending Reviews</h2>
      {data?.productReviews.items.map(review => (
        <div key={review.id} className="admin-review-item">
          <h4>{review.title}</h4>
          <p>Product: {review.product.name}</p>
          <p>Rating: {review.rating}/5</p>
          <p>Author: {review.authorName}</p>
          <p>{review.body}</p>
          <div className="admin-actions">
            <button onClick={() => handleApprove(review.id)}>
              Approve
            </button>
            <button onClick={() => handleReject(review.id)}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Error Handling

### Common Errors

1. **Authentication Required**
   ```json
   {
     "errors": [{
       "message": "You are not currently authorized to perform this action",
       "extensions": { "code": "FORBIDDEN" }
     }]
   }
   ```

2. **Duplicate Review**
   ```json
   {
     "errors": [{
       "message": "You have already reviewed this product"
     }]
   }
   ```

3. **Invalid Rating**
   ```json
   {
     "errors": [{
       "message": "Rating must be between 1 and 5"
     }]
   }
   ```

4. **Product Not Found**
   ```json
   {
     "errors": [{
       "message": "No Product with the id 999 could be found"
     }]
   }
   ```

## Best Practices

1. **Authentication Check**: Always check if user is logged in before showing review forms
2. **Optimistic Updates**: Use optimistic updates for voting to improve UX
3. **Pagination**: Implement pagination for large review lists
4. **Loading States**: Show loading indicators during API calls
5. **Error Handling**: Provide clear error messages to users
6. **Real-time Updates**: Consider using subscriptions for real-time review updates
7. **Caching**: Use Apollo Client caching for better performance

## Testing

### Test Workflow
1. Login as customer
2. Submit review → should have state "new"
3. Login as admin
4. Approve review → state changes to "approved"
5. Check shop API → review now visible
6. Test voting functionality
7. Verify statistics update correctly

This documentation provides everything the frontend team needs to implement the ProductReview functionality effectively.
