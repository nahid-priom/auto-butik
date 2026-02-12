// react
import React, { useMemo, useState } from "react";
// application
import { FormattedMessage, useIntl } from "react-intl";
import { FaShippingFast } from "react-icons/fa";
import ProductImage from "~/components/shared/ProductImage";
import AppLink from "~/components/shared/AppLink";
import AsyncAction from "~/components/shared/AsyncAction";
import CurrencyFormat from "~/components/shared/CurrencyFormat";
import url from "~/services/url";
import { IProduct } from "~/interfaces/product";
import { useCartAddItem } from "~/store/cart/cartHooks";
import { useCompareAddItem, useCompare } from "~/store/compare/compareHooks";
import styles from "./CatalogProductRowCard.module.scss";

const COMPARE_MAX = 3;

type FeatureSpec = { name: string; value: string; unit?: string; fromSpecial?: boolean };

function buildSpecs(product: IProduct): FeatureSpec[] {
    const rawSpecs = (product.customFields?.technicalSpecs as FeatureSpec[] | undefined) ?? [];
    const specsWithValue = rawSpecs.filter((s) => s.value != null && String(s.value).trim() !== "");

    const rawSpecialFitments =
        (product.customFields?.specialFitment as Array<{ name: string; value: string }> | undefined) ?? [];
    const specialFitments: FeatureSpec[] = rawSpecialFitments
        .filter(
            (sf) =>
                sf.value != null &&
                String(sf.value).trim() !== "" &&
                sf.name !== "Position"
        )
        .map((sf) => ({ name: sf.name, value: sf.value, unit: undefined, fromSpecial: true }));

    const ean = product.customFields?.ean as string | null | undefined;
    const hasEanInSpecs = specsWithValue.some(
        (s) => s.name === "EAN" || s.name.toLowerCase() === "ean"
    );
    const specsWithEan: FeatureSpec[] =
        ean && !hasEanInSpecs
            ? [...specsWithValue, { name: "EAN", value: ean, unit: undefined, fromSpecial: false }]
            : specsWithValue;

    const positionSpecs = specsWithEan.filter((s) => s.name === "Position");
    const otherSpecs = specsWithEan.filter((s) => s.name !== "Position");
    const orderedSpecs: FeatureSpec[] =
        positionSpecs.length > 0
            ? [...positionSpecs, ...specialFitments, ...otherSpecs]
            : [...specialFitments, ...otherSpecs];

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
            if (spec.fromSpecial) acc[key].fromSpecial = true;
            return acc;
        },
        {} as Record<string, { name: string; values: string[]; unit?: string; fromSpecial?: boolean }>
    );

    return Object.values(groupedByName).map(({ name, values, unit, fromSpecial }) => ({
        name,
        value: values.join(", "),
        unit,
        fromSpecial: !!fromSpecial,
    }));
}

export interface CatalogProductRowCardProps {
    product: IProduct;
}

function CatalogProductRowCard(props: CatalogProductRowCardProps) {
    const { product } = props;
    const intl = useIntl();
    const [quantity, setQuantity] = useState(1);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const cartAddItem = useCartAddItem();
    const compareAddItem = useCompareAddItem();
    const compareState = useCompare();

    const featuredSpecs = useMemo(() => buildSpecs(product), [product]);
    const displayedSpecs = showAllFeatures ? featuredSpecs : featuredSpecs.slice(0, 4);
    const hasMoreSpecs = featuredSpecs.length > 4;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

    const compareCount = compareState.items?.length ?? 0;

    return (
        <div className={styles.card}>
            {/* Zone 1: Image only (no brand pill over the picture) */}
            <div className={styles.zone1}>
                <AppLink href={url.product(product)} className={styles.imageWrap}>
                    <ProductImage
                        src={product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        className={styles.image}
                    />
                </AppLink>
            </div>

            {/* Zone 2: Title + Meta + Specs */}
            <div className={styles.zone2}>
                <h3 className={styles.title}>
                    <AppLink href={url.product(product)}>{product.name}</AppLink>
                </h3>
                <div className={styles.meta}>
                    <span className={styles.tagChip}>
                        <FormattedMessage id="TEXT_VEHICLE_SPECIFIC" />
                    </span>
                    <span className={styles.idText}>
                        <FormattedMessage id="TEXT_ID" />: {product.sku ?? product.id}
                    </span>
                </div>
                {displayedSpecs.length > 0 && (
                    <ul className={styles.specs}>
                        {displayedSpecs.map((spec, index) => (
                            <li key={index}>
                                <span className={styles.specName}>
                                    {spec.name === "Position" ? "Placering" : spec.fromSpecial ? <strong>{spec.name}</strong> : spec.name}
                                </span>
                                {": "}
                                <span className={styles.specValue}>
                                    {spec.value}
                                    {spec.unit ? ` ${spec.unit}` : ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                {hasMoreSpecs && (
                    <button
                        type="button"
                        className={styles.showAllLink}
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                    >
                        {showAllFeatures ? (
                            <FormattedMessage id="BUTTON_HIDE_ALL_FEATURES" defaultMessage="Dölj" />
                        ) : (
                            <FormattedMessage id="BUTTON_SHOW_ALL_FEATURES" defaultMessage="Visa all information" />
                        )}
                    </button>
                )}
            </div>

            {/* Zone 3: Price + Actions */}
            <div className={styles.zone3}>
                <div className={styles.price}>
                    <CurrencyFormat value={product.price} />
                </div>
                <div className={styles.vatRow}>
                    <span className={styles.vatText}>
                        <FormattedMessage id="TEXT_INCL_VAT" />
                    </span>
                    <span className={styles.vatDivider}>|</span>
                    <span className={styles.shippingText}>
                        <FormattedMessage id="TEXT_FREE_SHIPPING" />
                    </span>
                </div>
                <div className={styles.actions}>
                    <select
                        className={styles.qtySelect}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        aria-label={intl.formatMessage({ id: "INPUT_QUANTITY", defaultMessage: "Antal" })}
                    >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <AsyncAction
                        action={() => cartAddItem(product, [], quantity)}
                        render={({ run, loading }) => (
                            <button
                                type="button"
                                className={styles.buyBtn}
                                onClick={run}
                                disabled={loading}
                            >
                                <FormattedMessage id="BUTTON_ADD_TO_CART" defaultMessage="Add to Cart" />
                            </button>
                        )}
                    />
                </div>
                <label className={styles.compareLabel}>
                    <input
                        type="checkbox"
                        className={styles.compareInput}
                        checked={compareState.items?.some((p) => p.id === product.id) ?? false}
                        onChange={() => compareAddItem(product)}
                    />
                    <span className={styles.compareText}>
                        <FormattedMessage id="BUTTON_ADD_TO_COMPARE" defaultMessage="Lägg till i Jämför" />
                        {" "}({compareCount}/{COMPARE_MAX})
                    </span>
                </label>
                <div className={styles.delivery}>
                    <FaShippingFast className={styles.deliveryIcon} />
                    <span>
                        <FormattedMessage id="SHIPPED_FROM_STOCKHOLM" />: Måndag, {tomorrowStr}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(CatalogProductRowCard);
