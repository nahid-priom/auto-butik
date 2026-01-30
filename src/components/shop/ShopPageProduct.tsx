// react
import React, { useEffect, useRef, useState } from "react";
// third-party
import classNames from "classnames";
import { Controller, FormProvider } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
// application
import AppLink, { IAppLinkHref, resolveAppLinkHref } from "~/components/shared/AppLink";
import AsyncAction from "~/components/shared/AsyncAction";
import BlockHeader from "~/components/blocks/BlockHeader";
import BlockProductsCarousel from "~/components/blocks/BlockProductsCarousel";
import BlockSpace from "~/components/blocks/BlockSpace";
import CompatibilityStatusBadge from "~/components/shared/CompatibilityStatusBadge";
import CurrencyFormat from "~/components/shared/CurrencyFormat";
import InputNumber from "~/components/shared/InputNumber";
import PageTitle from "~/components/shared/PageTitle";
import SEO from "~/components/shared/SEO";
import ProductForm from "~/components/shop/ProductForm";
import ProductGallery, { IProductGalleryLayout } from "~/components/shop/ProductGallery";
import ProductSidebar from "~/components/shop/ProductSidebar";
import ProductTabs from "~/components/shop/ProductTabs";
import Rating from "~/components/shared/Rating";
import ShareLinks from "~/components/shared/ShareLinks";
import StockStatusBadge from "~/components/shared/StockStatusBadge";
import url from "~/services/url";
import { getCategoryPath } from "~/services/utils";
import { IProduct } from "~/interfaces/product";
import { IProductPageLayout, IProductPageSidebarPosition } from "~/interfaces/pages";
import { shopApi } from "~/api";
import { useCompareAddItem } from "~/store/compare/compareHooks";
import { useProductForm } from "~/services/forms/product";
import { useWishlistAddItem } from "~/store/wishlist/wishlistHooks";
import { getProductStructuredData, getBreadcrumbStructuredData } from "~/services/seo/structured-data";
import {
    Compare16Svg,
    Fi24Hours48Svg,
    FiFreeDelivery48Svg,
    FiPaymentSecurity48Svg,
    FiTag48Svg,
    Wishlist16Svg,
} from "~/svg";
import { useCartAddItem } from "~/store/cart/cartHooks";
import { FaBoxes, FaCalendarCheck, FaCheckCircle, FaShippingFast, FaInfoCircle } from "react-icons/fa";
import ProductQuestion from "./ProductQuestion";
import ProductInformation from "./ProductInformation";
import CompatibleVehicles from "./CompatibleVehiclies";
import OriginalPartNumber from "./OriginalPartNumber";
import { useTecdocProduct } from "~/hooks/useTecdocProduct";
import { TechnicalSpec } from "~/interfaces/tecdoc";
// Payment method logos are imported as images

interface Props {
    product: IProduct;
    layout: IProductPageLayout;
    sidebarPosition?: IProductPageSidebarPosition;
}
interface QuickviewFormValues {
    quantity: number;
}

