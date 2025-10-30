// react
import React from "react";
// application
import { useCurrency } from "~/store/currency/currencyHooks";
import { ICurrency } from "~/interfaces/currency";

interface Props {
    value: number;
    currency?: ICurrency;
}

function CurrencyFormat(props: Props) {
    const { value, currency: propCurrency } = props;
    const siteCurrency = useCurrency();
    const currency = propCurrency || siteCurrency;

    return (
        <React.Fragment>
            {((value / 100) * currency.rate).toFixed(2)} {currency.symbol}
        </React.Fragment>
    );
}

export default CurrencyFormat;
