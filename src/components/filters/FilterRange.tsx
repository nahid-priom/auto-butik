// react
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
// third-party
import Slider from 'rc-slider';
// application
import CurrencyFormat from '~/components/shared/CurrencyFormat';
import { IRangeFilter, IRangeFilterValue } from '~/interfaces/filter';
import { useDirection } from '~/services/i18n/hooks';

function getFirstValidValue(...values: Array<number | null>): number | null {
    return values.reduce((acc, value) => (
        acc === null && (value || value === 0)
            ? value
            : acc
    ), null);
}

interface Props {
    options: IRangeFilter;
    value: IRangeFilterValue;
    onChangeValue?: (event: { filter: IRangeFilter, value: IRangeFilterValue }) => void;
}

function FilterRange(props: Props) {
    const { options, value, onChangeValue } = props;
    const [propsFrom, propsTo] = value || [];
    const { min, max } = options;
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [state, setState] = useState<IRangeFilterValue>([
        propsFrom ?? min,
        propsTo ?? max,
    ]);
    const [stateFrom, stateTo] = state;
    const direction = useDirection();

    const from = Math.max(getFirstValidValue(stateFrom, propsFrom, min)!, min);
    const to = Math.min(getFirstValidValue(stateTo, propsTo, max)!, max);
    const fromLabel = from;
    const toLabel = to;

    // Update state from props.
    useEffect(() => {
        setState([propsFrom ?? min, propsTo ?? max]);
    }, [propsFrom, propsTo, min, max]);

    // Clear previous timer.
    useEffect(() => () => {
        if (timer) {
            clearTimeout(timer);
        }
    }, [timer]);

    const handleChange = useCallback((newValue: number | number[]) => {
        const [rawFrom, rawTo] = Array.isArray(newValue) ? newValue : [newValue, newValue];
        const clampedFrom = Math.max(rawFrom, min);
        const clampedTo = Math.min(rawTo, max);

        setState([clampedFrom, clampedTo]);

        if (onChangeValue) {
            setTimer((prevTimer) => {
                if (prevTimer) {
                    clearTimeout(prevTimer);
                }

                return setTimeout(() => {
                    onChangeValue({ filter: options, value: [clampedFrom, clampedTo] });
                    setTimer(undefined);
                }, 250);
            });
        }
    }, [min, max, onChangeValue, options]);

    return useMemo(() => (
        <div className="filter-range">
            <div className="filter-range__slider" dir="ltr">
                <Slider
                    range
                    min={min}
                    max={max}
                    value={[from, to]}
                    step={1}
                    allowCross={false}
                    reverse={direction === 'rtl'}
                    onChange={handleChange}
                />
            </div>
            <div className="filter-range__title-button">
                <div className="filter-range__title">
                    <span className="filter-range__min-value"><CurrencyFormat value={fromLabel} /></span>
                    {' – '}
                    <span className="filter-range__max-value"><CurrencyFormat value={toLabel} /></span>
                </div>
            </div>
        </div>
    ), [min, max, from, to, fromLabel, toLabel, handleChange, direction]);
}

export default FilterRange;
