import React from "react";
import { FormattedMessage } from "react-intl";
import { OeReferenceGroup } from "~/interfaces/tecdoc";
import ProductSectionEmpty from "~/components/shop/ProductSectionEmpty";
import { makeUniqueKeys } from "~/utils/reactKeys";

interface OriginalPartNumberProps {
    productName?: string;
    oeReferences?: OeReferenceGroup[];
    isLoading?: boolean;
}

const OriginalPartNumber: React.FC<OriginalPartNumberProps> = ({
    productName = "",
    oeReferences = [],
    isLoading = false,
}) => {
    // Loading skeleton
    if (isLoading) {
        return (
            <div className="original-part-number">
                <h2 className="part-number-title">
                    <FormattedMessage id="OE_NUMBER_TITLE" />
                </h2>
                <div className="part-number-table-container">
                    <div className="part-number-table">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="table-row">
                                <div className="table-cell brand-cell">
                                    <span className="skeleton-text" style={{ width: "80px", height: "1rem", backgroundColor: "#e0e0e0", borderRadius: "4px", display: "inline-block" }} />
                                </div>
                                <div className="table-cell number-cell">
                                    <span className="skeleton-text" style={{ width: "200px", height: "1rem", backgroundColor: "#e0e0e0", borderRadius: "4px", display: "inline-block" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Empty state - show friendly "no info" message
    if (!oeReferences || oeReferences.length === 0) {
        return (
            <div className="original-part-number">
                <h2 className="part-number-title">
                    <FormattedMessage id="OE_NUMBER_TITLE" />
                </h2>
                <ProductSectionEmpty message="Inga originaldelsnummer tillgängliga för denna produkt." />
            </div>
        );
    }

    // Build title with product name if available
    const title = productName 
        ? `${productName} OE-nummer` 
        : <FormattedMessage id="OE_NUMBER_TITLE" />;

    return (
        <div className="original-part-number">
            <h2 className="part-number-title">{title}</h2>

            <div className="part-number-table-container">
                <div className="part-number-table">
                    {makeUniqueKeys(
                        oeReferences,
                        (group, i) => group.manufacturer || `oe-${i}`,
                        { prefix: "oe", reportLabel: "OriginalPartNumber.groups" }
                    ).map(({ item: group, key: groupKey }) => (
                        <div key={groupKey} className="table-row">
                            <div className="table-cell brand-cell">{group.manufacturer}</div>
                            <div className="table-cell number-cell">
                                {makeUniqueKeys(
                                    group.references,
                                    (ref, j) => ref || `ref-${j}`,
                                    { prefix: "ref", reportLabel: "OriginalPartNumber.references" }
                                ).map(({ item: ref, key: refKey }) => (
                                    <span key={refKey} className="oe-reference-number">
                                        {ref}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OriginalPartNumber;
