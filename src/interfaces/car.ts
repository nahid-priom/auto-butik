export interface ICarData {
    RegNr: string;
    modell_id: string;
    Chassinummer: string;
    C_vaxellada: string;
    WHEELID: string;
    Car_Info_From_TS: string;
    Fordons_ar: string;
    C_merke: string;
    C_modell: string;
    C_typ: string;
    C_kw: string;
    C_hk: string;
    C_slagvolym: string;
    C_lit: string;
    C_cylinder: string;
    C_hjuldrift: string;
    C_bransle: string;
    C_kaross: string;
    C_motorkod: string;
    C_chassi: string;
    C_fran_ar: string;
    C_till_ar: string;
    Min_Tum: string;
    Max_Tum: string;
    BULTCIRKEL: string;
    BULTDIMETER: string;
    NAVHAL: string;
    ET: string;
    dack_dim_fram: string;
    dack_dim_bak: string;
    Bredd_Fram: string;
    Bredd_Bak: string;
    ET_fram_tollerans: string;
    ET_bak_tollerans: string;
    DK_Anmarkning: string;
    Dackdimension_fram: string;
    Dackdimension_bak: string;
    Falgdimension_fram: string;
    Falgdimension_bak: string;
    type: string;
}

export interface ICarApiResponse {
    success: boolean;
    regNr: string;
    data: ICarData;
}

export interface ICurrentActiveCar {
    regNr?: string;
    data: ICarData | IWheelData;
    fetchedAt: number; // timestamp
}

// Dropdown types
export interface ITypesMap {
    [modelId: string]: string; // e.g., "133249": "320 d SEDAN [G20] (140 kW)"
}

export interface IWheelData {
    WHEELID?: string;
    C_merke?: string;
    C_modell?: string;
    C_typ?: string;
    C_kw?: string;
    C_chassi?: string;
    Ar_fran?: string;
    Ar_till?: string;
    Min_Tum?: string;
    Max_Tum?: string;
    BULTCIRKEL?: string;
    BULTDIMETER?: string;
    NAVHAL?: string;
    ET?: string;
    dack_dim_fram?: string;
    dack_dim_bak?: string;
    Bredd_Fram?: string;
    Bredd_Bak?: string;
    ET_fram_tollerans?: string;
    ET_bak_tollerans?: string;
    DK_Anmarkning?: string;
    type?: string;
    engineDescription?: string; // Enhanced field: engine description from dropdown
}