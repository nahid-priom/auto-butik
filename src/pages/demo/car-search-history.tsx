// react
import React, { useState } from 'react';
// application
import PageHeader from '~/components/shared/PageHeader';
import CarLookupForm from '~/components/shared/CarLookupForm';
import WidgetCarSearchHistory from '~/components/widgets/WidgetCarSearchHistory';
import { ICarData, IWheelData } from '~/interfaces/car';
import { ICarSearchHistoryItem } from '~/services/car-search-history';

function Page() {
    const [selectedCar, setSelectedCar] = useState<ICarData | IWheelData | null>(null);

    const breadcrumb = [
        { title: 'Home', url: '/' },
        { title: 'Demo', url: '/demo' },
        { title: 'Car Search History', url: '' },
    ];

    const handleHistoryItemClick = (item: ICarSearchHistoryItem) => {
        setSelectedCar(item.data);
        // Scroll to the top to show the selected car details
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getVehicleDetails = (car: ICarData | IWheelData) => {
        const data = car as any;
        return [
            { label: 'Brand', value: data.C_merke },
            { label: 'Model', value: data.C_modell },
            { label: 'Type', value: data.C_typ },
            { label: 'Engine Code', value: data.C_motorkod },
            { label: 'Year', value: data.Fordons_ar || `${data.Ar_fran || ''} - ${data.Ar_till || ''}` },
            { label: 'Power (kW)', value: data.C_kw },
            { label: 'Power (HP)', value: data.C_hk },
            { label: 'Displacement', value: data.C_slagvolym },
            { label: 'Fuel Type', value: data.C_bransle },
            { label: 'Wheel ID', value: data.WHEELID },
            { label: 'Bolt Circle', value: data.BULTCIRKEL },
            { label: 'Bolt Diameter', value: data.BULTDIMETER },
            { label: 'Center Bore', value: data.NAVHAL },
            { label: 'ET', value: data.ET },
            { label: 'Front Tires', value: data.dack_dim_fram },
            { label: 'Rear Tires', value: data.dack_dim_bak },
            { label: 'Front Width', value: data.Bredd_Fram },
            { label: 'Rear Width', value: data.Bredd_Bak },
        ].filter(item => item.value);
    };

    return (
        <React.Fragment>
            <PageHeader breadcrumb={breadcrumb} header="Car Search History Demo" />

            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className="block">
                            <div className="container">
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5>Car Lookup Form</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="text-muted mb-3">
                                            Search for a car using registration number or manual selection.
                                            Each search will be automatically saved to your browsing history.
                                        </p>
                                        <CarLookupForm onCarSelected={setSelectedCar} />
                                    </div>
                                </div>

                                {selectedCar && (
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h5>Selected Vehicle Details</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="alert alert-success mb-3">
                                                <strong>Search Saved!</strong> This search has been automatically
                                                saved to your browsing history.
                                            </div>
                                            <div className="row">
                                                {getVehicleDetails(selectedCar).map((detail, index) => (
                                                    <div key={index} className="col-12 col-md-6 mb-2">
                                                        <strong>{detail.label}:</strong>
                                                        <span className="ml-2 text-muted">{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="card">
                                    <div className="card-header">
                                        <h5>About This Feature</h5>
                                    </div>
                                    <div className="card-body">
                                        <h6>How It Works:</h6>
                                        <ul>
                                            <li>Every car search is automatically saved to browser local storage</li>
                                            <li>Works for both logged-in and non-logged-in users</li>
                                            <li>Stores up to 50 most recent searches</li>
                                            <li>Each search includes full vehicle details and search metadata</li>
                                            <li>Search history persists across browser sessions</li>
                                        </ul>

                                        <h6 className="mt-4">Available APIs:</h6>
                                        <ul>
                                            <li><code>getCarSearchHistory()</code> - Get all search history</li>
                                            <li><code>addCarSearchToHistory()</code> - Add a new search</li>
                                            <li><code>clearCarSearchHistory()</code> - Clear all history</li>
                                            <li><code>removeCarSearchFromHistory()</code> - Remove specific item</li>
                                            <li><code>getMostRecentSearch()</code> - Get the latest search</li>
                                            <li><code>useCarSearchHistory()</code> - React hook for components</li>
                                        </ul>

                                        <h6 className="mt-4">Technical Details:</h6>
                                        <ul>
                                            <li>Storage Key: <code>autobutik_car_search_history</code></li>
                                            <li>Data Structure: Array of <code>ICarSearchHistoryItem</code></li>
                                            <li>Maximum Items: 50 (configurable)</li>
                                            <li>Search Types: <code>registration</code> or <code>manual</code></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="block">
                            <WidgetCarSearchHistory
                                title="Your Search History"
                                maxItems={20}
                                onItemClick={handleHistoryItemClick}
                            />

                            <div className="card mt-4">
                                <div className="card-header">
                                    <h6>Widget Features</h6>
                                </div>
                                <div className="card-body">
                                    <ul className="small">
                                        <li>Click on any item to load vehicle details</li>
                                        <li>Click × to remove individual items</li>
                                        <li>Click "Clear History" to remove all</li>
                                        <li>Shows search type (Registration/Manual)</li>
                                        <li>Displays relative timestamps</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Page;

