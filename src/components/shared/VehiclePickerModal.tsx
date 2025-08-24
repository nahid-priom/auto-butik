// react
import React, { useCallback, useEffect, useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
// application
import AsyncAction from '~/components/shared/AsyncAction';
import RadioButton from '~/components/shared/RadioButton';
import CarLookupForm from '~/components/shared/CarLookupForm';
import { ICarData, IWheelData } from '~/interfaces/car';
import { Cross12Svg, RecycleBin16Svg } from '~/svg';
import { IVehicle } from '~/interfaces/vehicle';
import { useGarage } from '~/contexts/GarageContext';

interface Props {
    value?: IVehicle | null;
    isOpen?: boolean;
    onClose?: () => void;
    onSelect?: (vehicle: IVehicle | null) => void;
}

function VehiclePickerModal(props: Props) {
    const {
        value = null,
        isOpen = false,
        onClose,
        onSelect,
    } = props;
    const { vehicles, addVehicle } = useGarage();
    const [currentPanel, setCurrentPanel] = useState('list');
    const [innerValue, setInnerValue] = useState<IVehicle | null>(null);
    const [selectedCar, setSelectedCar] = useState<ICarData | IWheelData | null>(null);

    const onSelectClick = () => {
        if (onSelect) {
            onSelect(innerValue);
        }
        if (onClose) {
            onClose();
        }
    };

    const toggle = useCallback(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [isOpen, onClose]);

    const onAddVehicleClick = async () => {
        if (selectedCar) {
            addVehicle(selectedCar);
        }
        if (onClose) onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentPanel('list');
            setInnerValue(value);
        }
    }, [isOpen, value]);

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="vehicle-picker-modal">
            <button type="button" className="vehicle-picker-modal__close" onClick={onClose}>
                <Cross12Svg />
            </button>

            <div
                className={classNames('vehicle-picker-modal__panel', {
                    'vehicle-picker-modal__panel--active': currentPanel === 'list' && vehicles.length !== 0,
                })}
            >
                <div className="vehicle-picker-modal__title card-title">
                    <FormattedMessage id="HEADER_SELECT_VEHICLE" />
                </div>

                <div className="vehicle-picker-modal__text">
                    <FormattedMessage id="TEXT_SELECT_VEHICLE_TO_FIND_EXACT_FIT_PARTS" />
                </div>

                <div className="vehicles-list">
                    <div className="vehicles-list__body">
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="vehicles-list__item">
                            <RadioButton
                                className="vehicles-list__item-radio"
                                checked={innerValue === null}
                                onChange={() => setInnerValue(null)}
                            />
                            <span className="vehicles-list__item-info">
                                <span className="vehicles-list__item-name">
                                    <FormattedMessage id="TEXT_ALL_VEHICLES" />
                                </span>
                            </span>
                        </label>

                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-secondary btn-block mt-2 vehicle-picker-modal__add-button"
                    onClick={() => setCurrentPanel('form')}
                >
                    <FormattedMessage id="BUTTON_ADD_VEHICLE_LONG" />
                </button>

                <div className="vehicle-picker-modal__actions">
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={onClose}
                    >
                        <FormattedMessage id="BUTTON_CANCEL" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={onSelectClick}
                    >
                        <FormattedMessage id="BUTTON_SELECT_VEHICLE" />
                    </button>
                </div>
            </div>

            <div
                className={classNames('vehicle-picker-modal__panel', {
                    'vehicle-picker-modal__panel--active': currentPanel === 'form' || vehicles.length === 0,
                })}
            >
                <div className="vehicle-picker-modal__title card-title">
                    <FormattedMessage id="HEADER_ADD_VEHICLE" />
                </div>
                <CarLookupForm onCarSelected={setSelectedCar} />
                {selectedCar && (
                    <div className="mt-3 p-3 border rounded">
                        <div className="mb-2 font-weight-bold">Selected Vehicle</div>
                        <div className="text-muted small">
                            <div><strong>Brand:</strong> {(selectedCar as any).C_merke}</div>
                            <div><strong>Model:</strong> {(selectedCar as any).C_modell}</div>
                            <div><strong>Type:</strong> {(selectedCar as any).C_typ}</div>
                            <div><strong>Wheel ID:</strong> {(selectedCar as any).WHEELID}</div>
                            <div><strong>Bolt Pattern:</strong> {(selectedCar as any).BULTCIRKEL}</div>
                            <div><strong>Center Bore:</strong> {(selectedCar as any).NAVHAL}</div>
                            <div><strong>ET:</strong> {(selectedCar as any).ET}</div>
                            <div><strong>Front Tires:</strong> {(selectedCar as any).dack_dim_fram}</div>
                            {(selectedCar as any).dack_dim_bak && (
                                <div><strong>Rear Tires:</strong> {(selectedCar as any).dack_dim_bak}</div>
                            )}
                        </div>
                    </div>
                )}
                <div className="vehicle-picker-modal__actions">
                    {vehicles.length !== 0 && (
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setCurrentPanel('list')}
                        >
                            <FormattedMessage id="BUTTON_BACK_TO_LIST" />
                        </button>
                    )}
                    <button
                        type="button"
                        className={classNames('btn', 'btn-sm', 'btn-primary')}
                        disabled={!selectedCar}
                        onClick={onAddVehicleClick}
                    >
                        <FormattedMessage id="BUTTON_ADD_VEHICLE" />
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default VehiclePickerModal;