function ShopPageProduct(props: Props) {
    const { product, layout, sidebarPosition = "start" } = props;
    const intl = useIntl();
    const wishlistAddItem = useWishlistAddItem();
    const compareAddItem = useCompareAddItem();
    const galleryLayout = `product-${layout}` as IProductGalleryLayout;
    const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
    const productForm = useProductForm(product);

    const cartAddItem = useCartAddItem();

    const addToWishlist = () => wishlistAddItem(product);
    const addToCompare = () => compareAddItem(product);

    // Fetch TecDoc product data
    const { 
        data: tecdocData, 
        isLoading: tecdocLoading, 
        hasSpecs, 
        hasVehicles, 
        hasOeRefs 
    } = useTecdocProduct(product?.id || null);

    // Convert TecDoc specs to feature format for display in the quick features section
    const features: TechnicalSpec[] = tecdocData?.technicalSpecs || [];

    const sections = [
        {
            id: "product-information",
            title: "Product information",
            component: (
                <ProductInformation 
                    productName={product?.name} 
                    technicalSpecs={tecdocData?.technicalSpecs} 
                    isLoading={tecdocLoading} 
                />
            ),
        },
        {
            id: "compatible-vehicles",
            title: "Compatible vehicles",
            component: (
                <CompatibleVehicles 
                    compatibleVehicles={tecdocData?.compatibleVehicles} 
                    isLoading={tecdocLoading} 
                />
            ),
        },
        {
            id: "original-part-number",
            title: "Original part number",
            component: (
                <OriginalPartNumber 
                    productName={product?.name} 
                    oeReferences={tecdocData?.oeReferences} 
                    isLoading={tecdocLoading} 
                />
            ),
        },
    ];

    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const displayedFeatures: TechnicalSpec[] = showAllFeatures ? features : features.slice(0, 4);
    const hasMoreFeatures = features.length > 4;

    const [activeSection, setActiveSection] = useState("product-information");
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    // Section data
    const sectionData = [
        {
            id: "product-information",
            title: "Product information",
            content: "Product information content goes here...",
        },
        {
            id: "compatible-vehicles",
            title: "Compatible vehicles",
            content: "Compatible vehicles content goes here...",
        },
        {
            id: "original-part-number",
            title: "Original part number",
            content: "Original part number content goes here...",
        },
        {
            id: "related-products",
            title: "Related products",
            content: "Related products content goes here...",
        },
        {
            id: "questions-about-product",
            title: "Questions about the product",
            content: "Questions about the product content goes here...",
        },
    ];

    const menuItems = [
        { id: "product-information", label: "Product information" },
        { id: "compatible-vehicles", label: "Compatible vehicles" },
        { id: "original-part-number", label: "Original part number" },
        { id: "related-products", label: "Related products" },
        { id: "questions-about-product", label: "Questions about the product" },
    ];

    const handleMenuClick = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Set ref for each section
    useEffect(() => {
        sectionData.forEach((section) => {
            sectionRefs.current[section.id] = document.getElementById(section.id);
        });
    }, []);

    useEffect(() => {
        let canceled = false;

        shopApi.getRelatedProducts(product.id, 8).then((result) => {
            if (canceled) {
                return;
            }

            setRelatedProducts(result);
        });

        return () => {
            canceled = true;
        };
    }, [product]);

    if (!product) {
        return null;
    }

    const breadcrumb = [
        { title: intl.formatMessage({ id: "LINK_HOME" }), url: url.home() },
        { title: intl.formatMessage({ id: "LINK_SHOP" }), url: url.shop() },
        ...getCategoryPath(product.categories && product.categories[0]).map((x) => ({
            title: x.name,
            url: url.category(x),
        })),
        { title: product.name, url: url.product(product) },
    ];

    const resolveBreadcrumbUrl = (href: IAppLinkHref): string => resolveAppLinkHref(href);

    const featuredAttributes = product.attributes.filter((x) => x.featured);

    const shopFeatures = (
        <div className="product__shop-features shop-features">
            <ul className="shop-features__list">
                <li className="shop-features__item">
                    <div className="shop-features__item-content">
                        <div className="shop-features__item-icon">
                            <FiFreeDelivery48Svg />
                        </div>
                        <div className="shop-features__info">
                            <div className="shop-features__item-title">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_FREE_SHIPPING_TITLE" />
                            </div>
                            <div className="shop-features__item-subtitle">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_FREE_SHIPPING_SUBTITLE" />
                            </div>
                        </div>
                    </div>
                </li>
                <li className="shop-features__item">
                    <div className="shop-features__item-content">
                        <div className="shop-features__item-icon">
                            <Fi24Hours48Svg />
                        </div>
                        <div className="shop-features__info">
                            <div className="shop-features__item-title">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_SUPPORT_TITLE" />
                            </div>
                            <div className="shop-features__item-subtitle">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_SUPPORT_SUBTITLE" />
                            </div>
                        </div>
                    </div>
                </li>
                <li className="shop-features__item">
                    <div className="shop-features__item-content">
                        <div className="shop-features__item-icon">
                            <FiPaymentSecurity48Svg />
                        </div>
                        <div className="shop-features__info">
                            <div className="shop-features__item-title">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_SECURITY_TITLE" />
                            </div>
                            <div className="shop-features__item-subtitle">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_SECURITY_SUBTITLE" />
                            </div>
                        </div>
                    </div>
                </li>
                <li className="shop-features__item">
                    <div className="shop-features__item-content">
                        <div className="shop-features__item-icon">
                            <FiTag48Svg />
                        </div>
                        <div className="shop-features__info">
                            <div className="shop-features__item-title">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_HOT_OFFERS_TITLE" />
                            </div>
                            <div className="shop-features__item-subtitle">
                                <FormattedMessage id="TEXT_SHOP_FEATURE_HOT_OFFERS_SUBTITLE" />
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );

    const productInfoBody = (
        <div className="product__info-body">
            {product.compareAtPrice && (
                <div className="product__badge tag-badge tag-badge--sale">
                    <FormattedMessage id="TEXT_BADGE_SALE" />
                </div>
            )}

            <div className="product__prices-stock">
                <div className="product__prices">
                    {product.compareAtPrice && (
                        <React.Fragment>
                            <div className="product__price product__price--old">
                                <CurrencyFormat value={product.compareAtPrice} />
                            </div>
                            <div className="product__price product__price--new">
                                <CurrencyFormat value={product.price} />
                            </div>
                        </React.Fragment>
                    )}
                    {!product.compareAtPrice && (
                        <div className="product__price product__price--current">
                            <CurrencyFormat value={product.price} />
                        </div>
                    )}
                </div>
                <StockStatusBadge className="product__stock" stock={product.stock} />
            </div>

            <div className="product__meta">
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <FormattedMessage id="TABLE_SKU" />
                            </th>
                            <td>{product.sku}</td>
                        </tr>
                        {product.brand && (
                            <React.Fragment>
                                <tr>
                                    <th>
                                        <FormattedMessage id="TABLE_BRAND" />
                                    </th>
                                    <td>
                                        <AppLink href={url.brand(product.brand)}>{product.brand.name}</AppLink>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <FormattedMessage id="TABLE_COUNTRY" />
                                    </th>
                                    <td>
                                        <FormattedMessage id={`COUNTRY_NAME_${product.brand.country}`} />
                                    </td>
                                </tr>
                            </React.Fragment>
                        )}
                        <tr>
                            <th>
                                <FormattedMessage id="TABLE_PART_NUMBER" />
                            </th>
                            <td>{product.partNumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const productActions = (
        <div className="product__actions">
            {product.stock !== "out-of-stock" && (
                <React.Fragment>
                    <div className="quickview__product-actions-item quickview__product-actions-item--quantity">
                        <Controller<QuickviewFormValues>
                            name="quantity"
                            rules={{ required: true }}
                            render={({ field: { ref: fieldRef, ...fieldProps } }) => (
                                <InputNumber min={1} inputRef={fieldRef} {...fieldProps} />
                            )}
                        />
                    </div>
                    <div className="product__actions-item product__actions-item--addtocart">
                        <button
                            type="submit"
                            className={classNames("btn", "btn-primary", "btn-lg", "btn-block", {
                                "btn-loading": productForm.submitInProgress,
                            })}
                        >
                            <FormattedMessage id="BUTTON_ADD_TO_CART" />
                        </button>
                    </div>
                    <div className="product__actions-divider" />
                </React.Fragment>
            )}
            <AsyncAction
                action={() => wishlistAddItem(product)}
                render={({ run, loading }) => (
                    <button
                        type="button"
                        className={classNames("product__actions-item", "product__actions-item--wishlist", {
                            "product__actions-item--loading": loading,
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
                action={() => compareAddItem(product)}
                render={({ run, loading }) => (
                    <button
                        type="button"
                        className={classNames("product__actions-item", "product__actions-item--compare", {
                            "product__actions-item--loading": loading,
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
        </div>
    );

    const productTagsAndShareLinks = (
        <div className="product__tags-and-share-links">
            {product.tags && product.tags.length > 0 && (
                <div className="product__tags tags tags--sm">
                    <div className="tags__list">
                        {product.tags.map((tag, index) => (
                            <AppLink href="/" key={index}>
                                {tag}
                            </AppLink>
                        ))}
                    </div>
                </div>
            )}
            <ShareLinks className="product__share-links" />
        </div>
    );

    // Prepare structured data
    const productStructuredData = getProductStructuredData(product);
    const breadcrumbStructuredData = getBreadcrumbStructuredData(
        breadcrumb.map((item) => ({
            name: item.title,
            url: resolveBreadcrumbUrl(item.url),
        }))
    );

    const combinedStructuredData = {
        "@context": "https://schema.org",
        "@graph": [productStructuredData, breadcrumbStructuredData],
    };

    // Get availability string
    const availability =
        product.stock === "in-stock" ? "in stock" : product.stock === "out-of-stock" ? "out of stock" : "preorder";

    return (
        <React.Fragment>
            <PageTitle>{product.name}</PageTitle>
            <SEO
                title={product.name}
                description={
                    product.description ||
                    product.excerpt ||
                    `Buy ${product.name} - Quality auto part with fast delivery`
                }
                keywords={`${product.name}, ${product.sku}, ${product.partNumber}, auto parts, car parts`}
                image={product.images && product.images.length > 0 ? product.images[0] : undefined}
                type="product"
                price={product.price}
                currency="SEK"
                availability={availability}
                brand={product.brand?.name}
                structuredData={combinedStructuredData}
            />
            <BlockHeader breadcrumb={breadcrumb} />

            <div className={classNames("block-split", "block-split--product-page")}>
                <div className="container">
                    <div className="block-split__row row no-gutters">

                        <div className="block-split__item block-split__item-content col-auto">
                            <div className={`product product--layout--${layout}`}>
                                <div className="product__body">
                                    <div className="product__section">
                                        <ProductGallery
                                            images={product.images || []}
                                            layout={galleryLayout}
                                            className="product__gallery"
                                        />

                                        <div className="product__header">
                                            <h1 className="product__title">{product.name}</h1>

                                            <div className="product__subtitle">
                                                <CompatibilityStatusBadge className="product__fit" product={product} />
                                            </div>

                                            <div className="product__main">
                                                {product.excerpt && (
                                                    <div className="product__excerpt">{product.excerpt}</div>
                                                )}

                                                <div className="product-card__meta">
                                                    <div className="product-card__meta-row">
                                                        <div className="product-card__meta-column">
                                                            <span className="product-card__meta-title">
                                                                <FormattedMessage id="TEXT_ID" />
                                                                {": "}
                                                            </span>
                                                            {product.sku}
                                                        </div>
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
                                                    <div className="product-card__vat-and-shipping-info">
                                                        <FormattedMessage id="TEXT_INCL_VAT" />
                                                        <span> | </span>
                                                        <FormattedMessage id="TEXT_FREE_SHIPPING" />
                                                    </div>

                                                    <React.Fragment>
                                                        <React.Fragment>
                                                            <div className="product-card__quantity-and-cart">
                                                                <div className="product-card__quantity">
                                                                    <select
                                                                        className="product-card__quantity-select"
                                                                        defaultValue="1"
                                                                    >
                                                                        {Array.from(
                                                                            { length: 10 },
                                                                            (_, i) => i + 1
                                                                        ).map((number) => (
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
                                                                            className={classNames(
                                                                                "product-card__addtocart-full",
                                                                                {
                                                                                    "product-card__addtocart-full--loading":
                                                                                        loading,
                                                                                }
                                                                            )}
                                                                            onClick={run}
                                                                        >
                                                                            <FormattedMessage id="BUTTON_ADD_TO_CART" />
                                                                        </button>
                                                                    )}
                                                                />
                                                                <div>
                                                                    <AsyncAction
                                                                        action={() => addToWishlist()}
                                                                        render={({ run, loading }) => (
                                                                            <button
                                                                                type="button"
                                                                                className={classNames(
                                                                                    "product-card__wishlist",
                                                                                    {
                                                                                        "product-card__wishlist--loading":
                                                                                            loading,
                                                                                    }
                                                                                )}
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
                                                                                className={classNames(
                                                                                    "product-card__compare",
                                                                                    {
                                                                                        "product-card__compare--loading":
                                                                                            loading,
                                                                                    }
                                                                                )}
                                                                                onClick={run}
                                                                            >
                                                                                <Compare16Svg />
                                                                                <span>
                                                                                    <FormattedMessage id="BUTTON_ADD_TO_COMPARE" />
                                                                                </span>
                                                                            </button>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    </React.Fragment>
                                                </div>

                                                <div className="vehicle-compatibility">
                                                    <div className="compatibility-content">
                                                        <div className="compatibility-icon">
                                                            <FaCheckCircle />
                                                        </div>
                                                        <div className="compatibility-text">
                                                            <FormattedMessage id="VEHICLE_COMPATIBILITY_TEXT" />{" "}
                                                            <button className="compatibility-link">
                                                                <FormattedMessage id="WILL_IT_REALLY_FIT" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="stock-info">
                                                    <div className="stock-icon">
                                                        <FaBoxes />
                                                    </div>
                                                    <span className="stock-status">
                                                        <FormattedMessage id="STOCK_IN_STOCK" />
                                                    </span>
                                                    <span className="stock-separator">.</span>
                                                    <span className="price-valid">
                                                        <FormattedMessage id="PRICE_VALID_UNTIL" />: 2025-10-30
                                                    </span>
                                                </div>

                                                <div className="product-card__shipping-info">
                                                    {/* Left Side - Shipping Information */}
                                                    <div className="product-card__shipping-details">
                                                        <div className="product-card__shipping-info__content">
                                                            <div className="product-card__shipping-info__icon">
                                                                <FaShippingFast />
                                                            </div>
                                                            <div className="product-card__shipping-info__text">
                                                                <div className="shipping-title">
                                                                    <FormattedMessage id="SHIPPED_FROM_STOCKHOLM" />
                                                                    <FaInfoCircle className="shipping-info-icon" />
                                                                </div>
                                                                <div className="product-card__shipping-info__date">
                                                                    Måndag (2026-02-02) <span className="shipping-price">från 69 kr</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Side - Payment Icons */}
                                                    <div className="product-card__payment-methods">
                                                        <div className="payment-icons">
                                                            <div className="payment-icon" title="Klarna">
                                                                <img 
                                                                    src="/Payment link images/Klarna-Logo.wine.svg" 
                                                                    alt="Klarna" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                            <div className="payment-icon" title="Apple Pay">
                                                                <img 
                                                                    src="/Payment link images/Apple_Pay-Logo.wine.svg" 
                                                                    alt="Apple Pay" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                            <div className="payment-icon" title="Mastercard">
                                                                <img 
                                                                    src="/Payment link images/Mastercard-Logo.wine.svg" 
                                                                    alt="Mastercard" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                            <div className="payment-icon" title="Visa">
                                                                <img 
                                                                    src="/Payment link images/Visa_Inc.-Logo.wine.svg" 
                                                                    alt="Visa" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                            <div className="payment-icon" title="PayPal">
                                                                <img 
                                                                    src="/Payment link images/PayPal-Logo.wine.svg" 
                                                                    alt="PayPal" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                            <div className="payment-icon" title="Swish">
                                                                <img 
                                                                    src="/Payment link images/Swish_(payment)-Logo.wine.svg" 
                                                                    alt="Swish" 
                                                                    style={{ maxWidth: '55px', maxHeight: '55px', width: 'auto', height: 'auto' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Technical Features from TecDoc */}
                                                {tecdocLoading ? (
                                                    <div className="product-card__features">
                                                        <div className="product-card__features-columns one-column">
                                                            <div className="product-card__features-column">
                                                                {Array.from({ length: 4 }).map((_, index) => (
                                                                    <div key={index} className="product-card__feature-item">
                                                                        <span style={{ display: 'inline-block', width: '60%', height: '1rem', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : features.length > 0 ? (
                                                    <div className="product-card__features">
                                                        <div
                                                            className={`product-card__features-columns ${
                                                                showAllFeatures ? "two-columns" : "one-column"
                                                            }`}
                                                        >
                                                            <div className="product-card__features-column">
                                                                {displayedFeatures
                                                                    .slice(
                                                                        0,
                                                                        showAllFeatures
                                                                            ? Math.ceil(displayedFeatures.length / 2)
                                                                            : 4
                                                                    )
                                                                    .map((spec, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="product-card__feature-item"
                                                                        >
                                                                            {spec.name}
                                                                            {": "}
                                                                            <span className="product-card__feature-value">
                                                                                {spec.value}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                            </div>

                                                            {showAllFeatures && (
                                                                <div className="product-card__features-column">
                                                                    {displayedFeatures
                                                                        .slice(Math.ceil(displayedFeatures.length / 2))
                                                                        .map((spec, index) => (
                                                                            <div
                                                                                key={
                                                                                    index +
                                                                                    Math.ceil(displayedFeatures.length / 2)
                                                                                }
                                                                                className="product-card__feature-item"
                                                                            >
                                                                                {spec.name}
                                                                                {": "}
                                                                                <span className="product-card__feature-value">
                                                                                    {spec.value}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {hasMoreFeatures && (
                                                            <button
                                                                className="product-card__show-more-btn"
                                                                onClick={() => setShowAllFeatures(!showAllFeatures)}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        showAllFeatures
                                                                            ? "BUTTON_HIDE_ALL_FEATURES"
                                                                            : "BUTTON_SHOW_ALL_FEATURES"
                                                                    }
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : null}

                                                <div className="safety-info-link">
                                                    <div className="safety-info-text">
                                                        <FormattedMessage id="SAFETY_PRODUCT_INFO" />
                                                    </div>
                                                    <button className="safety-info-button">
                                                        <FormattedMessage id="MANUFACTURER_INFO" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product__info">{shopFeatures}</div>
                                    <div className="product-info-container">
                                        {/* Two Column Layout for first 4 sections */}
                                        <div className="product-info-layout">
                                            {/* Left Column - Content Sections */}
                                            <div className="product-info-content">
                                                {sections.map((section) => (
                                                    <section
                                                        key={section.id}
                                                        id={section.id}
                                                        className={`product-info-section ${
                                                            activeSection === section.id ? "active" : ""
                                                        }`}
                                                    >
                                                        <div className="section-content">{section.component}</div>
                                                    </section>
                                                ))}
                                            </div>

                                            {/* Right Column - Navigation Menu */}
                                            <div className="product-info-navigation" style={{ position: 'sticky', top: '10px', alignSelf: 'start', zIndex: 100 }}>
                                                <nav className="navigation-menu">
                                                    <ul className="menu-list">
                                                        {menuItems.map((item) => (
                                                            <li key={item.id} className="menu-item">
                                                                <button
                                                                    className={`menu-button ${
                                                                        activeSection === item.id ? "active" : ""
                                                                    }`}
                                                                    onClick={() => handleMenuClick(item.id)}
                                                                >
                                                                    {item.label}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>

                                        {/* Full Width Related Products Section */}
                                        {relatedProducts.length > 0 && (
                                            <React.Fragment>
                                                <BlockSpace layout="divider-nl" />

                                                <BlockProductsCarousel
                                                    blockTitle={intl.formatMessage({ id: "HEADER_RELATED_PRODUCTS" })}
                                                    products={relatedProducts}
                                                    layout={layout === "sidebar" ? "grid-4-sidebar" : "grid-5"}
                                                />
                                            </React.Fragment>
                                        )}

                                        {/* Full Width Questions Section */}
                                        <section
                                            id="questions-about-product"
                                            className={`product-info-section full-width-section ${
                                                activeSection === "questions-about-product" ? "active" : ""
                                            }`}
                                        >
                                            <div className="section-content">
                                                <ProductQuestion productName={product.name} />
                                            </div>
                                        </section>
                                    </div>{" "}
                                    {/* <ProductTabs className="product__tabs" product={product} layout={layout} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default ShopPageProduct;
