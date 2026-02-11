// react
import React, { useState, useMemo, useEffect } from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import { IBrand } from '~/interfaces/brand';
import { ArrowRoundedLeft6x9Svg, ArrowRoundedRight6x9Svg } from '~/svg';

const MOBILE_BREAKPOINT = 768;

export type IBlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar';

interface Props {
    layout: IBlockBrandsLayout;
    brands: IBrand[];
    blockTitle?: string;
}

const BRANDS_PER_PAGE = 24; // 8 columns × 3 rows

function renderBrandList(brands: IBrand[], listClassName: string) {
    return (
        <ul className={listClassName} aria-hidden="true">
            {brands.map((brand, brandIdx) => (
                <li key={brandIdx} className="block-brands__item">
                    <AppLink href="/" className="block-brands__item-link">
                        <span className="block-brands__item-image">
                            <AppImage src={brand.image} alt={brand.name} />
                        </span>
                        <span className="block-brands__item-name">{brand.name}</span>
                    </AppLink>
                </li>
            ))}
        </ul>
    );
}

function BlockBrands(props: Props) {
    const { layout, brands, blockTitle } = props;
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const totalPages = Math.ceil(brands.length / BRANDS_PER_PAGE);
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

    const isMarquee = layout === 'columns-8-full';

    return (
        <div className={`block block-brands block-brands--layout--${layout}`}>
            <div className="container">
                {blockTitle && (
                    <div className="block-header">
                        <h3 className="block-header__title">{blockTitle}</h3>
                    </div>
                )}

                {isMarquee ? (
                    <div className="block-brands__marquee" aria-label="Popular manufacturers">
                        <div className={`block-brands__marquee-track ${isMobile ? 'block-brands__marquee-track--rows-3' : ''}`}>
                            {(() => {
                                const rowCount = isMobile ? 3 : 2;
                                const chunk = Math.ceil(brands.length / rowCount);
                                const rows = Array.from({ length: rowCount }, (_, i) =>
                                    brands.slice(i * chunk, (i + 1) * chunk)
                                );
                                return (
                                    <>
                                        <div key="group-1" className="block-brands__marquee-group">
                                            {rows.map((rowBrands, rowIdx) => (
                                                <div key={rowIdx} className="block-brands__marquee-row">
                                                    {renderBrandList(rowBrands, 'block-brands__list block-brands__list--marquee')}
                                                </div>
                                            ))}
                                        </div>
                                        <div key="group-2" className="block-brands__marquee-group">
                                            {rows.map((rowBrands, rowIdx) => (
                                                <div key={rowIdx} className="block-brands__marquee-row">
                                                    {renderBrandList(rowBrands, 'block-brands__list block-brands__list--marquee')}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="block-brands__marquee-fade block-brands__marquee-fade--left" aria-hidden="true" />
                        <div className="block-brands__marquee-fade block-brands__marquee-fade--right" aria-hidden="true" />
                    </div>
                ) : (
                    <>
                        <div className="block-brands__wrapper">
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
                    </>
                )}
            </div>
        </div>
    );
}

export default React.memo(BlockBrands);
