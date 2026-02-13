// react
import React, { useRef } from 'react';
// third-party
import classNames from 'classnames';
import Slick from 'react-slick';
import { FormattedMessage } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import AppSlick from '~/components/shared/AppSlick';
import Arrow from '~/components/shared/Arrow';
import Decor from '~/components/shared/Decor';
import ProductCard from '~/components/shared/ProductCard';
import Timer from '~/components/shared/Timer';
import { productGrid5Preset } from '~/components/shared/slickPresets';
import { IProduct } from '~/interfaces/product';

interface Props {
    products: IProduct[];
    loading?: boolean;
    showHeader?: boolean; // when false, hide Deal Zone header/timer
}

const slickSettings = productGrid5Preset({ dots: true });

function BlockSale(props: Props) {
    const { products, loading = false, showHeader = true } = props;
    const slickRef = useRef<Slick>(null);

    const handleNextClick = () => {
        if (slickRef.current) {
            slickRef.current.slickNext();
        }
    };

    const handlePrevClick = () => {
        if (slickRef.current) {
            slickRef.current.slickPrev();
        }
    };

    const rootClasses = classNames('block', 'block-sale', { 'block-sale--loading': loading });

    return (
        <div className={rootClasses}>
            <div className="block-sale__content">
                {showHeader && (
                <div className="block-sale__header">
                    <div className="block-sale__title">
                        <FormattedMessage id="HEADER_DEAL_ZONE_TITLE" />
                    </div>
                    {/* <div className="block-sale__subtitle">
                        <FormattedMessage id="HEADER_DEAL_ZONE_SUBTITLE" />
                    </div> */}
                    <div className="block-sale__timer">
                        <Timer time={3 * 24 * 60 * 60} />
                    </div>
                    <div className="block-sale__controls">
                        <Arrow
                            className="block-sale__arrow block-sale__arrow--prev"
                            direction="prev"
                            onClick={handlePrevClick}
                        />
                        <div className="block-sale__link">
                            <AppLink href="/">
                                <FormattedMessage id="LINK_VIEW_ALL_AVAILABLE_OFFERS" />
                            </AppLink>
                        </div>
                        <Arrow
                            className="block-sale__arrow block-sale__arrow--next"
                            direction="next"
                            onClick={handleNextClick}
                        />
                        <Decor type="center" className="block-sale__header-decor" />
                    </div>
                </div>
                )}
                <div className="block-sale__body">
                    <Decor type="bottom" className="block-sale__body-decor" />
                    <div className="block-sale__loader" />
                    <div className="container">
                        <div className="block-sale__carousel">
                            <AppSlick ref={slickRef} {...slickSettings}>
                                {products.map((product) => (
                                    <div key={product.id} className="block-sale__item">
                                        <ProductCard
                                            product={product}
                                            exclude={['features', 'list-buttons']}
                                        />
                                    </div>
                                ))}
                            </AppSlick>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockSale);
