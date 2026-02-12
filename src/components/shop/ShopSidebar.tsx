/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */

// react
import React, {
    useContext,
    useEffect,
} from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
// application
import WidgetFilters from '~/components/widgets/WidgetFilters';
import WidgetBrandFilter from '~/components/widgets/WidgetBrandFilter';
import WidgetPositionFilter from '~/components/widgets/WidgetPositionFilter';
import WidgetVehicleCategories from '~/components/widgets/WidgetVehicleCategories';
import { Cross12Svg } from '~/svg';
import { SidebarContext } from '~/services/sidebar';
import { useMedia } from '~/store/hooks';
import { IShopPageOffCanvasSidebar } from '~/interfaces/pages';
import { useVehicleCatalogContext } from '~/contexts/VehicleCatalogContext';

interface Props {
    offcanvas: IShopPageOffCanvasSidebar;
    /** When set, render this instead of default filter widgets (e.g. catalog page uses CatalogFiltersSidebar) */
    contentOverride?: React.ReactNode;
}

function ShopSidebar(props: Props) {
    const { offcanvas, contentOverride } = props;
    const [isOpen, setIsOpen] = useContext(SidebarContext);
    const isMobile = useMedia('(max-width: 991px)');
    const catalogContext = useVehicleCatalogContext();

    const rootClasses = classNames('sidebar', `sidebar--offcanvas--${offcanvas}`, {
        'sidebar--open': isOpen,
        'sidebar--catalog-drawer': !!contentOverride,
    });

    const close = () => {
        setIsOpen(false);
    };

    const handleRensa = () => {
        if (catalogContext) {
            catalogContext.setSelectedBrand(null);
            catalogContext.setSelectedPosition(null);
        }
        close();
    };

    useEffect(() => {
        if (isOpen) {
            const bodyWidth = document.body.offsetWidth;

            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${document.body.offsetWidth - bodyWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }, [isOpen]);

    useEffect(() => {
        if (offcanvas === 'mobile' && isOpen && !isMobile) {
            setIsOpen(false);
        }
    }, [offcanvas, isOpen, setIsOpen, isMobile]);

    const showRensa = !!contentOverride && !!catalogContext;

    return (
        <div className={rootClasses}>
            <div className="sidebar__backdrop" onClick={close} />
            <div className="sidebar__body">
                <div className="sidebar__header">
                    <div className="sidebar__title">
                        <FormattedMessage id="HEADER_FILTERS" defaultMessage="Filter" />
                    </div>
                    {showRensa && (
                        <button type="button" className="sidebar__rensabtn" onClick={handleRensa}>
                            <FormattedMessage id="BUTTON_RESET_FILTERS" defaultMessage="Rensa" />
                        </button>
                    )}
                    <button className="sidebar__close" type="button" onClick={close} aria-label="Stäng">
                        <Cross12Svg />
                    </button>
                </div>
                <div className="sidebar__content">
                    {contentOverride ?? (
                        <>
                            <WidgetFilters offcanvasSidebar={offcanvas} />
                            <WidgetBrandFilter offcanvasSidebar={offcanvas} />
                            <WidgetPositionFilter offcanvasSidebar={offcanvas} />
                            <WidgetVehicleCategories offcanvasSidebar={offcanvas} onCategoryClick={close} />
                        </>
                    )}
                </div>
                {contentOverride && (
                    <div className="sidebar__footer">
                        <button type="button" className="sidebar__footerbtn" onClick={close}>
                            <FormattedMessage id="TEXT_VIEW_RESULTS" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(ShopSidebar);
