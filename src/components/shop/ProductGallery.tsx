// react
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
// third-party
import classNames from 'classnames';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import Slick from 'react-slick';
// application
import ProductImage from '~/components/shared/ProductImage';
import AppLink from '~/components/shared/AppLink';
import AppSlick, { ISlickProps } from '~/components/shared/AppSlick';
import { baseUrl } from '~/services/utils';
import { useDirection } from '~/services/i18n/hooks';
import { makeUniqueKeys } from '~/utils/reactKeys';
import { ZoomIn24Svg } from '~/svg';

const PLACEHOLDER_SRC = '__placeholder__';

/** URLs that should be treated as "no image" and show our custom placeholder instead */
const PLACEHOLDER_URL_PATTERNS = ['product-placeholder', 'placeholder.jpg', 'placeholder.png', 'placeholder.avif'];

function isPlaceholderOrEmptyUrl(url: string): boolean {
    if (!url || typeof url !== 'string' || url.trim() === '' || url === PLACEHOLDER_SRC) return true;
    const normalized = url.toLowerCase();
    return PLACEHOLDER_URL_PATTERNS.some((p) => normalized.includes(p));
}

const GALLERY_PLACEHOLDER_AVIF = '/placeholder.avif';

/** Renders image or /placeholder.avif on load error or when no image */
function GalleryImageWithFallback({
    src,
    index,
    imagesRefs,
    className,
    dataWidth,
    dataHeight,
    isPlaceholder,
    setRef = true,
    priority = false,
}: {
    src: string;
    index: number;
    imagesRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
    className?: string;
    dataWidth?: string;
    dataHeight?: string;
    isPlaceholder: boolean;
    setRef?: boolean;
    priority?: boolean;
}) {
    const showPlaceholderImg = isPlaceholder || isPlaceholderOrEmptyUrl(src);
    const displaySrc = showPlaceholderImg ? GALLERY_PLACEHOLDER_AVIF : src;

    return (
        <ProductImage
            className={className}
            src={displaySrc}
            ref={setRef ? (el) => { if (el) imagesRefs.current[index] = el; } : undefined}
            priority={priority}
            {...(dataWidth != null && { 'data-width': dataWidth })}
            {...(dataHeight != null && { 'data-height': dataHeight })}
        />
    );
}

type CreateGalleryFn = (
    images: PhotoSwipe.Item[],
    options: PhotoSwipe.Options,
) => PhotoSwipe<PhotoSwipeUIDefault.Options>;

export type IProductGalleryLayout = 'product-sidebar' | 'product-full' | 'quickview';

interface Props extends React.HTMLAttributes<HTMLElement> {
    images: string[];
    layout: IProductGalleryLayout;
}

const slickSettingsFeatured = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
};

const slickSettingsThumbnails: Record<IProductGalleryLayout, ISlickProps> = {
    'product-sidebar': {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 8,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 6 } },
            { breakpoint: 1199, settings: { slidesToShow: 8 } },
            { breakpoint: 991, settings: { slidesToShow: 8 } },
            { breakpoint: 767, settings: { slidesToShow: 6 } },
            { breakpoint: 575, settings: { slidesToShow: 5 } },
            { breakpoint: 419, settings: { slidesToShow: 4 } },
        ],
    },
    'product-full': {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1399, settings: { slidesToShow: 5 } },
            { breakpoint: 1199, settings: { slidesToShow: 7 } },
            { breakpoint: 991, settings: { slidesToShow: 5 } },
            { breakpoint: 767, settings: { slidesToShow: 6 } },
            { breakpoint: 575, settings: { slidesToShow: 5 } },
            { breakpoint: 419, settings: { slidesToShow: 4 } },
        ],
    },
    quickview: {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 991, settings: { slidesToShow: 6 } },
            { breakpoint: 519, settings: { slidesToShow: 5 } },
            { breakpoint: 439, settings: { slidesToShow: 4 } },
            { breakpoint: 339, settings: { slidesToShow: 3 } },
        ],
    },
};

/** Build normalized gallery list: valid URLs only, same order; first = cover. Empty list becomes single placeholder. */
function useGalleryImages(images: string[]): { galleryImages: string[]; hasRealImages: boolean } {
    const galleryImages = React.useMemo(() => {
        const valid = images.filter(
            (url): url is string =>
                typeof url === 'string' && url.trim() !== '' && !isPlaceholderOrEmptyUrl(url)
        );
        return valid.length > 0 ? valid : [PLACEHOLDER_SRC];
    }, [images]);
    const hasRealImages = galleryImages.length > 0 && galleryImages[0] !== PLACEHOLDER_SRC;
    return { galleryImages, hasRealImages };
}

