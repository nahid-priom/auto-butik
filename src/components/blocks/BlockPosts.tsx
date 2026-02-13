// react
import React, { useRef, useState, useMemo, useCallback } from 'react';
// third-party
import classNames from 'classnames';
import Slick from 'react-slick';
// application
import AppSlick, { ISlickProps } from '~/components/shared/AppSlick';
import { postsListPreset } from '~/components/shared/slickPresets';
import PostCard from '~/components/shared/PostCard';
import SectionHeader from '~/components/shared/SectionHeader';
import { ILink } from '~/interfaces/link';
import { IPost } from '~/interfaces/post';

export type IBlockPostsCarouselLayout = 'grid' | 'list';

/** Tab group for news: id maps to category filter */
export interface IBlockPostsTabGroup {
    id: string;
    name: string;
}

/** Maps tab id to post category filter (post included if any category matches) */
export function filterPostsByTabId(posts: IPost[], tabId: string): IPost[] {
    const lower = tabId.toLowerCase();
    return posts.filter((post) => {
        const cats = post.categories || [];
        if (lower === 'special') {
            return cats.some((c) => c === 'Special Offers');
        }
        if (lower === 'news') {
            return cats.some((c) => c === 'Latest News' || c === 'New Arrivals');
        }
        if (lower === 'reviews' || lower === 'recensioner') {
            return cats.some((c) => c === 'Recensioner' || c.toLowerCase().includes('review'));
        }
        return true;
    });
}

interface Props {
    blockTitle: React.ReactNode;
    layout: IBlockPostsCarouselLayout;
    posts: IPost[];
    loading?: boolean;
    error?: string | null;
    retry?: () => void;
    /** Tab groups (e.g. Specialerbjudanden, Nyheter, Recensioner); when set, links are not used and posts are filtered by tab */
    tabGroups?: IBlockPostsTabGroup[];
    defaultTabId?: string;
    /** Legacy: link labels when no tab groups */
    links?: ILink[];
}

const slickSettings: Record<IBlockPostsCarouselLayout, ISlickProps> = {
    grid: {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    },
    list: postsListPreset(),
};

const SKELETON_COUNT = 2;

function BlockPosts(props: Props) {
    const {
        blockTitle,
        layout,
        posts: allPosts = [],
        loading = false,
        error = null,
        retry,
        tabGroups = [],
        defaultTabId,
        links = [],
    } = props;
    const slickRef = useRef<Slick>(null);
    const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabGroups[0]?.id ?? ''));
    const [tabTransitioning, setTabTransitioning] = useState(false);

    const currentGroup = useMemo(
        () => tabGroups.find((g) => g.id === activeTabId) || tabGroups[0],
        [tabGroups, activeTabId],
    );

    const filteredPosts = useMemo(
        () => (tabGroups.length > 0 ? filterPostsByTabId(allPosts, activeTabId) : allPosts),
        [allPosts, activeTabId, tabGroups.length],
    );

    const handleGroupChange = useCallback(
        (group: IBlockPostsTabGroup) => {
            if (group.id === activeTabId) return;
            setTabTransitioning(true);
            setActiveTabId(group.id);
            window.setTimeout(() => setTabTransitioning(false), 220);
        },
        [activeTabId],
    );

    const handleNextClick = () => {
        if (slickRef.current) slickRef.current.slickNext();
    };

    const handlePrevClick = () => {
        if (slickRef.current) slickRef.current.slickPrev();
    };

    const showSkeleton = loading || tabTransitioning;
    const showContent = !error && !showSkeleton;

    const rootClasses = classNames('block', 'block-posts-carousel', `block-posts-carousel--layout--${layout}`, {
        'block-posts-carousel--loading': showSkeleton,
        'block-posts-carousel--error': error,
    });

    return (
        <div className={rootClasses}>
            <div className="container">
                <SectionHeader
                    sectionTitle={blockTitle}
                    arrows={!error}
                    groups={tabGroups}
                    currentGroup={currentGroup}
                    onChangeGroup={handleGroupChange}
                    links={tabGroups.length === 0 ? links : []}
                    onNext={handleNextClick}
                    onPrev={handlePrevClick}
                />
                {error && (
                    <div className="block-posts-carousel__error">
                        <p className="block-posts-carousel__error-message">{error}</p>
                        {retry && (
                            <button type="button" className="btn btn-primary btn-sm" onClick={retry}>
                                Försök igen
                            </button>
                        )}
                    </div>
                )}
                {showSkeleton && (
                    <div className="block-posts-carousel__skeleton">
                        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <div key={i} className="block-posts-carousel__skeleton-card">
                                <div className="block-posts-carousel__skeleton-image" />
                                <div className="block-posts-carousel__skeleton-content">
                                    <div className="block-posts-carousel__skeleton-line block-posts-carousel__skeleton-line--title" />
                                    <div className="block-posts-carousel__skeleton-line block-posts-carousel__skeleton-line--short" />
                                    <div className="block-posts-carousel__skeleton-line block-posts-carousel__skeleton-line--medium" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showContent && (
                    <div
                        className={classNames('block-posts-carousel__carousel', {
                            'block-posts-carousel__carousel--has-items': filteredPosts.length > 0,
                        })}
                    >
                        <div className="block-posts-carousel__carousel-loader" />
                        {filteredPosts.length > 0 ? (
                            <AppSlick ref={slickRef} {...slickSettings[layout]}>
                                {filteredPosts.map((post) => (
                                    <div key={post.id} className="block-posts-carousel__item">
                                        <PostCard post={post} layout={layout === 'list' ? 'list' : 'grid'} />
                                    </div>
                                ))}
                            </AppSlick>
                        ) : (
                            <div className="block-posts-carousel__empty">
                                <p>Inga inlägg i denna kategori.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(BlockPosts);
