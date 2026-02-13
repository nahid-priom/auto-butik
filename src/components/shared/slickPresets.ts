/**
 * Single source of truth for homepage carousel (react-slick) settings.
 * Used by BlockProductsCarousel, BlockSale, and BlockPosts.
 */

import type { ISlickProps } from '~/components/shared/AppSlick';

/** Breakpoints (max-width in px). Align with Bootstrap where used in SCSS. */
export const BREAKPOINTS = {
    XL: 1399,
    LG: 991,
    MD: 767,
    SM: 576,
    XS: 360,
} as const;

/** Shared base config for all carousels (no responsive; presets add it). */
const BASE_CONFIG: Pick<ISlickProps, 'speed' | 'swipeToSlide' | 'touchThreshold' | 'adaptiveHeight' | 'infinite'> = {
    speed: 400,
    swipeToSlide: true,
    touchThreshold: 8,
    adaptiveHeight: false,
    infinite: true,
};

/** Shallow merge overrides onto base without mutating. */
function mergeSettings(base: ISlickProps, overrides: Partial<ISlickProps>): ISlickProps {
    return { ...base, ...overrides };
}

/**
 * Product carousel preset: desktop 5, iPad 3, mobile 2.
 * Used by Featured products (BlockProductsCarousel) and Special offers (BlockSale).
 */
export function productGrid5Preset(overrides: Partial<ISlickProps> = {}): ISlickProps {
    const preset: ISlickProps = {
        ...BASE_CONFIG,
        arrows: false,
        dots: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: BREAKPOINTS.SM, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ],
    };
    return mergeSettings(preset, overrides);
}

/**
 * Posts carousel preset (list layout: 2 on desktop, 1 on tablet/mobile).
 * Used by Latest news (BlockPosts).
 * Mobile (≤576px): 1 item.
 */
export function postsListPreset(overrides: Partial<ISlickProps> = {}): ISlickProps {
    const preset: ISlickProps = {
        ...BASE_CONFIG,
        arrows: false,
        dots: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [
            { breakpoint: BREAKPOINTS.LG, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: BREAKPOINTS.SM, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };
    return mergeSettings(preset, overrides);
}