function ProductGallery(props: Props) {
    const {
        images,
        layout,
        className,
        ...rootProps
    } = props;
    const direction = useDirection();
    const { galleryImages, hasRealImages } = useGalleryImages(images);
    const [state, setState] = useState({ currentIndex: 0, transition: false });
    const imagesRefs = useRef<Array<HTMLImageElement | null>>([]);
    const slickFeaturedRef = useRef<Slick>(null);
    const createGalleryRef = useRef<Promise<CreateGalleryFn> | null>(null);
    const galleryRef = useRef<PhotoSwipe<PhotoSwipeUIDefault.Options> | null>(null);
    const getIndexDependOnDirRef = useRef<((index: number) => number) | null>(null);
    const unmountedRef = useRef(false);

    const realImages = hasRealImages ? galleryImages : [];

    const getIndexDependOnDir = useCallback((index: number) => {
        // we need to invert index id direction === 'rtl' due to react-slick bug
        if (direction === 'rtl') {
            return galleryImages.length - 1 - index;
        }

        return index;
    }, [direction, galleryImages.length]);

    const openPhotoswipe = (index: number) => {
        if (!createGalleryRef.current) {
            return;
        }

        // Build items only from slides with valid image refs (skip placeholders / failed loads)
        const itemsWithIndex: Array<{ src: string; msrc: string; w: number; h: number; originalIndex: number }> = [];
        imagesRefs.current.forEach((tag, i) => {
            if (!tag || i >= realImages.length || realImages[i] === PLACEHOLDER_SRC) return;
            const width = (tag.dataset.width ? parseFloat(tag.dataset.width) : null) || tag.naturalWidth || 700;
            const height = (tag.dataset.height ? parseFloat(tag.dataset.height) : null) || tag.naturalHeight || 700;
            itemsWithIndex.push({
                src: baseUrl(realImages[i]),
                msrc: baseUrl(realImages[i]),
                w: width,
                h: height,
                originalIndex: i,
            });
        });

        const items = itemsWithIndex.map(({ originalIndex, ...rest }) => rest);
        const originalIndices = itemsWithIndex.map((x) => x.originalIndex);

        if (items.length === 0) return;

        if (direction === 'rtl') {
            items.reverse();
            originalIndices.reverse();
        }

        const photoSwipeIndex = Math.max(
            0,
            originalIndices.indexOf(getIndexDependOnDir(index))
        );

        // noinspection JSUnusedGlobalSymbols
        const options: PhotoSwipe.Options = {
            getThumbBoundsFn: (psIndex: number) => {
                if (!getIndexDependOnDirRef.current) {
                    return { x: 0, y: 0, w: 0 };
                }
                const originalIndex = originalIndices[psIndex];
                if (originalIndex === undefined) return { x: 0, y: 0, w: 0 };
                const dirDependentIndex = getIndexDependOnDirRef.current(originalIndex);
                const tag = imagesRefs.current[dirDependentIndex];
                if (!tag) return { x: 0, y: 0, w: 0 };
                const width = tag.naturalWidth;
                const height = tag.naturalHeight;
                const rect = tag.getBoundingClientRect();
                const ration = Math.min(rect.width / width, rect.height / height);
                const fitWidth = width * ration;
                return {
                    x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
                    y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
                    w: fitWidth,
                };
            },
            index: photoSwipeIndex,
            bgOpacity: 0.9,
            history: false,
        };

        createGalleryRef.current.then((createGallery) => {
            // IMPORTANT: Inside this function, we can use variables and functions only through ref.

            if (unmountedRef.current) {
                return;
            }

            galleryRef.current = createGallery(items, options);
            galleryRef.current.listen('beforeChange', () => {
                if (galleryRef.current && slickFeaturedRef.current) {
                    slickFeaturedRef.current.slickGoTo(
                        galleryRef.current.getCurrentIndex(),
                        true,
                    );
                }
            });
            galleryRef.current.listen('destroy', () => {
                galleryRef.current = null;
            });

            galleryRef.current.init();
        });
    };

    const handleFeaturedClick = (event: React.MouseEvent, index: number) => {
        if (!createGalleryRef.current || layout === 'quickview') {
            return;
        }

        event.preventDefault();

        openPhotoswipe(index);
    };

    const handleThumbnailClick = (index: number) => {
        if (state.transition) {
            return;
        }
        const safeIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
        setState((prev) => ({ ...prev, currentIndex: safeIndex }));

        if (slickFeaturedRef.current) {
            slickFeaturedRef.current.slickGoTo(getIndexDependOnDir(safeIndex));
        }
    };

    const handleFeaturedBeforeChange: ISlickProps['beforeChange'] = (oldIndex, newIndex) => {
        const clamped = Math.max(0, Math.min(newIndex, galleryImages.length - 1));
        setState((prev) => ({
            ...prev,
            currentIndex: getIndexDependOnDir(clamped),
            transition: true,
        }));
    };

    const handleFeaturedAfterChange: ISlickProps['afterChange'] = (index) => {
        const clamped = Math.max(0, Math.min(index, galleryImages.length - 1));
        setState((prev) => ({
            ...prev,
            currentIndex: getIndexDependOnDir(clamped),
            transition: false,
        }));
    };

    const handleZoomButtonClick = () => {
        openPhotoswipe(state.currentIndex);
    };

    // componentDidMount
    useEffect(() => {
        createGalleryRef.current = import('~/services/photoswipe').then((module) => module.default);
    }, []);

    // componentWillUnmount
    useEffect(() => {
        unmountedRef.current = false;

        return () => {
            if (galleryRef.current) {
                galleryRef.current.destroy();
            }

            unmountedRef.current = true;
        };
    }, []);

    useEffect(() => {
        // this is necessary to reset the transition state,
        // because when the direction changes, the afterChange event does not fire
        const timer = setTimeout(() => {
            setState((prev) => ({ ...prev, transition: false }));
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [direction]);

    useEffect(() => {
        getIndexDependOnDirRef.current = getIndexDependOnDir;
    }, [getIndexDependOnDir]);

    // Default featured image: when no dedicated featured image, use first thumbnail.
    // When gallery images change (e.g. new product), reset to first image so featured is never empty.
    useEffect(() => {
        setState((prev) => ({ ...prev, currentIndex: 0 }));
        const timer = setTimeout(() => {
            if (slickFeaturedRef.current != null) {
                slickFeaturedRef.current.slickGoTo(getIndexDependOnDir(0), true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [galleryImages.length, galleryImages[0], getIndexDependOnDir]);

    const rootClasses = classNames('product-gallery', `product-gallery--layout--${layout}`, className);
    const isPlaceholderSrc = (src: string) => src === PLACEHOLDER_SRC;

    return (
        <div className={rootClasses} data-layout={layout} {...rootProps}>
            <div className="product-gallery__featured">
                {hasRealImages && (
                    <button type="button" className="product-gallery__zoom" onClick={handleZoomButtonClick}>
                        <ZoomIn24Svg />
                    </button>
                )}

                <AppSlick
                    ref={slickFeaturedRef}
                    {...slickSettingsFeatured}
                    beforeChange={handleFeaturedBeforeChange}
                    afterChange={handleFeaturedAfterChange}
                >
                    {makeUniqueKeys(
                        galleryImages,
                        (url, i) => url || `img-${i}`,
                        { prefix: "gallery", reportLabel: "ProductGallery.featured" }
                    ).map(({ item: image, key: imageKey }, idx) => (
                        <div key={imageKey} className="image image--type--product">
                            {hasRealImages && !isPlaceholderSrc(image) ? (
                                <AppLink
                                    href={image}
                                    anchor
                                    className="image__body"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(event: React.MouseEvent) => handleFeaturedClick(event, idx)}
                                >
                                    <GalleryImageWithFallback
                                        src={image}
                                        index={idx}
                                        imagesRefs={imagesRefs}
                                        className="image__tag"
                                        dataWidth="700"
                                        dataHeight="700"
                                        isPlaceholder={false}
                                        setRef
                                        priority={idx === 0}
                                    />
                                </AppLink>
                            ) : (
                                <div className="image__body">
                                    <GalleryImageWithFallback
                                        src={image}
                                        index={idx}
                                        imagesRefs={imagesRefs}
                                        className="image__tag"
                                        dataWidth="700"
                                        dataHeight="700"
                                        isPlaceholder={true}
                                        setRef={false}
                                        priority={idx === 0}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </AppSlick>
            </div>
            <div className="product-gallery__thumbnails">
                <AppSlick {...slickSettingsThumbnails[layout]}>
                    {makeUniqueKeys(
                        galleryImages,
                        (url, i) => url || `img-${i}`,
                        { prefix: "galleryThumb", reportLabel: "ProductGallery.thumbnails" }
                    ).map(({ item: image, key: imageKey }, idx) => (
                        <button
                            type="button"
                            key={imageKey}
                            className={classNames('product-gallery__thumbnails-item', 'image image--type--product', {
                                'product-gallery__thumbnails-item--active': idx === state.currentIndex,
                            })}
                            onClick={() => handleThumbnailClick(idx)}
                        >
                            <div className="image__body">
                                <GalleryImageWithFallback
                                    src={image}
                                    index={idx}
                                    imagesRefs={imagesRefs}
                                    className="image__tag"
                                    isPlaceholder={isPlaceholderSrc(image)}
                                    setRef={false}
                                />
                            </div>
                        </button>
                    ))}
                </AppSlick>
            </div>
        </div>
    );
}

export default React.memo(ProductGallery);
