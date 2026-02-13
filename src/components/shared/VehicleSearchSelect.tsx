// react
import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
// UI-only: custom dropdown under trigger, search row, arrow always visible. Same API as native select.

const ARROW_SVG = (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" aria-hidden>
        <path d="M1 1l5 5 5-5" />
    </svg>
);

const MAGNIFIER_SVG = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

export interface VehicleSearchSelectOption {
    value: string;
    label: string;
}

function normalizeOptions(
    options: VehicleSearchSelectOption[] | string[] | [string, string][] | Record<string, string>
): VehicleSearchSelectOption[] {
    if (Array.isArray(options)) {
        if (options.length === 0) return [];
        const first = options[0];
        if (typeof first === 'string') return (options as string[]).map((v) => ({ value: v, label: v }));
        if (Array.isArray(first)) return (options as [string, string][]).map(([value, label]) => ({ value, label }));
        return options as VehicleSearchSelectOption[];
    }
    return Object.entries(options).map(([value, label]) => ({ value, label }));
}

interface Props {
    value: string;
    options: VehicleSearchSelectOption[] | string[] | [string, string][] | Record<string, string>;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder: string;
    ariaLabel?: string;
    id?: string;
}

function VehicleSearchSelect(props: Props) {
    const { value, options, onChange, disabled = false, placeholder, ariaLabel, id } = props;
    const normalized = normalizeOptions(options);
    const selectedOption = normalized.find((o) => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : '';

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);

    const updatePosition = useCallback(() => {
        const trigger = wrapperRef.current;
        if (!trigger || typeof document === 'undefined') return;
        const rect = trigger.getBoundingClientRect();
        const gap = 8;
        setDropdownStyle({
            top: rect.bottom + gap,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    useLayoutEffect(() => {
        if (!isOpen) {
            setDropdownStyle(null);
            return;
        }
        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    const filtered = search.trim()
        ? normalized.filter((o) => o.label.toLowerCase().includes(search.trim().toLowerCase()))
        : normalized;

    const close = useCallback(() => {
        setIsOpen(false);
        setSearch('');
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (wrapperRef.current?.contains(target)) return;
            if (dropdownRef.current?.contains(target)) return;
            close();
        };
        document.addEventListener('pointerdown', onPointerDown, true);
        return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [isOpen, close]);

    const handleSelect = (val: string) => {
        onChange(val);
        close();
    };

    return (
        <div className="vehicle-search-select" ref={wrapperRef}>
            <button
                type="button"
                id={id}
                className="vehicle-search-select__trigger"
                aria-label={ariaLabel}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen((o) => !o)}
            >
                <span className="vehicle-search-select__trigger-label">
                    {displayLabel || placeholder}
                </span>
                <span className="vehicle-search-select__trigger-arrow" data-open={isOpen}>
                    {ARROW_SVG}
                </span>
            </button>
            {isOpen &&
                dropdownStyle &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="vehicle-search-select__dropdown vehicle-search-select__dropdown--portal"
                        role="listbox"
                        style={{
                            position: 'fixed',
                            top: dropdownStyle.top,
                            left: dropdownStyle.left,
                            width: dropdownStyle.width,
                        }}
                    >
                        <div className="vehicle-search-select__search">
                            <span className="vehicle-search-select__search-icon">{MAGNIFIER_SVG}</span>
                            <input
                                type="text"
                                className="vehicle-search-select__search-input"
                                placeholder={placeholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                                aria-label={ariaLabel ? `${ariaLabel} search` : 'Search'}
                            />
                        </div>
                        <div className="vehicle-search-select__list">
                            {filtered.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={opt.value === value}
                                    className="vehicle-search-select__option"
                                    data-selected={opt.value === value}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="vehicle-search-select__empty">Inga träffar</div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}

export default VehicleSearchSelect;
