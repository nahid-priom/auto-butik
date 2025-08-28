// react
import React, { useMemo, useState } from 'react';
// third-party
import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlogSidebar from '~/components/blog/BlogSidebar';
import PageTitle from '~/components/shared/PageTitle';
import Pagination from '~/components/shared/Pagination';
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';

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

function BlogListPage() {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const variables = useMemo(() => ({
        options: {
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            sort: { createdAt: 'DESC' },
            filter: { published: { eq: true } },
        },
    }), [page]);

    const { data, loading, error } = useQuery(GET_BLOGS, { variables });

    const totalItems: number = data?.blogs?.totalItems || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    return (
        <React.Fragment>
            <PageTitle>Latest News</PageTitle>

            <BlockHeader
                pageTitle="Latest News"
                breadcrumb={[
                    { title: 'Home', url: '' },
                    { title: 'Blog', url: '' },
                ]}
            />

            <div className={classNames('block', 'blog-view', 'blog-view--layout--classic')}>
                <div className="container">
                    <div className="blog-view__body">
                        <div className="blog-view__item blog-view__item-sidebar">
                            <BlogSidebar />
                        </div>
                        <div className="blog-view__item blog-view__item-posts">
                            <div className="block posts-view">
                                <div className={classNames('posts-view__list', 'posts-list', {
                                    'posts-list--layout--classic': true,
                                })}
                                >
                                    {loading && (
                                        <div className="posts-list__body">
                                            <div className="typography">Loading...</div>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="posts-list__body">
                                            <div className="typography">Error: {error.message}</div>
                                        </div>
                                    )}
                                    {!loading && !error && (
                                        <div className="posts-list__body">
                                            {data?.blogs?.items?.map((blog: any) => (
                                                <div key={blog.id} className="posts-list__item">
                                                    <div className="post-card post-card--layout--grid">
                                                        <div className="post-card__image">
                                                            <AppLink href={`/blog/${blog.slug}`}>
                                                                <AppImage src={blog.featuredImage?.preview || blog.featuredImage?.source || '/images/posts/post-1.jpg'} />
                                                            </AppLink>
                                                        </div>
                                                        <div className="post-card__content">
                                                            <div className="post-card__title">
                                                                <h2>
                                                                    <AppLink href={`/blog/${blog.slug}`}>
                                                                        {blog.title}
                                                                    </AppLink>
                                                                </h2>
                                                            </div>
                                                            <div className="post-card__date">
                                                                {blog.author ? `By ${blog.author} • ` : ''}
                                                                {new Date(blog.createdAt).toLocaleDateString()}
                                                                {blog.readingTime ? ` • ${blog.readingTime} min read` : ''}
                                                            </div>
                                                            <div className="post-card__excerpt">
                                                                <div className="typography">
                                                                    {blog.excerpt}
                                                                </div>
                                                            </div>
                                                            <div className="post-card__more">
                                                                <AppLink href={`/blog/${blog.slug}`} className="btn btn-secondary btn-sm">
                                                                    Read more
                                                                </AppLink>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="posts-view__pagination">
                                    <Pagination current={page} siblings={1} total={totalPages} onPageChange={setPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

// noinspection JSUnusedGlobalSymbols
BlogListPage.Layout = React.Fragment as unknown as React.ComponentType;

export default BlogListPage;


