// react
import React from 'react';
// icons (bold/filled)
import {
    ShieldCheckIcon,
    CalendarDaysIcon,
    CubeIcon,
    ArrowUturnLeftIcon,
} from '@heroicons/react/24/solid';

export default function BlockBenefits() {
    return (
        <div className="block block-benefits">
            <div className="container">
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-card__icon">
                            <div className="benefit-card__circle">
                                <ShieldCheckIcon />
                            </div>
                        </div>
                        <h3 className="benefit-card__title">Prisgaranti på reservdelar</h3>
                        <p className="benefit-card__text">
                            Hos Autobutik handlar du tryggt – hittar du samma del billigare någon
                            annanstans matchar vi priset. Vi står för kvalitet och rätt pris.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-card__icon">
                            <div className="benefit-card__circle">
                                <CalendarDaysIcon />
                            </div>
                        </div>
                        <h3 className="benefit-card__title">60 dagars öppet köp</h3>
                        <p className="benefit-card__text">
                            Autobutik ger dig gott om tid att känna efter. Returnera enkelt inom 60 dagar
                            om något inte blev helt rätt.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-card__icon">
                            <div className="benefit-card__circle">
                                <CubeIcon />
                            </div>
                        </div>
                        <h3 className="benefit-card__title">Lager i Sverige</h3>
                        <p className="benefit-card__text">
                            Snabba leveranser från vårt svenska lager. Autobutik prioriterar hastighet
                            och pålitlighet – så att din bil snabbt är på väg igen.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-card__icon">
                            <div className="benefit-card__circle">
                                <ArrowUturnLeftIcon />
                            </div>
                        </div>
                        <h3 className="benefit-card__title">Fria returer</h3>
                        <p className="benefit-card__text">
                            Bytte du dig fel? Autobutik gör returen smidig och kostnadsfri. Fyll i
                            returformuläret och lämna resten till oss.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


