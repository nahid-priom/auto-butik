// react
import React, { useEffect, useRef, useState } from 'react';
// application
import { usePageLoad } from '~/store/page-load/pageLoadHooks';
import { useLoadingTracker } from '~/store/loading-tracker/loadingTrackerHooks';
import {
    pageLoadFinishWhenCriticalReady,
    pageLoadProgress,
    pageLoadStart,
} from '~/store/page-load/pageLoadActions';
import { useAppAction } from '~/store/hooks';

const BAR_HEIGHT = 3;
const REDUCED_MOTION_MEDIA = '(prefers-reduced-motion: reduce)';
const PROGRESS_EASE_INTERVAL_MS = 180;
const PROGRESS_STEP = 3;
const PROGRESS_CAP_PENDING = 90;
const FINISH_DELAY_MS = 200;

function TopLoader() {
    const { progressPercent, visible } = usePageLoad();
    const { isLoading } = useLoadingTracker();
    const [reducedMotion, setReducedMotion] = useState(false);
    const progressRef = useRef(progressPercent);
    const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevLoadingRef = useRef(false);

    progressRef.current = progressPercent;

    const pageLoadStartAction = useAppAction(pageLoadStart);
    const pageLoadProgressAction = useAppAction(pageLoadProgress);
    const pageLoadFinishAction = useAppAction(pageLoadFinishWhenCriticalReady);

    // Respect reduced motion
    useEffect(() => {
        const mql = window.matchMedia ? window.matchMedia(REDUCED_MOTION_MEDIA) : null;
        if (!mql) return;
        setReducedMotion(mql.matches);
        const handler = () => setReducedMotion(mql.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    // Show bar as soon as loading starts (route or first API request)
    useEffect(() => {
        if (isLoading && !visible) {
            pageLoadStartAction();
        }
    }, [isLoading, visible, pageLoadStartAction]);

    // While loading: ease progress upward (10 -> ~70 -> 90), never 100 until done
    useEffect(() => {
        if (reducedMotion || !visible || !isLoading) return;
        const id = setInterval(() => {
            const current = progressRef.current;
            if (current < PROGRESS_CAP_PENDING) {
                const next = Math.min(PROGRESS_CAP_PENDING, current + PROGRESS_STEP);
                pageLoadProgressAction(next);
            }
        }, PROGRESS_EASE_INTERVAL_MS);
        tickRef.current = id;
        return () => {
            if (tickRef.current != null) clearInterval(tickRef.current);
        };
    }, [visible, isLoading, reducedMotion, pageLoadProgressAction]);

    // When loading ends: jump to 100% and fade out
    useEffect(() => {
        if (reducedMotion) return;
        const wasLoading = prevLoadingRef.current;
        prevLoadingRef.current = isLoading;
        if (wasLoading && !isLoading && visible) {
            pageLoadFinishAction();
        }
    }, [isLoading, visible, reducedMotion, pageLoadFinishAction]);

    if (!visible && progressPercent >= 100) return null;

    const style: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: BAR_HEIGHT,
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        opacity: visible ? 1 : 0,
        transition: reducedMotion ? 'none' : 'opacity 0.2s ease-out',
    };

    const barStyle: React.CSSProperties = {
        height: '100%',
        width: `${Math.min(100, Math.max(0, progressPercent))}%`,
        backgroundColor: 'var(--top-loader-color, #ff3333)',
        transition: reducedMotion ? 'none' : 'width 0.2s ease-out',
    };

    return (
        <div className="top-loader" style={style} aria-hidden>
            <div style={barStyle} />
        </div>
    );
}

export default React.memo(TopLoader);
