import React from "react";
import { FormattedMessage } from "react-intl";

const ProductInformation = ({ productName = "Trunk mat REZAW PLAST 101817R VW TOURAN" }) => {
    const productInfo = [
        { key: "PAINT", value: "Black" },
        { key: "MATERIAL", value: "Rubber" },
        { key: "BRAND_QUALITY", value: "Price/Performance" },
        { key: "MANUFACTURER", value: "REZAW PLASTICS" },
        { key: "ITEM_NO", value: "101817R" },
        { key: "PAINT", value: "Black" },
        { key: "MATERIAL", value: "Rubber" },
        { key: "BRAND_QUALITY", value: "Price/Performance" },
        { key: "MANUFACTURER", value: "REZAW PLASTICS" },
        { key: "ITEM_NO", value: "101817R" },
        { key: "PAINT", value: "Black" },
        { key: "MATERIAL", value: "Rubber" },
        { key: "BRAND_QUALITY", value: "Price/Performance" },
        { key: "MANUFACTURER", value: "REZAW PLASTICS" },
        { key: "ITEM_NO", value: "101817R" },
    ];

    return (
        <div className="product-information-section">
            <h2 className="section-title">
                <FormattedMessage id="TECHNICAL_INFORMATION_TITLE" values={{ productName }} />
            </h2>
            <div className="product-info-grid">
                {productInfo.map((info, index) => (
                    <div key={index} className="info-row">
                        <div className="info-key">
                            <FormattedMessage id={info.key} />
                        </div>
                        <div className="info-value">{info.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductInformation;
