# Vendure Blog Plugin - Frontend Integration Guide

## Overview

The Vendure Blog Plugin provides a comprehensive blogging solution with SEO optimization, image management, and GraphQL APIs for both Shop and Admin interfaces. This guide covers frontend integration, GraphQL queries, and SEO implementation.

## Table of Contents

1. [GraphQL API Reference](#graphql-api-reference)
2. [SEO Features](#seo-features)
3. [Frontend Implementation](#frontend-implementation)
4. [Image Management](#image-management)
5. [Usage Examples](#usage-examples)

## GraphQL API Reference

### Shop API Queries

#### Get All Blogs
```graphql
query GetBlogs($options: BlogListOptions) {
  blogs(options: $options) {
    items {
      id
      title
      slug
      excerpt
      content
      published
      author
      createdAt
      updatedAt
      metaTitle
      metaDescription
      metaTags
      readingTime
      featured
      featuredImage {
        id
        name
        source
        preview
      }
    }
    totalItems
  }
}
```

#### Get Single Blog
```graphql
query GetBlog($slug: String!) {
  blog(slug: $slug) {
    id
    title
    slug
    content
    excerpt
    published
    author
    createdAt
    updatedAt
    metaTitle
    metaDescription
    metaTags
    readingTime
    featured
    featuredImage {
      id
      name
      source
      preview
    }
  }
}
```

#### Get Blog by ID
```graphql
query GetBlogById($id: ID!) {
  blog(id: $id) {
    id
    title
    slug
    content
    excerpt
    published
    author
    createdAt
    updatedAt
    metaTitle
    metaDescription
    metaTags
    readingTime
    featured
    featuredImage {
      id
      name
      source
      preview
    }
  }
}
```

### Admin API Mutations

#### Create Blog
```graphql
mutation CreateBlog($input: CreateBlogInput!) {
  createBlog(input: $input) {
    id
    title
    slug
    content
    excerpt
    published
    publishedAt
    author
    metaTitle
    metaDescription
    metaTags
    readingTime
    featured
    featuredImage {
      id
      name
      source
      preview
    }
  }
}
```

#### Update Blog
```graphql
mutation UpdateBlog($input: UpdateBlogInput!) {
  updateBlog(input: $input) {
    id
    title
    slug
    content
    excerpt
    published
    publishedAt
    author
    metaTitle
    metaDescription
    metaTags
    readingTime
    featured
    featuredImage {
      id
      name
      source
      preview
    }
  }
}
```

#### Delete Blog
```graphql
mutation DeleteBlog($id: ID!) {
  deleteBlog(id: $id) {
    result
    message
  }
}
```

### Input Types

#### CreateBlogInput
```typescript
interface CreateBlogInput {
  title: string;
  slug?: string; // Auto-generated if not provided
  content: string;
  excerpt?: string;
  published?: boolean;
  publishedAt?: string; // ISO date string
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: string[];
  featuredImageId?: string;
  readingTime?: number; // Reading time in minutes
  featured?: boolean; // Featured flag for highlighting
}
```

#### UpdateBlogInput
```typescript
interface UpdateBlogInput {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  publishedAt?: string; // ISO date string
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: string[];
  featuredImageId?: string;
  readingTime?: number; // Reading time in minutes
  featured?: boolean; // Featured flag for highlighting
}
```

#### BlogListOptions
```typescript
interface BlogListOptions {
  skip?: number;
  take?: number;
  sort?: BlogSortParameter;
  filter?: BlogFilterParameter;
}
```

## SEO Features

### Meta Tags Implementation

The blog plugin provides comprehensive SEO support through meta fields:

#### 1. Meta Title
- **Field**: `metaTitle`
- **Usage**: Custom title for search engines
- **Fallback**: Uses blog `title` if not provided
- **Best Practice**: Keep under 60 characters

#### 2. Meta Description
- **Field**: `metaDescription`
- **Usage**: Search engine snippet description
- **Fallback**: Uses blog `excerpt` if not provided
- **Best Practice**: Keep between 150-160 characters

#### 3. Meta Tags
- **Field**: `metaTags`
- **Usage**: Additional keywords and tags
- **Format**: Comma-separated string
- **Example**: `"technology, web development, vendure"`

### Frontend SEO Implementation

#### React/Next.js Example
```jsx
import Head from 'next/head';

function BlogPost({ blog }) {
  return (
    <>
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        <meta 
          name="description" 
          content={blog.metaDescription || blog.excerpt} 
        />
        <meta 
          name="keywords" 
          content={blog.metaTags} 
        />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta 
          property="og:description" 
          content={blog.metaDescription || blog.excerpt} 
        />
        {blog.featuredImage && (
          <meta property="og:image" content={blog.featuredImage.source} />
        )}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/blog/${blog.slug}`} />
      </Head>
      
      <article>
        <h1>{blog.title}</h1>
        {blog.featuredImage && (
          <img 
            src={blog.featuredImage.source} 
            alt={blog.featuredImage.name}
            loading="lazy"
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </>
  );
}
```

#### Vue/Nuxt Example
```vue
<template>
  <article>
    <h1>{{ blog.title }}</h1>
    <img 
      v-if="blog.featuredImage" 
      :src="blog.featuredImage.source" 
      :alt="blog.featuredImage.name"
      loading="lazy"
    />
    <div v-html="blog.content"></div>
  </article>
</template>

<script>
export default {
  head() {
    return {
      title: this.blog.metaTitle || this.blog.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.blog.metaDescription || this.blog.excerpt
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.blog.metaTags
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.blog.metaTitle || this.blog.title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.blog.metaDescription || this.blog.excerpt
        },
        ...(this.blog.featuredImage ? [{
          hid: 'og:image',
          property: 'og:image',
          content: this.blog.featuredImage.source
        }] : [])
      ],
      link: [
        {
          rel: 'canonical',
          href: `/blog/${this.blog.slug}`
        }
      ]
    }
  }
}
</script>
```

## Frontend Implementation

### Blog List Page

#### GraphQL Query
```typescript
import { gql } from '@apollo/client';

const GET_BLOGS = gql`
  query GetBlogs($options: BlogListOptions) {
    blogs(options: $options) {
      items {
        id
        title
        slug
        excerpt
        author
        createdAt
        readingTime
        featured
        featuredImage {
          id
          source
          preview
        }
      }
      totalItems
    }
  }
`;
```

#### React Implementation
```jsx
import { useQuery } from '@apollo/client';

function BlogList() {
  const { data, loading, error } = useQuery(GET_BLOGS, {
    variables: {
      options: {
        take: 10,
        skip: 0,
        sort: { createdAt: 'DESC' },
        filter: { published: { eq: true } }
      }
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="blog-list">
      {data.blogs.items.map(blog => (
        <article key={blog.id} className={`blog-card ${blog.featured ? 'featured' : ''}`}>
          {blog.featuredImage && (
            <img 
              src={blog.featuredImage.preview} 
              alt={blog.title}
              loading="lazy"
            />
          )}
          <h2>
            <a href={`/blog/${blog.slug}`}>{blog.title}</a>
            {blog.featured && <span className="featured-badge">Featured</span>}
          </h2>
          <p>{blog.excerpt}</p>
          <div className="blog-meta">
            <small>By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</small>
            {blog.readingTime && <small> • {blog.readingTime} min read</small>}
          </div>
        </article>
      ))}
    </div>
  );
}
```

### Blog Detail Page

#### GraphQL Query
```typescript
const GET_BLOG = gql`
  query GetBlog($slug: String!) {
    blog(slug: $slug) {
      id
      title
      slug
      content
      excerpt
      author
      createdAt
      metaTitle
      metaDescription
      metaTags
      readingTime
      featured
      featuredImage {
        id
        name
        source
        preview
      }
    }
  }
`;
```

#### React Implementation
```jsx
function BlogDetail({ slug }) {
  const { data, loading, error } = useQuery(GET_BLOG, {
    variables: { slug }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const blog = data.blog;

  return (
    <article className={`blog-detail ${blog.featured ? 'featured' : ''}`}>
      <header>
        <h1>{blog.title}</h1>
        {blog.featured && <span className="featured-badge">Featured Post</span>}
        <div className="blog-meta">
          <meta name="author" content={blog.author} />
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </time>
          {blog.readingTime && <span> • {blog.readingTime} min read</span>}
        </div>
      </header>
      
      {blog.featuredImage && (
        <figure>
          <img 
            src={blog.featuredImage.source} 
            alt={blog.featuredImage.name}
            loading="lazy"
          />
        </figure>
      )}
      
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </article>
  );
}
```

## Image Management

### Featured Images

Featured images are managed through Vendure's asset system:

```typescript
// Accessing featured image
const featuredImageUrl = blog.featuredImage?.source;
const featuredImagePreview = blog.featuredImage?.preview; // Smaller version
```

### Content Images

Images in blog content are automatically handled through the rich text editor and stored as Vendure assets.

### Responsive Images

```jsx
function ResponsiveImage({ asset, alt, className }) {
  return (
    <picture className={className}>
      <source 
        media="(max-width: 768px)" 
        srcSet={`${asset.preview}?preset=mobile`} 
      />
      <img 
        src={asset.source} 
        alt={alt || asset.name}
        loading="lazy"
      />
    </picture>
  );
}
```

## Usage Examples

### Pagination
```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 10;

const { data } = useQuery(GET_BLOGS, {
  variables: {
    options: {
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      sort: { createdAt: 'DESC' }
    }
  }
});

const totalPages = Math.ceil(data?.blogs.totalItems / itemsPerPage);
```

### Search and Filtering
```typescript
const [searchTerm, setSearchTerm] = useState('');

const { data } = useQuery(GET_BLOGS, {
  variables: {
    options: {
      filter: {
        title: { contains: searchTerm },
        published: { eq: true }
      }
    }
  }
});
```

### Blog Categories (if implemented)
```graphql
query GetBlogsByCategory($category: String!) {
  blogs(options: {
    filter: {
      metaTags: { contains: $category }
      published: { eq: true }
    }
  }) {
    items {
      id
      title
      slug
      excerpt
      featuredImage {
        source
        preview
      }
    }
  }
}
```

## Best Practices

### SEO Optimization
1. Always provide `metaTitle` and `metaDescription`
2. Use descriptive, keyword-rich slugs
3. Implement structured data (JSON-LD)
4. Add canonical URLs
5. Optimize images with alt tags

### Performance
1. Use `preview` images for thumbnails
2. Implement lazy loading for images
3. Use pagination for blog lists
4. Cache GraphQL queries
5. Implement proper error boundaries

### Content Management
1. Validate content before publishing
2. Implement draft/preview functionality
3. Add content versioning if needed
4. Sanitize HTML content for security
5. Implement content scheduling

## Error Handling

```typescript
function BlogErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong loading the blog.</div>}
      onError={(error) => console.error('Blog error:', error)}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Security Considerations

1. **Content Sanitization**: Always sanitize HTML content when rendering
2. **XSS Prevention**: Use proper escaping for user-generated content
3. **Image Validation**: Validate uploaded images on the server
4. **Access Control**: Implement proper authentication for admin operations

## Deployment Notes

1. Ensure asset server is properly configured
2. Set up CDN for image delivery
3. Configure proper caching headers
4. Implement sitemap generation for SEO
5. Set up analytics tracking

---

This documentation provides a comprehensive guide for integrating the Vendure Blog Plugin with your frontend application. For additional support or customization needs, refer to the Vendure documentation or contact your development team.
