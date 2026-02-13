// react
import React, { useEffect, useMemo, useRef } from 'react';
// third-party
import classNames from 'classnames';
import Slick from 'react-slick';
// application
import AppSlick, { ISlickProps } from '~/components/shared/AppSlick';
import { productGrid5Preset } from '~/components/shared/slickPresets';
import ProductCard, { IProductCardElement, IProductCardLayout } from '~/components/shared/ProductCard';
import SectionHeader, { ISectionHeaderGroup } from '~/components/shared/SectionHeader';
import { ILink } from '~/interfaces/link';
import { IProduct } from '~/interfaces/product';
import { makeUniqueKeys } from '~/utils/reactKeys';

export type IBlockProductsCarouselLayout =
    'grid-4' |
    'grid-4-sidebar' |
    'grid-5' |
    'grid-6' |
    'horizontal' |
    'horizontal-sidebar';

interface Props<T extends ISectionHeaderGroup> {
    blockTitle: React.ReactNode;
    products: IProduct[];
    layout: IBlockProductsCarouselLayout;
    groups?: T[];
    currentGroup?: T;
    links?: ILink[];
    rows?: number;
    loading?: boolean;
    onChangeGroup?: (group: T) => void;
    /** Use compact product cards (homepage carousel: fixed height, no overflow) */
    compactCards?: boolean;
}

const productCardLayoutMap: Record<IBlockProductsCarouselLayout, IProductCardLayout> = {
    'grid-4': 'grid',
    'grid-4-sidebar': 'grid',
    'grid-5': 'grid',
    'grid-6': 'grid',
    horizontal: 'horizontal',
    'horizontal-sidebar': 'horizontal',
};

const productCardExcludeMap: Record<IProductCardLayout, IProductCardElement[]> = {
    grid: ['features', 'list-buttons'],
    list: [],
    horizontal: ['actions', 'status-badge', 'features', 'buttons', 'meta'],
    table: [],
};

const slickSettings: Record<IBlockProductsCarouselLayout, ISlickProps> = {
    'grid-4': {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            { breakpoint: 991, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 360, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    },
    'grid-4-sidebar': {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    },
    'grid-5': productGrid5Preset(),
    'grid-6': {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 6,
        slidesToScroll: 6,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 991, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 360, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    },
    horizontal: {
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
    'horizontal-sidebar': {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    },
};

function BlockProductsCarousel<T extends ISectionHeaderGroup>(props: Props<T>) {
    const {
        blockTitle,
        products,
        layout,
        groups,
        currentGroup,
        links,
        rows = 1,
        loading = false,
        onChangeGroup,
        compactCards = false,
    } = props;
    const slickRef = useRef<Slick>(null);

    // Force Slick to recalc responsive breakpoints on mount and after paint (fixes initial empty/wrong slides when carousel mounts)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const fireResize = () => window.dispatchEvent(new Event('resize'));
        const t1 = setTimeout(fireResize, 0);
        const t2 = setTimeout(fireResize, 150);
        const t3 = setTimeout(fireResize, 450);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const handleNextClick = () => {
        if (slickRef.current) {
            slickRef.current.slickNext();
        }
    };

    const handlePrevClick = () => {
        if (slickRef.current) {
            slickRef.current.slickPrev();
        }
    };

    const columns = useMemo(() => {
        const result = [];

        if (rows > 0) {
            const productsQueue = products.slice();

            while (productsQueue.length > 0) {
                result.push(productsQueue.splice(0, rows));
            }
        }

        return result;
    }, [rows, products]);

    const productKeyMap = useMemo(() => {
        const withKeys = makeUniqueKeys(
            products,
            (p, i) => String(p.id ?? p.slug ?? "") || `p-${i}`,
            { prefix: "related", reportLabel: "BlockProductsCarousel.products" }
        );
        const map = new Map<IProduct, string>();
        withKeys.forEach(({ item, key }) => map.set(item, key));
        return map;
    }, [products]);

    const carousel = useMemo(() => {
        const productCardLayout = productCardLayoutMap[layout];
        const productCardExclude = productCardExcludeMap[productCardLayout];

        return (
            <AppSlick ref={slickRef} {...slickSettings[layout]}>
                {columns.map((column, columnIdx) => (
                    <div key={columnIdx} className="block-products-carousel__column">
                        {column.map((product, productIdx) => (
                            <ProductCard
                                key={productKeyMap.get(product) ?? `col-${columnIdx}-${productIdx}`}
                                className="block-products-carousel__cell"
                                product={product}
                                layout={productCardLayout}
                                exclude={productCardExclude}
                                compact={compactCards}
                            />
                        ))}
                    </div>
                ))}
            </AppSlick>
        );
    }, [columns, layout, productKeyMap, compactCards]);

    return (
        <div className="block block-products-carousel" data-layout={layout}>
            <div className="container">
                <SectionHeader
                    sectionTitle={blockTitle}
                    arrows
                    groups={groups}
                    currentGroup={currentGroup}
                    links={links}
                    onNext={handleNextClick}
                    onPrev={handlePrevClick}
                    onChangeGroup={onChangeGroup}
                />

                <div
                    className={classNames('block-products-carousel__carousel', {
                        'block-products-carousel__carousel--loading': loading,
                        'block-products-carousel__carousel--has-items': columns.length > 0,
                    })}
                >
                    <div className="block-products-carousel__carousel-loader" />

                    {carousel}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockProductsCarousel) as typeof BlockProductsCarousel;
