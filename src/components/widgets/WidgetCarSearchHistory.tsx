// react
import React from 'react';
// third-party
import { FormattedMessage } from 'react-intl';
// application
import { useCarSearchHistory } from '~/hooks/useCarSearchHistory';
import { ICarSearchHistoryItem } from '~/services/car-search-history';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import { ArrowRoundedRight7x11Svg } from '~/svg';

interface Props {
    title?: string;
    maxItems?: number;
    onItemClick?: (item: ICarSearchHistoryItem) => void;
    showGarageLink?: boolean;
}

function WidgetCarSearchHistory(props: Props) {
    const { title = 'Recent Searches', maxItems = 10, onItemClick, showGarageLink = true } = props;
    const { history, isLoading, clearHistory, removeItem } = useCarSearchHistory();

    if (isLoading) {
        return (
            <div className="widget widget-car-history">
                <h4 className="widget__title">{title}</h4>
                <div className="widget__content">
                    <div className="text-muted p-3">
                        <FormattedMessage id="TEXT_LOADING" defaultMessage="Loading..." />
                    </div>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="widget widget-car-history">
                <h4 className="widget__title">{title}</h4>
                <div className="widget__content">
                    <div className="text-muted p-3">
                        <FormattedMessage id="TEXT_NO_SEARCH_HISTORY" defaultMessage="No search history yet" />
                    </div>
                </div>
            </div>
        );
    }

    const displayHistory = history.slice(0, maxItems);

    const getVehicleTitle = (item: ICarSearchHistoryItem) => {
        const data = item.data as any;
        const brand = data.C_merke || '';
        const model = data.C_modell || '';
        const type = data.C_typ || '';
        
        if (brand && model) {
            return `${brand} ${model}${type ? ` (${type})` : ''}`;
        }
        
        if (item.searchMetadata?.registrationNumber) {
            return `${brand || 'Vehicle'} (${item.searchMetadata.registrationNumber})`;
        }
        
        return 'Unknown Vehicle';
    };

    const getVehicleDetails = (item: ICarSearchHistoryItem) => {
        const data = item.data as any;
        const details: string[] = [];
        
        // If we have engine description from manual search or metadata, use it
        const engineDesc = data.engineDescription || item.searchMetadata?.engineDescription;
        
        if (engineDesc) {
            // Parse engine description: e.g., "1.4 TURBO (103 kW/140 PS)" or "320 d SEDAN [G20] (140 kW)"
            const desc = engineDesc;
            
            // Try to extract fuel type (DIESEL, BENSIN, etc.)
            if (desc.toLowerCase().includes('diesel') || desc.includes(' d ') || desc.includes(' D ')) {
                details.push('DIESEL');
            } else {
                details.push('BENSIN'); // Default to gasoline
            }
            
            // Try to extract displacement from description (e.g., "1.4", "2.0")
            const displacementMatch = desc.match(/(\d+\.\d+)/);
            if (displacementMatch) {
                details.push(`${displacementMatch[1]}L`);
            }
            
            // Extract power from parentheses (e.g., "(103 kW/140 PS)" or "(140 kW)")
            const powerMatch = desc.match(/\(([^)]+)\)/);
            if (powerMatch) {
                details.push(powerMatch[1]);
            }
            
            // Extract engine code (uppercase letters/numbers combo)
            const engineCodeMatch = desc.match(/\b([A-Z]\d+[A-Z]?\d*[A-Z]?)\b/);
            if (engineCodeMatch && !engineCodeMatch[1].match(/^(PS|KW)$/)) {
                details.push(engineCodeMatch[1]);
            }
            
            return details.join(' ');
        }
        
        // Otherwise use standard fields from ICarData
        // Fuel type and engine info
        if (data.C_bransle) {
            details.push(data.C_bransle);
        }
        
        // Displacement
        if (data.C_lit) {
            details.push(`${data.C_lit}L`);
        } else if (data.C_slagvolym) {
            details.push(`${data.C_slagvolym}ccm`);
        }
        
        // Power
        if (data.C_kw && data.C_hk) {
            details.push(`${data.C_kw}kW/${data.C_hk}PS`);
        } else if (data.C_hk) {
            details.push(`${data.C_hk}PS`);
        } else if (data.C_kw) {
            details.push(`${data.C_kw}kW`);
        }
        
        // Engine code
        if (data.C_motorkod) {
            details.push(data.C_motorkod);
        }
        
        return details.join(' ');
    };

    const handleItemClick = (item: ICarSearchHistoryItem) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };

    const handleRemoveClick = (e: React.MouseEvent, itemId: string) => {
        e.stopPropagation();
        e.preventDefault();
        removeItem(itemId);
    };

    return (
        <div className="widget widget-car-history">
            <h4 className="widget__title">{title}</h4>
            <div className="widget__content">
                <div className="vehicles-list">
                    {displayHistory.map((item) => (
                        <div 
                            key={item.id} 
                            className="vehicles-list__item"
                            onClick={() => handleItemClick(item)}
                            role="button"
                            tabIndex={0}
                            style={{ cursor: 'pointer' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleItemClick(item);
                                }
                            }}
                        >
                            <div className="vehicles-list__item-info">
                                <div className="vehicles-list__item-name">
                                    {getVehicleTitle(item)}
                                </div>
                                <div className="vehicles-list__item-details">
                                    {getVehicleDetails(item)}
                                </div>
                            </div>
                            
                            <div className="vehicles-list__item-actions">
                                <button
                                    type="button"
                                    className="vehicles-list__item-remove"
                                    onClick={(e) => handleRemoveClick(e, item.id)}
                                    aria-label="Remove from history"
                                    title="Remove from history"
                                >
                                    ×
                                </button>
                                <button
                                    type="button"
                                    className="vehicles-list__item-arrow"
                                    aria-label="Select vehicle"
                                >
                                    <ArrowRoundedRight7x11Svg />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="widget__footer">
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={clearHistory}
                        >
                            <FormattedMessage id="BUTTON_CLEAR_HISTORY" defaultMessage="Clear History" />
                        </button>
                        
                        {showGarageLink && (
                            <AppLink href={url.accountGarage()} className="btn btn-sm btn-primary">
                                <FormattedMessage id="LINK_ACCOUNT_GARAGE" defaultMessage="Garage" />
                            </AppLink>
                        )}
                    </div>
                    
                    {history.length > maxItems && (
                        <div className="text-muted small mt-2 text-center">
                            <FormattedMessage 
                                id="TEXT_SHOWING_OF_TOTAL"
                                defaultMessage="Showing {showing} of {total}"
                                values={{ showing: maxItems, total: history.length }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WidgetCarSearchHistory;

