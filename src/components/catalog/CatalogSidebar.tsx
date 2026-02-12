// react
import React from "react";
// application
import { FormattedMessage } from "react-intl";
import styles from "./CatalogSidebar.module.scss";

export interface CatalogSidebarProps {
    /** Current category title (e.g. "Bromssystem") shown in the sidebar header */
    title: string;
    /** Optional class for the root element */
    className?: string;
    children: React.ReactNode;
}

/**
 * Presentational sidebar for catalog products page: card-style panel with title and category list.
 * Sticky on desktop; on tablet/mobile the parent should render it inside a drawer.
 */
function CatalogSidebar(props: CatalogSidebarProps) {
    const { title, className, children } = props;

    return (
        <aside className={`${styles.root} ${className || ""}`.trim()} aria-label="Kategorier">
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title || <FormattedMessage id="HEADER_CATEGORIES" defaultMessage="Kategorier" />}</h2>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </aside>
    );
}

export default React.memo(CatalogSidebar);
