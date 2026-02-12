// react
import React, { useEffect, useRef, useState } from 'react';
// application
import BlockSkeleton from '~/components/shared/BlockSkeleton';

const IDLE_DELAY_MS = 400;
const ROOT_MARGIN = '120px';

interface LazySectionProps {
    children: React.ReactNode;
    /** Skeleton min-height for layout stability */
    minHeight?: number;
    /** Skip IntersectionObserver and render after idle delay (e.g. for SSR) */
    useIdleOnly?: boolean;
}

/**
 * Renders children inside Suspense when the section is near the viewport
 * (or after a short idle delay). Shows a skeleton until then for layout stability.
 */
function LazySection({ children, minHeight = 180, useIdleOnly = false }: LazySectionProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shouldRender) return;

        const trigger = () => setShouldRender(true);

        if (useIdleOnly || typeof window === 'undefined') {
            const id = setTimeout(trigger, IDLE_DELAY_MS);
            return () => clearTimeout(id);
        }

        const el = ref.current;
        if (!el) {
            setTimeout(trigger, IDLE_DELAY_MS);
            return () => {};
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) trigger();
            },
            { rootMargin: ROOT_MARGIN, threshold: 0 }
        );
        observer.observe(el);

        const idleTimer = setTimeout(trigger, IDLE_DELAY_MS * 2);
        return () => {
            observer.disconnect();
            clearTimeout(idleTimer);
        };
    }, [shouldRender, useIdleOnly]);

    if (!shouldRender) {
        return (
            <div ref={ref}>
                <BlockSkeleton minHeight={minHeight} />
            </div>
        );
    }

    return <>{children}</>;
}

export default React.memo(LazySection);
