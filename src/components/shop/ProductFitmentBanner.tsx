// react
import React, { useMemo, useState, useEffect } from "react";
// third-party
import { FormattedMessage, useIntl } from "react-intl";
// application
import { IProduct } from "~/interfaces/product";
import { useGarage } from "~/contexts/GarageContext";
import { useTecdocProduct } from "~/hooks/useTecdocProduct";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import styles from "./ProductFitmentBanner.module.scss";

export type FitmentStatus = "match" | "no-match" | "loading" | "no-vehicle";

interface ProductFitmentBannerProps {
    product: IProduct;
    /** Scroll target id for "View fitment details" (e.g. compatible-vehicles section) */
    fitmentDetailsSectionId?: string;
    className?: string;
}

/**
 * Resolves current vehicle display name from garage context.
 */
function useCurrentVehicleLabel(): string | null {
    const { vehicles, currentCarId } = useGarage();
    return useMemo(() => {
        const current = currentCarId ? vehicles.find((v) => v.id === currentCarId) : vehicles[0];
        if (!current?.data) return null;
        const d = current.data as { C_merke?: string; C_modell?: string };
        const make = d.C_merke || "";
        const model = d.C_modell || "";
        return [make, model].filter(Boolean).join(" ") || null;
    }, [vehicles, currentCarId]);
}

/**
 * Resolves current vehicle TecDoc model id (ktype) from garage context.
 */
function useCurrentVehicleKtype(): string | null {
    const { vehicles, currentCarId } = useGarage();
    return useMemo(() => {
        const current = currentCarId ? vehicles.find((v) => v.id === currentCarId) : vehicles[0];
        if (!current?.data) return null;
        const d = current.data as { modell_id?: string; modelId?: string };
        return d.modell_id ?? (d as { modelId?: string }).modelId ?? null;
    }, [vehicles, currentCarId]);
}

/**
 * Two-state fitment banner: green when product matches selected vehicle, red when not/unknown.
 * SSR-safe: renders neutral skeleton when vehicle/fitment data is not yet available.
 */
function ProductFitmentBanner({ product, fitmentDetailsSectionId = "compatible-vehicles", className }: ProductFitmentBannerProps) {
    const intl = useIntl();
    const vehicleLabel = useCurrentVehicleLabel();
    const vehicleKtype = useCurrentVehicleKtype();
    const { data: tecdocData, isLoading: tecdocLoading } = useTecdocProduct(product?.id ?? null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const status: FitmentStatus = useMemo(() => {
        if (!mounted) return "loading";
        if (!vehicleKtype || !vehicleLabel) return "no-vehicle";
        if (tecdocLoading) return "loading";
        const groups = tecdocData?.compatibleVehicles ?? [];
        const allKtypen = groups.flatMap((g) => g.vehicles.map((v) => v.ktypno));
        const isMatch = allKtypen.some((k) => String(k).trim() === String(vehicleKtype).trim());
        return isMatch ? "match" : "no-match";
    }, [mounted, vehicleKtype, vehicleLabel, tecdocLoading, tecdocData?.compatibleVehicles]);

    const scrollToFitmentDetails = () => {
        if (typeof document === "undefined") return;
        const el = document.getElementById(fitmentDetailsSectionId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (status === "no-vehicle") {
        return null;
    }

    if (status === "loading") {
        return (
            <div className={[styles.banner, styles.bannerSkeleton, className].filter(Boolean).join(" ")} aria-hidden>
                <div className={styles.content}>
                    <span className={styles.iconSkeleton} />
                    <span className={styles.textSkeleton} />
                </div>
            </div>
        );
    }

    const isMatch = status === "match";

    return (
        <div
            className={[
                styles.banner,
                isMatch ? styles.bannerMatch : styles.bannerNoMatch,
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            role="status"
            aria-live="polite"
        >
            <div className={styles.content}>
                <span className={styles.icon} aria-hidden>
                    {isMatch ? <FaCheckCircle /> : <FaExclamationTriangle />}
                </span>
                <div className={styles.text}>
                    <span className={styles.title}>
                        {isMatch ? (
                            <FormattedMessage id="FITMENT_BANNER_TITLE_MATCH" defaultMessage="This item is suitable for your vehicle" />
                        ) : (
                            <FormattedMessage id="FITMENT_BANNER_TITLE_NO_MATCH" defaultMessage="This item may not fit your vehicle" />
                        )}
                    </span>
                    {vehicleLabel && (
                        <span className={styles.vehicleLabel}>{vehicleLabel}</span>
                    )}
                    {isMatch ? (
                        <button
                            type="button"
                            className={styles.link}
                            onClick={scrollToFitmentDetails}
                            aria-label={intl.formatMessage({ id: "VIEW_FITMENT_DETAILS", defaultMessage: "View fitment details" })}
                        >
                            <FormattedMessage id="VIEW_FITMENT_DETAILS" defaultMessage="View fitment details" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={styles.link}
                            onClick={scrollToFitmentDetails}
                            aria-label={intl.formatMessage({ id: "WILL_IT_REALLY_FIT", defaultMessage: "Will it really fit?" })}
                        >
                            <FormattedMessage id="WILL_IT_REALLY_FIT" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductFitmentBanner;
