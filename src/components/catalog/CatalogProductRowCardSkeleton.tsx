// react
import React from "react";
// application
import styles from "./CatalogProductRowCardSkeleton.module.scss";

/**
 * Skeleton placeholder that matches CatalogProductRowCard layout exactly.
 * Used during filter/sort/pagination loading on /catalog/products and /catalog/[slug]/products.
 */
function CatalogProductRowCardSkeleton() {
    return (
        <div className={styles.card} aria-hidden="true">
            <div className={styles.zone1}>
                <div className={styles.imagePlaceholder} />
            </div>
            <div className={styles.zone2}>
                <div className={styles.titleLine1} />
                <div className={styles.titleLine2} />
                <div className={styles.badgePlaceholder} />
                <div className={styles.idPlaceholder} />
                <div className={`${styles.specLine} ${styles.specLine1}`} />
                <div className={`${styles.specLine} ${styles.specLine2}`} />
            </div>
            <div className={styles.zone3}>
                <div className={styles.pricePlaceholder} />
                <div className={styles.vatPlaceholder} />
                <div className={styles.actionsRow}>
                    <div className={styles.qtyPlaceholder} />
                    <div className={styles.btnPlaceholder} />
                </div>
                <div className={styles.comparePlaceholder} />
                <div className={styles.deliveryRow}>
                    <div className={styles.deliveryIconPlaceholder} />
                    <div className={styles.deliveryTextPlaceholder} />
                </div>
            </div>
        </div>
    );
}

export default React.memo(CatalogProductRowCardSkeleton);
