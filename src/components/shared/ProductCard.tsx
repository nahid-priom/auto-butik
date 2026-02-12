// react
import React, { useState } from "react";
// third-party
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
// application
import ProductImage from "~/components/shared/ProductImage";
import AppLink from "~/components/shared/AppLink";
import AsyncAction from "~/components/shared/AsyncAction";
import CompatibilityStatusBadge from "~/components/shared/CompatibilityStatusBadge";
import CurrencyFormat from "~/components/shared/CurrencyFormat";
import { FaShippingFast } from "react-icons/fa";
import Rating from "~/components/shared/Rating";
import url from "~/services/url";
import { IProduct } from "~/interfaces/product";
import { useCartAddItem } from "~/store/cart/cartHooks";
import { useCompareAddItem } from "~/store/compare/compareHooks";
import { useQuickviewOpen } from "~/store/quickview/quickviewHooks";
import { useWishlistAddItem } from "~/store/wishlist/wishlistHooks";
import { Cart20Svg, Compare16Svg, Wishlist16Svg } from "~/svg";

export type IProductCardElement =
    | "actions"
    | "status-badge"
    | "meta"
    | "features"
    | "buttons"
    | "list-buttons"
    | "shipping"
    | "vat";

export type IProductCardLayout = "grid" | "list" | "horizontal" | "table";

interface Props extends React.HTMLAttributes<HTMLElement> {
    product: IProduct;
    layout?: IProductCardLayout;
    exclude?: IProductCardElement[];
}

