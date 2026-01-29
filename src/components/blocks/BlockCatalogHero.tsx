// react
import React from 'react';
// third-party
import { useIntl } from 'react-intl';
// application
import { useCurrentActiveCar } from '~/contexts/CarContext';

interface Props {
    title: string;
    subtitle?: string;
}

function BlockCatalogHero(props: Props) {
    const { title, subtitle } = props;
    const { currentActiveCar } = useCurrentActiveCar();
    
    // Get car details for display
    const carDetails = React.useMemo(() => {
        if (!currentActiveCar?.data) return null;
        
        const data = currentActiveCar.data as any;
        const details: {
            brand?: string;
            model?: string;
            type?: string;
            year?: string;
            fuel?: string;
            displacement?: string;
            power?: string;
            engineCode?: string;
        } = {};
        
        // Brand and Model
        if (data.C_merke) details.brand = data.C_merke;
        if (data.C_modell) details.model = data.C_modell;
        if (data.C_typ) details.type = data.C_typ;
        if (data.C_ar) details.year = data.C_ar;
        
        // Fuel type
        if (data.C_bransle) {
            details.fuel = data.C_bransle;
        } else if (data.engineDescription) {
            const desc = data.engineDescription.toLowerCase();
            if (desc.includes('diesel') || desc.includes(' d ') || desc.includes(' d')) {
                details.fuel = 'DIESEL';
            } else {
                details.fuel = 'BENSIN';
            }
        }
        
        // Displacement
        if (data.C_lit) {
            details.displacement = `${data.C_lit}L`;
        } else if (data.C_slagvolym) {
            details.displacement = `${data.C_slagvolym}ccm`;
        } else if (data.engineDescription) {
            const displacementMatch = data.engineDescription.match(/(\d+\.\d+)/);
            if (displacementMatch) {
                details.displacement = `${displacementMatch[1]}L`;
            }
        }
        
        // Power
        if (data.C_kw && data.C_hk) {
            details.power = `${data.C_kw}kW/${data.C_hk}PS`;
        } else if (data.C_hk) {
            details.power = `${data.C_hk}PS`;
        } else if (data.C_kw) {
            details.power = `${data.C_kw}kW`;
        } else if (data.engineDescription) {
            const powerMatch = data.engineDescription.match(/\(([^)]+)\)/);
            if (powerMatch) {
                details.power = powerMatch[1];
            }
        }
        
        // Engine code
        if (data.C_motorkod) {
            details.engineCode = data.C_motorkod;
        } else if (data.engineDescription) {
            const engineCodeMatch = data.engineDescription.match(/\b([A-Z]\d+[A-Z]?\d*[A-Z]?)\b/);
            if (engineCodeMatch && !engineCodeMatch[1].match(/^(PS|KW)$/)) {
                details.engineCode = engineCodeMatch[1];
            }
        }
        
        return details;
    }, [currentActiveCar]);
    
    // Get car name for subtitle if not provided
    const carName = React.useMemo(() => {
        if (subtitle) return subtitle;
        if (carDetails) {
            const parts: string[] = [];
            if (carDetails.brand) parts.push(carDetails.brand);
            if (carDetails.model) parts.push(carDetails.model);
            if (carDetails.type) parts.push(carDetails.type);
            if (parts.length > 0) return parts.join(' ');
        }
        return null;
    }, [subtitle, carDetails]);

    return (
        <div className="block-catalog-hero">
            <div className="block-catalog-hero__inner">
                <div className="container">
                    <div className="block-catalog-hero__content">
                        <h1 className="block-catalog-hero__title">
                            {title}
                        </h1>
                        {carName && (
                            <p className="block-catalog-hero__subtitle">
                                {carName}
                            </p>
                        )}
                        {carDetails && (
                            <div className="block-catalog-hero__details">
                                {[
                                    carDetails.year,
                                    carDetails.fuel,
                                    carDetails.displacement,
                                    carDetails.power,
                                    carDetails.engineCode,
                                ].filter(Boolean).join(' ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockCatalogHero;
