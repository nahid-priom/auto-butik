import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Indicator, { IIndicatorController } from '~/components/header/Indicator';
import { useCurrentActiveCar } from '~/contexts/CarContext';
import { Car20Svg } from '~/svg';

interface CarDropdownProps {
    onCloseMenu: () => void;
}

function CarDropdown({ onCloseMenu }: CarDropdownProps) {
    const { currentActiveCar, clearCurrentActiveCar } = useCurrentActiveCar();

    if (!currentActiveCar) {
        return null;
    }

    const { data } = currentActiveCar;

    const handleClearCar = () => {
        clearCurrentActiveCar();
        onCloseMenu();
    };

    return (
        <div className="dropcart">
            <div className="dropcart__header">
                <div className="dropcart__title">
                    <FormattedMessage id="TEXT_CURRENT_ACTIVE_CAR" defaultMessage="Current Active Car" />
                </div>
            </div>
            <div className="dropcart__body">
                <div className="dropcart__item">
                    <div className="dropcart__item-info">
                        <div className="dropcart__item-name">
                            <strong>{data.C_merke} {data.C_modell}</strong>
                        </div>
                        <div className="dropcart__item-meta">
                            <span className="dropcart__item-meta-label">
                                <FormattedMessage id="TEXT_REG_NUMBER" defaultMessage="Reg. Nr:" />
                            </span>
                            <span className="dropcart__item-meta-value">{data.RegNr}</span>
                        </div>
                        <div className="dropcart__item-meta">
                            <span className="dropcart__item-meta-label">
                                <FormattedMessage id="TEXT_MODEL_ID" defaultMessage="Model ID:" />
                            </span>
                            <span className="dropcart__item-meta-value">{data.modell_id}</span>
                        </div>
                        <div className="dropcart__item-meta">
                            <span className="dropcart__item-meta-label">
                                <FormattedMessage id="TEXT_YEAR" defaultMessage="Year:" />
                            </span>
                            <span className="dropcart__item-meta-value">{data.Fordons_ar}</span>
                        </div>
                        <div className="dropcart__item-meta">
                            <span className="dropcart__item-meta-label">
                                <FormattedMessage id="TEXT_ENGINE" defaultMessage="Engine:" />
                            </span>
                            <span className="dropcart__item-meta-value">{data.C_typ} ({data.C_hk} HP)</span>
                        </div>
                        <div className="dropcart__item-meta">
                            <span className="dropcart__item-meta-label">
                                <FormattedMessage id="TEXT_FUEL_TYPE" defaultMessage="Fuel:" />
                            </span>
                            <span className="dropcart__item-meta-value">{data.C_bransle}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dropcart__footer">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleClearCar}
                >
                    <FormattedMessage id="BUTTON_CLEAR_CAR" defaultMessage="Clear Car" />
                </button>
            </div>
        </div>
    );
}

export default function CarIndicator() {
    const { currentActiveCar } = useCurrentActiveCar();
    const carIndicatorCtrl = useRef<IIndicatorController | null>(null);

    if (!currentActiveCar) {
        return null;
    }

    const carIndicatorLabel = <FormattedMessage id="TEXT_INDICATOR_CAR_LABEL" defaultMessage="Current Car" />;
    const carIndicatorValue = `${currentActiveCar.data.C_merke} ${currentActiveCar.data.C_modell}`;

    return (
        <Indicator
            icon={<Car20Svg />}
            label={carIndicatorLabel}
            value={carIndicatorValue}
            trigger="click"
            controllerRef={carIndicatorCtrl}
        >
            <CarDropdown onCloseMenu={() => carIndicatorCtrl.current?.close()} />
        </Indicator>
    );
}