function ProductCard(props: Props) {
    const { product, layout, exclude = [], className, ...rootProps } = props;
    const intl = useIntl();

    type FeatureSpec = { name: string; value: string; unit?: string; fromSpecial?: boolean };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

    // Build feature list from backend: technicalSpecs (non-empty) + specialFitment + EAN if present
    const rawSpecs = (product.customFields?.technicalSpecs as FeatureSpec[] | undefined) ?? [];
    const specsWithValue: FeatureSpec[] = rawSpecs.filter(
        (s) => s.value != null && String(s.value).trim() !== ""
    );

    // Special fitments: show below Placering, skip those whose name is "Position"
    const rawSpecialFitments =
        (product.customFields?.specialFitment as Array<{ name: string; value: string }> | undefined) ??
        [];
    const specialFitments: FeatureSpec[] = rawSpecialFitments
        .filter(
            (sf) =>
                sf.value != null &&
                String(sf.value).trim() !== "" &&
                sf.name !== "Position"
        )
        .map((sf) => ({
            name: sf.name,
            value: sf.value,
            unit: undefined,
            fromSpecial: true,
        }));

    const ean = product.customFields?.ean as string | null | undefined;
    const hasEanInSpecs = specsWithValue.some(
        (s) => s.name === "EAN" || s.name.toLowerCase() === "ean"
    );

    // Start from technical specs, optionally appending EAN (never before Placering / special fitments)
    const specsWithEan: FeatureSpec[] =
        ean && !hasEanInSpecs
            ? [
                  ...specsWithValue,
                  {
                      name: "EAN",
                      value: ean,
                      unit: undefined,
                      fromSpecial: false,
                  },
              ]
            : specsWithValue;

    // Order: (1) Position/Placering, (2) special fitments, (3) everything else (including EAN)
    const positionSpecs = specsWithEan.filter((s) => s.name === "Position");
    const otherSpecs = specsWithEan.filter((s) => s.name !== "Position");
    const orderedSpecs: FeatureSpec[] =
        positionSpecs.length > 0
            ? [...positionSpecs, ...specialFitments, ...otherSpecs]
            : [...specialFitments, ...otherSpecs];

    // Group specs with the same name (e.g. multiple "Position") into one line with comma-separated values
    const groupedByName = orderedSpecs.reduce(
        (acc, spec) => {
            const key = spec.name;
            if (!acc[key]) {
                acc[key] = {
                    name: spec.name,
                    values: [] as string[],
                    unit: spec.unit,
                    fromSpecial: spec.fromSpecial ?? false,
                };
            }
            acc[key].values.push(spec.value.trim());
            if (spec.fromSpecial) {
                acc[key].fromSpecial = true;
            }
            return acc;
        },
        {} as Record<string, { name: string; values: string[]; unit?: string; fromSpecial?: boolean }>
    );
    const featuredAttributes: FeatureSpec[] = Object.values(groupedByName).map(
        ({ name, values, unit, fromSpecial }) => ({
            name,
            value: values.join(", "),
            unit,
            fromSpecial: !!fromSpecial,
        })
    );

    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Show only first 4 features initially, or all if showAllFeatures is true
    const displayedFeatures = showAllFeatures ? featuredAttributes : featuredAttributes.slice(0, 4);

    const hasMoreFeatures = featuredAttributes.length > 4;
    const cartAddItem = useCartAddItem();
    const quickviewOpen = useQuickviewOpen();
    const compareAddItem = useCompareAddItem();
    const wishlistAddItem = useWishlistAddItem();

    const showQuickview = () => quickviewOpen(product.slug);
    const addToWishlist = () => wishlistAddItem(product);
    const addToCompare = () => compareAddItem(product);

    const rootClasses = classNames("product-card", className, {
        [`product-card--layout--${layout}`]: layout,
    });

    return (
        <div className={rootClasses} {...rootProps}>
            <div className="product-card__actions-list">
                <AsyncAction
                    action={() => showQuickview()}
                    render={({ run, loading }) => (
                        <button
                            type="button"
                            className={classNames("product-card__action product-card__action--quickview", {
                                "product-card__action--loading": loading,
                            })}
                            aria-label={intl.formatMessage({ id: "BUTTON_QUICKVIEW" })}
                            onClick={run}
                        />
                    )}
                />

                {!exclude.includes("actions") && (
                    <React.Fragment>
                        <AsyncAction
                            action={() => addToWishlist()}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    className={classNames("product-card__action product-card__action--wishlist", {
                                        "product-card__action--loading": loading,
                                    })}
                                    aria-label={intl.formatMessage({ id: "BUTTON_ADD_TO_WISHLIST" })}
                                    onClick={run}
                                >
                                    <Wishlist16Svg />
                                </button>
                            )}
                        />
                        <AsyncAction
                            action={() => addToCompare()}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    className={classNames("product-card__action product-card__action--compare", {
                                        "product-card__action--loading": loading,
                                    })}
                                    aria-label={intl.formatMessage({ id: "BUTTON_ADD_TO_COMPARE" })}
                                    onClick={run}
                                >
                                    <Compare16Svg />
                                </button>
                            )}
                        />
                    </React.Fragment>
                )}
            </div>

            <div className="product-card__image">
                <div className="image image--type--product">
                    <AppLink href={url.product(product)} className="image__body">
                        <ProductImage
                            className="image__tag"
                            src={product.images?.[0]}
                            loading="lazy"
                        />
                    </AppLink>
                </div>

                {!exclude.includes("status-badge") && (
                    <CompatibilityStatusBadge className="product-card__fit" product={product} />
                )}
            </div>

            <div className="product-card__info">
                {/* {!exclude.includes("meta") && (
                    <div className="product-card__meta">
                        <span className="product-card__meta-title">
                            <FormattedMessage id="TEXT_SKU" />
                            {": "}
                        </span>
                        {product.sku}
                    </div>
                )} */}

                <div className="product-card__name">
                    {product.badges && product.badges.length > 0 && (
                        <div className="product-card__badges">
                            {product.badges.map((badge) => (
                                <div key={badge} className={`tag-badge tag-badge--${badge}`}>
                                    {badge}
                                </div>
                            ))}
                        </div>
                    )}
                    <AppLink href={url.product(product)}>{product.name}</AppLink>
                </div>

                {!exclude.includes("meta") && (
                    <div className="product-card__meta">
                        <div className="product-card__meta-row">
                            <div className="product-card__meta-column">
                                <span
                                    className="product-card__meta-badge"
                                    style={{ backgroundColor: "#dfe3e8", color: "black" }}
                                >
                                    <FormattedMessage id="TEXT_VEHICLE_SPECIFIC" />
                                </span>
                            </div>
                            <div className="product-card__meta-column">
                                <span className="product-card__meta-title">
                                    <FormattedMessage id="TEXT_ID" />
                                    {": "}
                                </span>
                                {product.sku}
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className="product-card__rating">
                    <Rating className="product-card__rating-stars" value={product.rating || 0} />
                    <div className=" product-card__rating-label">
                        <FormattedMessage
                            id="TEXT_RATING_LABEL"
                            values={{
                                rating: product.rating,
                                reviews: product.reviews,
                            }}
                        />
                    </div>
                </div> */}

                {/* {!exclude.includes("features") && featuredAttributes.length > 0 && (
                    <div className="product-card__features">
                        <ul>
                            {featuredAttributes.map((attribute, index) => (
                                <li key={index}>
                                    {attribute.name}
                                    {": "}
                                    {attribute.values.map((x) => x.name).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )} */}
                {!exclude.includes("features") && displayedFeatures.length > 0 && (
                    <div className="product-card__features">
                        <ul>
                            {displayedFeatures.map((spec, index) => (
                                <li key={index}>
                                    <span className="product-card__feature-name">
                                        {spec.name === "Position" ? (
                                            "Placering"
                                        ) : spec.fromSpecial ? (
                                            <strong>{spec.name}</strong>
                                        ) : (
                                            spec.name
                                        )}
                                    </span>
                                    {": "}
                                    <span className="product-card__feature-value">
                                        {spec.value}
                                        {spec.unit ? ` ${spec.unit}` : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {hasMoreFeatures && (
                            <button
                                className="product-card__show-more-btn"
                                onClick={() => setShowAllFeatures(!showAllFeatures)}
                            >
                                <FormattedMessage
                                    id={showAllFeatures ? "BUTTON_HIDE_ALL_FEATURES" : "BUTTON_SHOW_ALL_FEATURES"}
                                />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="product-card__footer">
                {!exclude.includes("shipping") && (
                    <div className="product-card__shipping-info">
                        <div className="product-card__shipping-info__icon">
                            <FaShippingFast />
                        </div>
                        <div className="product-card__shipping-info__text">
                            <FormattedMessage id="SHIPPED_FROM_STOCKHOLM" />
                            {": "}
                            <span className="product-card__shipping-info__date">i morgon, {tomorrowDateStr}</span>
                        </div>
                    </div>
                )}
                <div className="product-card__prices-and-buttons">
                    <div className="product-card__prices">
                        {product.compareAtPrice !== null && (
                            <React.Fragment>
                                <div className="product-card__price product-card__price--new">
                                    <CurrencyFormat value={product.price} />
                                </div>
                                <div className="product-card__price product-card__price--old">
                                    <CurrencyFormat value={product.compareAtPrice} />
                                </div>
                            </React.Fragment>
                        )}
                        {product.compareAtPrice === null && (
                            <div className="product-card__price product-card__price--current">
                                <CurrencyFormat value={product.price} />
                            </div>
                        )}
                    </div>
                    {!exclude.includes("vat") && (
                        <div className="product-card__vat-and-shipping-info">
                            <span className="product-card__vat-and-shipping-info__left">
                                <FormattedMessage id="TEXT_INCL_VAT" />
                            </span>
                            <span className="product-card__vat-and-shipping-info__right">
                                <FormattedMessage id="TEXT_FREE_SHIPPING" />
                            </span>
                        </div>
                    )}
                    {!exclude.includes("buttons") && (
                        <React.Fragment>
                            {!exclude.includes("list-buttons") && (
                                <React.Fragment>
                                    <div className="product-card__quantity-and-cart">
                                        <div className="product-card__quantity">
                                            <select
                                                className="product-card__quantity-select"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                aria-label={intl.formatMessage({ id: "INPUT_QUANTITY", defaultMessage: "Quantity" })}
                                            >
                                                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <AsyncAction
                                            action={() => cartAddItem(product, [], quantity)}
                                            render={({ run, loading }) => (
                                                <button
                                                    type="button"
                                                    className={classNames("product-card__addtocart-full", {
                                                        "product-card__addtocart-full--loading": loading,
                                                    })}
                                                    onClick={run}
                                                >
                                                    <FormattedMessage id="BUTTON_ADD_TO_CART" />
                                                </button>
                                            )}
                                        />
                                    </div>
                                    {/* <AsyncAction
                                        action={() => addToWishlist()}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                className={classNames("product-card__wishlist", {
                                                    "product-card__wishlist--loading": loading,
                                                })}
                                                onClick={run}
                                            >
                                                <Wishlist16Svg />
                                                <span>
                                                    <FormattedMessage id="BUTTON_ADD_TO_WISHLIST" />
                                                </span>
                                            </button>
                                        )}
                                    /> */}
                                    <div className="checkbox-container">
                                        <label className="checkbox-label">
                                            <input type="checkbox" className="checkbox-input" />
                                            <span className="checkbox-custom">
                                                <svg className="checkbox-checkmark" viewBox="0 0 12 10">
                                                    <polyline points="1.5 6 4.5 9 10.5 1" />
                                                </svg>
                                            </span>

                                            <span className="checkbox-text">
                                                <FormattedMessage id="BUTTON_ADD_TO_COMPARE" />
                                            </span>
                                        </label>
                                    </div>

                                    {/* <CustomCheckbox
          id=""
          label="Subscribe to newsletter"
          checked={formData.newsletter}
          onChange={handleCheckboxChange("newsletter")}
        /> */}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(ProductCard);
