// react
import React from 'react';
// third-party
import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import BlogSidebar from '~/components/blog/BlogSidebar';
import Decor from '~/components/shared/Decor';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import classNames from 'classnames';

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

function BlogDetailPage() {
    const router = useRouter();
    const { slug } = router.query as { slug?: string };

    const { data, loading, error } = useQuery(GET_BLOG, {
        skip: !slug,
        variables: { slug },
    });

    const blog = data?.blog;

    const featuredImage = blog?.featuredImage?.source || null;

    return (
        <React.Fragment>
            {blog && (
                <Head>
                    <title>{blog.metaTitle || blog.title}</title>
                    <meta name="description" content={blog.metaDescription || blog.excerpt || ''} />
                    {blog.metaTags && <meta name="keywords" content={Array.isArray(blog.metaTags) ? blog.metaTags.join(', ') : blog.metaTags} />}
                    <meta property="og:title" content={blog.metaTitle || blog.title} />
                    <meta property="og:description" content={blog.metaDescription || blog.excerpt || ''} />
                    {featuredImage && <meta property="og:image" content={featuredImage} />}
                    <meta property="og:type" content="article" />
                    <link rel="canonical" href={`/blog/${blog.slug}`} />
                </Head>
            )}

            <div className="block post-view">
                <div
                    className={classNames('post-view__header post-header', {
                        'post-header--has-image': Boolean(featuredImage),
                    })}
                >
                    {featuredImage && (
                        <div
                            className="post-header__image"
                            style={{ backgroundImage: `url(${featuredImage})` }}
                        />
                    )}

                    <div className="post-header__body">
                        <div className="post-header__categories">
                            <ul className="post-header__categories-list">
                                <li className="post-header__categories-item">
                                    <AppLink href="/blog" className="post-header__categories-link">
                                        Blog
                                    </AppLink>
                                </li>
                            </ul>
                        </div>
                        <h1 className="post-header__title">{loading ? 'Loading…' : (blog?.title || 'Blog')}</h1>
                        <div className="post-header__meta">
                            <ul className="post-header__meta-list">
                                {blog?.author && (
                                    <li className="post-header__meta-item">
                                        {'By '}
                                        <span className="post-header__meta-link">{blog.author}</span>
                                    </li>
                                )}
                                {blog?.createdAt && (
                                    <li className="post-header__meta-item">{new Date(blog.createdAt).toLocaleDateString()}</li>
                                )}
                                {blog?.readingTime && (
                                    <li className="post-header__meta-item">{blog.readingTime} min read</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <Decor type="bottom" className="post-header__decor" />
                </div>

                <div className="container">
                    <div className="post-view__body">
                        <div className="post-view__item post-view__item-post">
                            {error && <div className="typography">Error: {error.message}</div>}
                            {loading && <div className="typography">Loading...</div>}
                            {blog && (
                                <div className="post post__body typography">
                                    {blog.featuredImage && !featuredImage && (
                                        <AppImage src={blog.featuredImage.preview} />
                                    )}
                                    <div
                                        className="blog-content"
                                        dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="post-view__item post-view__item-sidebar">
                            <BlogSidebar />
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

// noinspection JSUnusedGlobalSymbols
BlogDetailPage.Layout = React.Fragment as unknown as React.ComponentType;

export default BlogDetailPage;


