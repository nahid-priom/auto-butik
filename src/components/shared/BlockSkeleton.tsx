// react
import React from 'react';

interface BlockSkeletonProps {
    /** Minimum height in px for layout stability */
    minHeight?: number;
    className?: string;
}

function BlockSkeleton({ minHeight = 180, className = '' }: BlockSkeletonProps) {
    return (
        <div
            className={`block-skeleton ${className}`.trim()}
            style={{ minHeight }}
            aria-hidden
        >
            <div className="block-skeleton__shimmer" />
        </div>
    );
}

export default React.memo(BlockSkeleton);
