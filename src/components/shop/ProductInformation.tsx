import React from "react";
import { FormattedMessage } from "react-intl";
import { TechnicalSpec } from "~/interfaces/tecdoc";
import ProductSectionEmpty from "~/components/shop/ProductSectionEmpty";

interface ProductInformationProps {
    productName?: string;
    technicalSpecs?: TechnicalSpec[];
    isLoading?: boolean;
}

const ProductInformation: React.FC<ProductInformationProps> = ({
    productName = "",
    technicalSpecs = [],
    isLoading = false,
}) => {
    // Loading skeleton
    if (isLoading) {
        return (
            <div className="product-information-section">
                <h2 className="section-title">
                    <FormattedMessage id="TECHNICAL_INFORMATION_TITLE" values={{ productName }} />
                </h2>
                <div className="product-info-grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="info-row">
                            <div className="info-key skeleton-text" style={{ width: "60%", height: "1rem", backgroundColor: "#e0e0e0", borderRadius: "4px" }} />
                            <div className="info-value skeleton-text" style={{ width: "30%", height: "1rem", backgroundColor: "#e0e0e0", borderRadius: "4px" }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state - show friendly "no info" message
    if (!technicalSpecs || technicalSpecs.length === 0) {
        return (
            <div className="product-information-section">
                <h2 className="section-title">
                    <FormattedMessage id="TECHNICAL_INFORMATION_TITLE" values={{ productName }} />
                </h2>
                <ProductSectionEmpty message="Ingen teknisk information tillgänglig för denna produkt." />
            </div>
        );
    }

    return (
        <div className="product-information-section">
            <h2 className="section-title">
                <FormattedMessage id="TECHNICAL_INFORMATION_TITLE" values={{ productName }} />
            </h2>
            <div className="product-info-grid">
                {technicalSpecs.map((spec, index) => (
                    <div key={index} className="info-row">
                        <div className="info-key">{spec.name}</div>
                        <div className="info-value">{spec.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductInformation;
