import React from "react";

const OriginalPartNumber = () => {
    const partNumbers = [
        { brand: "APEC", numbers: ["DSK3340", "SDK6275", "DSK2855"] },
        { brand: "ATE", numbers: ["24 0310 0356 1", "24 0110 0356 1"] },
        { brand: "AUDI", numbers: ["1K0 615 601 AA", "5Q0 615 601 D", "6R0615601"] },
        { brand: "BENDIX", numbers: ["BR2814EURO"] },
        { brand: "BOSCH", numbers: ["0 986 479 C20"] },
        {
            brand: "BREMBO",
            numbers: [
                "08B41375",
                "08B4131E",
                "PAD1261B",
                "08B4131X",
                "PD3119",
                "PAD1234",
                "08B41310",
                "PD3576",
                "PAD1261",
            ],
        },
        { brand: "CUPRA", numbers: ["5Q0 615 601 D", "1K0 615 601 AA"] },
        { brand: "DELPHI", numbers: ["BG5289C", "BG4324C", "BG4324C19B1", "BG4975C", "BG4324"] },
        { brand: "FERODO", numbers: ["DDF2691C", "DDF1895CD", "DDF1895X", "DDF1895", "DDF18951", "DDF1895C"] },
        { brand: "FORD", numbers: ["2587070"] },
        { brand: "LAW", numbers: ["563255JC", "563255JC1", "562614JC", "562614JC1"] },
        { brand: "LPR", numbers: ["A1038P", "A1038PR"] },
        { brand: "MINTEX", numbers: ["MDC2205C", "BDS1029", "MDC2800C", "BDS1468", "MDC82205C", "MDC2205"] },
        { brand: "NK", numbers: ["3147172", "2047137", "3147137"] },
        { brand: "NEW TECNODELTA", numbers: ["1421575"] },
        { brand: "OPTIMAL GERMANY", numbers: ["BS0262C", "BS8784C"] },
        { brand: "PAGID", numbers: ["55249PRO", "55920", "55249", "55249NC"] },
        { brand: "ARROW", numbers: ["5886"] },
        { brand: "QUINTON HAZELL", numbers: ["BDC5994"] },
        { brand: "RAICAM", numbers: ["RD01188", "RD01500"] },
        { brand: "STRIP", numbers: ["6134000"] },
        { brand: "ROADHOUSE", numbers: ["6134000"] },
        { brand: "SBS", numbers: ["18152047137"] },
        { brand: "SEAT", numbers: ["6R0615601", "1K0 615 601 AA", "5Q0 615 601 D"] },
        { brand: "SKODA", numbers: ["5Q0 615 601 D", "6R0615601", "1K0 615 601 AA", "5QD615601"] },
        { brand: "TEXTS", numbers: ["92292003", "92224903", "92224905"] },
        { brand: "TRW", numbers: ["DF7911"] },
        { brand: "VALEO", numbers: ["673123", "197544", "496022", "672627", "196023"] },
        { brand: "VW", numbers: ["5Q0 615 601 D", "6R0615601", "1K0 615 601 AA", "5QD615601"] },
        { brand: "ZIMMERMANN", numbers: ["600324120", "600324152"] },
    ];

    return (
        <div className="original-part-number">
            <h2 className="part-number-title">BOSCH 0 986 479 677 OE number</h2>

            <div className="part-number-table-container">
                <div className="part-number-table">
                    {partNumbers.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="table-cell brand-cell">{item.brand}</div>
                            <div className="table-cell number-cell">{item.numbers.join(" ")}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OriginalPartNumber;
