import React from "react";
import classNames from "classnames";

interface ProductSectionEmptyProps {
    /** Short message shown under the icon */
    message?: string;
    className?: string;
}

const defaultMessage = "Ingen information tillgänglig för denna produkt.";

/** Empty state for product info sections when no data is available */
const ProductSectionEmpty: React.FC<ProductSectionEmptyProps> = ({
    message = defaultMessage,
    className,
}) => (
    <div className={classNames("product-section-empty", className)} role="status" aria-label={message}>
        <div className="product-section-empty__icon">
            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
            >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.15" />
                <path
                    d="M32 20v24M20 32h24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.4"
                />
                <path
                    d="M26 26l12 12M38 26L26 38"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.35"
                />
            </svg>
        </div>
        <p className="product-section-empty__message">{message}</p>
    </div>
);

export default ProductSectionEmpty;
