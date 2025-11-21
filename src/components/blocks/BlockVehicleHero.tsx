// react
import React, { useState } from "react";
// third-party
import { FormattedMessage } from "react-intl";

function BlockVehicleHero() {
    return (
        <div className="block-vehicle-search-hero">
            <div className="block-vehicle-search-hero__inner">
                <div className="container">
                    <div className="block-vehicle-search-hero__content">
                        <h1 className="block-vehicle-search-hero__title">
                            <FormattedMessage
                                id="TEXT_HERO_SEARCH_TITLE"
                                defaultMessage="Bildelar online - låga priser och snabb leverans"
                            />
                        </h1>
                        <p className="block-vehicle-search-hero__subtitle">
                            <FormattedMessage id="TEXT_HERO_SEARCH_SUBTITLE" defaultMessage="Välj ditt fordon" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockVehicleHero;
