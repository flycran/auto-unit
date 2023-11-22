export type DecimalPlace = number | `-${number}` | `${number}-` | `${number}-${number}` | undefined;
export interface AutoUnitOptions {
    decimal?: number;
    threshold?: number;
    exponential?: number;
    decimalPlace?: DecimalPlace;
}
export default class AutoUnit {
    private readonly decimal;
    private readonly threshold;
    private readonly exponential?;
    private readonly decimalPlace?;
    private readonly units;
    constructor(units: string[], option?: AutoUnitOptions);
    getUnit(num: number): {
        num: number;
        unit: string;
    };
    toString(num: number, decimalPlace?: DecimalPlace): string;
    private toFraction;
}
