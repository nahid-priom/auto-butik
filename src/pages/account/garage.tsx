// react
import React, { useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AccountLayout from '~/components/account/AccountLayout';
import PageTitle from '~/components/shared/PageTitle';
import CarLookupForm from '~/components/shared/CarLookupForm';
import { ICarData, IWheelData } from '~/interfaces/car';
import { RecycleBin16Svg } from '~/svg';
import { useGarage } from '~/contexts/GarageContext';

function Page() {
    const intl = useIntl();
    const { vehicles, currentCarId, addVehicle, removeVehicle, clearGarage, setCurrentCar } = useGarage();
    const [selectedCar, setSelectedCar] = useState<ICarData | IWheelData | null>(null);
    
    // Get current car
    const currentCar = React.useMemo(() => {
        return vehicles.find(v => v.id === currentCarId);
    }, [vehicles, currentCarId]);
    
    // All vehicles sorted by addedAt for history
    const sortedVehicles = React.useMemo(() => {
        return [...vehicles].sort((a, b) => b.addedAt - a.addedAt);
    }, [vehicles]);

    return (
        <div className="card">
            <PageTitle>{intl.formatMessage({ id: 'HEADER_GARAGE' })}</PageTitle>

            {/* Current Car Section */}
            {currentCar && (
                <React.Fragment>
                    <div className="card-header">
                        <h5>
                            <FormattedMessage id="TEXT_CURRENT_CAR" />
                        </h5>
                    </div>
                    <div className="card-divider" />
                    
                    <div className="card-body card-body--padding--2">
                        <div className="vehicles-list vehicles-list--layout--account">
                            <div className="vehicles-list__body">
                                <div className="vehicles-list__item vehicles-list__item--current">
                                    <div className="vehicles-list__item-info">
                                        <div className="vehicles-list__item-name">
                                            {(currentCar.data as any).C_merke} {(currentCar.data as any).C_modell} {(currentCar.data as any).C_typ}
                                        </div>
                                        <div className="vehicles-list__item-details">
                                            <div className="text-muted small">
                                                {(currentCar.data as any).RegNr && (
                                                    <div><strong>Reg Nr:</strong> {(currentCar.data as any).RegNr}</div>
                                                )}
                                                {(((currentCar.data as any).Ar_fran || (currentCar.data as any).C_fran_ar) || ((currentCar.data as any).Ar_till || (currentCar.data as any).C_till_ar)) && (
                                                    <div>
                                                        <strong>Years:</strong> {((currentCar.data as any).Ar_fran || (currentCar.data as any).C_fran_ar) || '-'} – {((currentCar.data as any).Ar_till || (currentCar.data as any).C_till_ar) || '-'}
                                                    </div>
                                                )}
                                                {((currentCar.data as any).C_lit || (currentCar.data as any).C_kw || (currentCar.data as any).C_hk || (currentCar.data as any).C_motorkod) && (
                                                    <div>
                                                        <strong>Engine:</strong> {((currentCar.data as any).C_lit && `${(currentCar.data as any).C_lit}L`) || ''}{((currentCar.data as any).C_kw || (currentCar.data as any).C_hk) && ' · '}{((currentCar.data as any).C_kw && `${(currentCar.data as any).C_kw} kW`) || ''}{((currentCar.data as any).C_kw && (currentCar.data as any).C_hk) && ' / '}{((currentCar.data as any).C_hk && `${(currentCar.data as any).C_hk} HP`) || ''}{(currentCar.data as any).C_motorkod && ` · ${(currentCar.data as any).C_motorkod}`}
                                                    </div>
                                                )}
                                                {((currentCar.data as any).C_bransle || (currentCar.data as any).C_hjuldrift || (currentCar.data as any).C_vaxellada) && (
                                                    <div>
                                                        <strong>Fuel/Drive/Trans:</strong> {[(currentCar.data as any).C_bransle, (currentCar.data as any).C_hjuldrift, (currentCar.data as any).C_vaxellada].filter(Boolean).join(' · ')}
                                                    </div>
                                                )}
                                                {(currentCar.data as any).C_chassi && (
                                                    <div><strong>Chassis:</strong> {(currentCar.data as any).C_chassi}</div>
                                                )}
                                                {(currentCar.data as any).WHEELID && (
                                                    <div><strong>Wheel ID:</strong> {(currentCar.data as any).WHEELID}</div>
                                                )}
                                                {((currentCar.data as any).BULTCIRKEL || (currentCar.data as any).NAVHAL || (currentCar.data as any).ET) && (
                                                    <div>
                                                        <strong>Bolt/Centre/ET:</strong> {[(currentCar.data as any).BULTCIRKEL, (currentCar.data as any).NAVHAL, (currentCar.data as any).ET].filter(Boolean).join(' · ')}
                                                    </div>
                                                )}
                                                {((currentCar.data as any).Min_Tum || (currentCar.data as any).Max_Tum) && (
                                                    <div><strong>Rim Range:</strong> {(currentCar.data as any).Min_Tum}" – {(currentCar.data as any).Max_Tum}"</div>
                                                )}
                                                {(currentCar.data as any).dack_dim_fram && (
                                                    <div><strong>Front Tires:</strong> {(currentCar.data as any).dack_dim_fram}</div>
                                                )}
                                                {(currentCar.data as any).dack_dim_bak && (
                                                    <div><strong>Rear Tires:</strong> {(currentCar.data as any).dack_dim_bak}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={classNames('vehicles-list__item-remove')}
                                        onClick={() => setCurrentCar(null)}
                                        title="Remove from current"
                                    >
                                        <RecycleBin16Svg />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-divider" />
                </React.Fragment>
            )}

            {/* Garage History Section */}
            {vehicles.length > 0 && (
                <React.Fragment>
                    <div className="card-header">
                        <h5><FormattedMessage id="HEADER_GARAGE" /></h5>
                    </div>
                    <div className="card-divider" />

                    <div className="card-body card-body--padding--2">
                        <div className="vehicles-list vehicles-list--layout--account">
                            <div className="vehicles-list__body">
                                {sortedVehicles.map((v) => (
                                    <div 
                                        key={v.id} 
                                        className={classNames('vehicles-list__item', {
                                            'vehicles-list__item--current': v.id === currentCarId
                                        })}
                                        onClick={() => setCurrentCar(v.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="vehicles-list__item-info">
                                            <div className="vehicles-list__item-name">
                                                {(v.data as any).C_merke} {(v.data as any).C_modell} {(v.data as any).C_typ}
                                            </div>
                                            <div className="vehicles-list__item-details">
                                                <div className="text-muted small">
                                                    {(v.data as any).RegNr && (
                                                        <div><strong>Reg Nr:</strong> {(v.data as any).RegNr}</div>
                                                    )}
                                                    {(((v.data as any).Ar_fran || (v.data as any).C_fran_ar) || ((v.data as any).Ar_till || (v.data as any).C_till_ar)) && (
                                                        <div>
                                                            <strong>Years:</strong> {((v.data as any).Ar_fran || (v.data as any).C_fran_ar) || '-'} – {((v.data as any).Ar_till || (v.data as any).C_till_ar) || '-'}
                                                        </div>
                                                    )}
                                                    {((v.data as any).C_lit || (v.data as any).C_kw || (v.data as any).C_hk || (v.data as any).C_motorkod) && (
                                                        <div>
                                                            <strong>Engine:</strong> {((v.data as any).C_lit && `${(v.data as any).C_lit}L`) || ''}{((v.data as any).C_kw || (v.data as any).C_hk) && ' · '}{((v.data as any).C_kw && `${(v.data as any).C_kw} kW`) || ''}{((v.data as any).C_kw && (v.data as any).C_hk) && ' / '}{((v.data as any).C_hk && `${(v.data as any).C_hk} HP`) || ''}{(v.data as any).C_motorkod && ` · ${(v.data as any).C_motorkod}`}
                                                        </div>
                                                    )}
                                                    {((v.data as any).C_bransle || (v.data as any).C_hjuldrift || (v.data as any).C_vaxellada) && (
                                                        <div>
                                                            <strong>Fuel/Drive/Trans:</strong> {[(v.data as any).C_bransle, (v.data as any).C_hjuldrift, (v.data as any).C_vaxellada].filter(Boolean).join(' · ')}
                                                        </div>
                                                    )}
                                                    {(v.data as any).C_chassi && (
                                                        <div><strong>Chassis:</strong> {(v.data as any).C_chassi}</div>
                                                    )}
                                                    {(v.data as any).WHEELID && (
                                                        <div><strong>Wheel ID:</strong> {(v.data as any).WHEELID}</div>
                                                    )}
                                                    {((v.data as any).BULTCIRKEL || (v.data as any).NAVHAL || (v.data as any).ET) && (
                                                        <div>
                                                            <strong>Bolt/Centre/ET:</strong> {[(v.data as any).BULTCIRKEL, (v.data as any).NAVHAL, (v.data as any).ET].filter(Boolean).join(' · ')}
                                                        </div>
                                                    )}
                                                    {((v.data as any).Min_Tum || (v.data as any).Max_Tum) && (
                                                        <div><strong>Rim Range:</strong> {(v.data as any).Min_Tum}" – {(v.data as any).Max_Tum}"</div>
                                                    )}
                                                    {(v.data as any).dack_dim_fram && (
                                                        <div><strong>Front Tires:</strong> {(v.data as any).dack_dim_fram}</div>
                                                    )}
                                                    {(v.data as any).dack_dim_bak && (
                                                        <div><strong>Rear Tires:</strong> {(v.data as any).dack_dim_bak}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={classNames('vehicles-list__item-remove')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeVehicle(v.id);
                                            }}
                                        >
                                            <RecycleBin16Svg />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="button" className="btn btn-sm btn-secondary" onClick={clearGarage}>
                                Clear Garage
                            </button>
                        </div>
                    </div>
                    <div className="card-divider" />
                </React.Fragment>
            )}

            <div className="card-header">
                <h5><FormattedMessage id="HEADER_ADD_VEHICLE" /></h5>
            </div>
            <div className="card-divider" />

            <div className="card-body card-body--padding--2">
                <CarLookupForm onCarSelected={setSelectedCar} />

                {selectedCar && (
                    <div className="mt-3 p-3 border rounded">
                        <h6 className="mb-2">Selected Vehicle</h6>
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

                <div className="mt-4 pt-3">
                    <button
                        type="button"
                        className={classNames('btn', 'btn-primary')}
                        disabled={!selectedCar}
                        onClick={() => { if (selectedCar) { addVehicle(selectedCar); setSelectedCar(null); } }}
                    >
                        <FormattedMessage id="BUTTON_ADD_VEHICLE" />
                    </button>
                </div>
            </div>
        </div>
    );
}

Page.Layout = AccountLayout;

export default Page;
