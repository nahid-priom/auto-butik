// react
import React, { useCallback, useMemo, useState } from 'react';
// application
import { baseUrl } from '~/services/utils';

const PLACEHOLDER_SRC = '/placeholder.avif';

export interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    /** Product image URL; falsy or failed load shows /placeholder.avif */
    src?: string | null;
    /** Prefer loading="eager" for above-the-fold images (e.g. PDP main) */
    priority?: boolean;
}

const ProductImage = React.forwardRef<HTMLImageElement, ProductImageProps>((props, ref) => {
    const { src, alt = '', className, loading, priority = false, onError, ...rest } = props;

    const [loadFailed, setLoadFailed] = useState(false);

    const effectiveSrc = useMemo(() => {
        const raw = loadFailed || !src || (typeof src === 'string' && src.trim() === '') ? PLACEHOLDER_SRC : src;
        return raw ? baseUrl(raw) : PLACEHOLDER_SRC;
    }, [src, loadFailed]);

    const handleError = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const img = e.currentTarget;
            if (img.src && img.src.indexOf('placeholder.avif') === -1) {
                setLoadFailed(true);
            }
            onError?.(e);
        },
        [onError]
    );

    return (
        <img
            {...rest}
            ref={ref}
            alt={alt}
            className={className}
            src={effectiveSrc}
            loading={loading ?? (priority ? 'eager' : 'lazy')}
            decoding="async"
            onError={handleError}
        />
    );
});

ProductImage.displayName = 'ProductImage';

export default ProductImage;
