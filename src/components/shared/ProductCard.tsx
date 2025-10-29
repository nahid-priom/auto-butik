// react
import React, { useState } from "react";
// third-party
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
// application
import AppImage from "~/components/shared/AppImage";
import AppLink from "~/components/shared/AppLink";
import AsyncAction from "~/components/shared/AsyncAction";
import CompatibilityStatusBadge from "~/components/shared/CompatibilityStatusBadge";
import CurrencyFormat from "~/components/shared/CurrencyFormat";
import { FaCalendarCheck } from "react-icons/fa";
import Rating from "~/components/shared/Rating";
import url from "~/services/url";
import { IProduct } from "~/interfaces/product";
import { useCartAddItem } from "~/store/cart/cartHooks";
import { useCompareAddItem } from "~/store/compare/compareHooks";
import { useQuickviewOpen } from "~/store/quickview/quickviewHooks";
import { useWishlistAddItem } from "~/store/wishlist/wishlistHooks";
import { Cart20Svg, Compare16Svg, Quickview16Svg, Wishlist16Svg } from "~/svg";

export type IProductCardElement = "actions" | "status-badge" | "meta" | "features" | "buttons" | "list-buttons";

export type IProductCardLayout = "grid" | "list" | "table" | "horizontal";

interface Props extends React.HTMLAttributes<HTMLElement> {
    product: IProduct;
    layout?: IProductCardLayout;
    exclude?: IProductCardElement[];
}

function ProductCard(props: Props) {
    const { product, layout, exclude = [], className, ...rootProps } = props;
    const intl = useIntl();
    const featuredAttributes = [
        {
            name: "LOCATION",
            values: [{ name: "Rear axle" }],
        },
        {
            name: "EAN",
            values: [{ name: "4047024749801" }],
        },
        {
            name: "OUTER_DIAMETER_MM",
            values: [{ name: "272" }],
        },
        {
            name: "BRAKE_DISC_THICKNESS_MM",
            values: [{ name: "10" }],
        },
        {
            name: "MINIMUM_THICKNESS_MM",
            values: [{ name: "8" }],
        },
        {
            name: "HEIGHT_MM",
            values: [{ name: "48.3" }],
        },
        {
            name: "HOLE_CIRCLE_DIAMETER_MM",
            values: [{ name: "112" }],
        },
        {
            name: "BRAKE_DISC_TYPE",
            values: [{ name: "full" }],
        },
        {
            name: "CENTERING_DIAMETER_MM",
            values: [{ name: "65" }],
        },
        {
            name: "NUMBER_OF_HOLES",
            values: [{ name: "9" }],
        },
        {
            name: "SURFACE",
            values: [{ name: "oiled" }],
        },
        {
            name: "MEETS_ECE_STANDARD",
            values: [{ name: "ECE-R90" }],
        },
        {
            name: "DRILLING_DIAMETER_TO_MM",
            values: [{ name: "15.3" }],
        },
        {
            name: "PRODUCT_LINE",
            values: [{ name: "BD1515, E1 90 R - 02C0355/0231" }],
        },
        {
            name: "BRAND_QUALITY",
            values: [{ name: "Premium" }],
        },
        {
            name: "MANUFACTURER",
            values: [{ name: "BOSCH" }],
        },
        {
            name: "ITEM_NO",
            values: [{ name: "0 986 479 677" }],
        },
    ];

    const [showAllFeatures, setShowAllFeatures] = useState(false);

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
                        >
                            <Quickview16Svg />
                        </button>
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
                        {product.images && <AppImage className="image__tag" src={product.images[0]} />}
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
                    <AppLink href={url.product(product)}>{<FormattedMessage id="PRODUCT_NAME" />}</AppLink>
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

                <div className="product-card__features">
                    <ul>
                        {displayedFeatures.map((attribute, index) => (
                            <li key={index}>
                                <FormattedMessage id={attribute.name} />
                                {": "}
                                <span className="product-card__feature-value">
                                    {attribute.values.map((x) => x.name).join(", ")}
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
            </div>

            <div className="product-card__footer">
                <div className="product-card__shipping-info">
                    <div className="product-card__shipping-info__icon">
                        <FaCalendarCheck />
                    </div>
                    <div className="product-card__shipping-info__text">
                        <FormattedMessage id="SHIPPED_FROM_STOCKHOLM" />
                        {": "}
                        <span className="product-card__shipping-info__date">Tomorrow, 2025-10-29</span>
                    </div>
                </div>
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
                    {!exclude.includes("buttons") && (
                        <React.Fragment>
                            {!exclude.includes("list-buttons") && (
                                <React.Fragment>
                                    <div className="product-card__quantity-and-cart">
                                        <div className="product-card__quantity">
                                            <select className="product-card__quantity-select" defaultValue="1">
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                                                    <option key={number} value={number}>
                                                        {number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <AsyncAction
                                            action={() => cartAddItem(product)}
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
                                    <AsyncAction
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
                                    />
                                    <AsyncAction
                                        action={() => addToCompare()}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                className={classNames("product-card__compare", {
                                                    "product-card__compare--loading": loading,
                                                })}
                                                onClick={run}
                                            >
                                                <Compare16Svg />
                                                <span>
                                                    <FormattedMessage id="BUTTON_ADD_TO_COMPARE" />
                                                </span>
                                            </button>
                                        )}
                                    />
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
