export type DecimalPlace = number | `-${number}` | `${number}-` | `${number}-${number}` | undefined;
export interface AutoUnitOptions {
    baseDigit?: number;
    threshold?: number;
    decimal?: DecimalPlace;
}
export default class AutoUnit {
    readonly units: (string | number)[];
    readonly threshold: number;
    readonly decimal?: DecimalPlace;
    readonly unitsStr: string[];
    constructor(units: (string | number)[], option?: AutoUnitOptions);
    getUnit(num: number): {
        num: number;
        unit: string | number;
    };
    toString(num: number, decimal?: DecimalPlace): string;
    fromUnit(num: number, unit: string): number;
    sepUnit(str: string): {
        num: number;
        unit: string;
    };
    fromString(str: string): number;
    convertUnit(num: number, unit: string, decimal?: number): string;
    private toFraction;
}
export declare const measUnit: AutoUnit;
export declare const distanceUnit: AutoUnit;
