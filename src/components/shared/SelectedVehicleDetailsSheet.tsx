// react
import React, { useEffect, useRef, useCallback } from "react";
// application
import { IGarageVehicle } from "~/contexts/GarageContext";
import { Cross20Svg } from "~/svg";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    vehicle: IGarageVehicle | null;
}

/**
 * Bottom sheet / modal that shows the exact legacy selected vehicle data.
 * No new fields or transformations—same data as used elsewhere (e.g. garage dropdown).
 */
function SelectedVehicleDetailsSheet(props: Props) {
    const { isOpen, onClose, vehicle } = props;
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!isOpen) return null;

    const data = vehicle?.data as Record<string, unknown> | undefined;
    const label =
        data
            ? `${(data as any).C_merke ?? ""} ${(data as any).C_modell ?? ""}`.trim() || "Vehicle"
            : "";

    const entries: { key: string; label: string }[] = [];
    if (data) {
        const fields = [
            "C_merke",
            "C_modell",
            "C_typ",
            "Fordons_ar",
            "Ar_fran",
            "Ar_till",
            "C_bransle",
            "C_slagvolym",
            "C_kw",
            "C_hk",
            "WHEELID",
            "BULTCIRKEL",
            "NAVHAL",
            "ET",
            "dack_dim_fram",
            "dack_dim_bak",
            "RegNr",
        ];
        const labelMap: Record<string, string> = {
            C_merke: "Märke",
            C_modell: "Modell",
            C_typ: "Typ",
            Fordons_ar: "Fordonsår",
            Ar_fran: "Från år",
            Ar_till: "Till år",
            C_bransle: "Bränsle",
            C_slagvolym: "Slagvolym",
            C_kw: "Effekt (kW)",
            C_hk: "Effekt (hk)",
            WHEELID: "Wheel ID",
            BULTCIRKEL: "Bultcirkel",
            NAVHAL: "Navhal",
            ET: "ET",
            dack_dim_fram: "Däck dimension fram",
            dack_dim_bak: "Däck dimension bak",
            RegNr: "Registreringsnummer",
        };
        fields.forEach((key) => {
            const v = data[key];
            if (v !== undefined && v !== null && String(v).trim() !== "")
                entries.push({ key, label: labelMap[key] || key });
        });
    }

    return (
        <div
            ref={overlayRef}
            className="selected-vehicle-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-vehicle-sheet-title"
            onClick={handleOverlayClick}
        >
            <div
                ref={panelRef}
                className="selected-vehicle-sheet__panel"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="selected-vehicle-sheet__handle" aria-hidden />
                <div className="selected-vehicle-sheet__header">
                    <h2 id="selected-vehicle-sheet-title" className="selected-vehicle-sheet__title">
                        {label || "Valt fordon"}
                    </h2>
                    <button
                        type="button"
                        className="selected-vehicle-sheet__close"
                        onClick={onClose}
                        aria-label="Stäng"
                    >
                        <Cross20Svg />
                    </button>
                </div>
                <div className="selected-vehicle-sheet__body">
                    {data &&
                        entries.map(({ key, label: fieldLabel }) => (
                            <div key={key} className="selected-vehicle-sheet__row">
                                <span className="selected-vehicle-sheet__label">{fieldLabel}</span>
                                <span className="selected-vehicle-sheet__value">
                                    {String(data[key])}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(SelectedVehicleDetailsSheet);
