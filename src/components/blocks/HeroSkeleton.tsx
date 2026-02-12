// react
import React from 'react';
// application
import BlockSkeleton from '~/components/shared/BlockSkeleton';

/**
 * Lightweight hero shell for instant first paint on homepage.
 * Replaced by BlockVehicleSearchHero when it loads.
 */
function HeroSkeleton() {
    return (
        <div className="block-vehicle-search-hero block-vehicle-search-hero--skeleton">
            <div className="block-vehicle-search-hero__inner">
                <div className="container">
                    <div className="block-vehicle-search-hero__content">
                        <div className="block-vehicle-search-hero__title-skeleton" style={{ marginBottom: 12 }}>
                            <BlockSkeleton minHeight={42} className="block-vehicle-search-hero__title-skeleton-bar" />
                        </div>
                        <div className="block-vehicle-search-hero__subtitle-skeleton" style={{ marginBottom: 32 }}>
                            <BlockSkeleton minHeight={20} className="block-vehicle-search-hero__subtitle-skeleton-bar" />
                        </div>
                        <div className="block-vehicle-search-hero__form-skeleton">
                            <BlockSkeleton minHeight={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSkeleton;
