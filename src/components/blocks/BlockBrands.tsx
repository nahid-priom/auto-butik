// react
import React, { useState, useMemo } from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import { IBrand } from '~/interfaces/brand';
import { ArrowRoundedLeft6x9Svg, ArrowRoundedRight6x9Svg } from '~/svg';

export type IBlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar';

interface Props {
    layout: IBlockBrandsLayout;
    brands: IBrand[];
}

const BRANDS_PER_PAGE = 24; // 8 columns × 3 rows

function BlockBrands(props: Props) {
    const { layout, brands } = props;
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate total pages
    const totalPages = Math.ceil(brands.length / BRANDS_PER_PAGE);

    // Get brands for current page
    const visibleBrands = useMemo(() => {
        const startIdx = currentPage * BRANDS_PER_PAGE;
        const endIdx = startIdx + BRANDS_PER_PAGE;
        return brands.slice(startIdx, endIdx);
    }, [brands, currentPage]);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    return (
        <div className={`block block-brands block-brands--layout--${layout}`}>
            <div className="container">
                <div className="block-brands__wrapper">
                    {/* Navigation buttons */}
                    <button
                        type="button"
                        className="block-brands__arrow block-brands__arrow--prev"
                        onClick={handlePrevPage}
                        disabled={!canGoPrev}
                        aria-label="Previous brands"
                    >
                        <ArrowRoundedLeft6x9Svg />
                    </button>

                    <ul className="block-brands__list">
                        {visibleBrands.map((brand, brandIdx) => (
                            <React.Fragment key={brandIdx}>
                                <li className="block-brands__item">
                                    <AppLink href="/" className="block-brands__item-link">
                                        <AppImage src={brand.image} />
                                        <span className="block-brands__item-name">{brand.name}</span>
                                    </AppLink>
                                </li>
                                <li className="block-brands__divider" role="presentation" />
                            </React.Fragment>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="block-brands__arrow block-brands__arrow--next"
                        onClick={handleNextPage}
                        disabled={!canGoNext}
                        aria-label="Next brands"
                    >
                        <ArrowRoundedRight6x9Svg />
                    </button>
                </div>

                {/* Page indicator (optional) */}
                {totalPages > 1 && (
                    <div className="block-brands__pagination">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`block-brands__pagination-dot ${idx === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(idx)}
                                aria-label={`Go to page ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(BlockBrands);
