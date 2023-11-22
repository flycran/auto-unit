"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AutoUnit {
    decimal;
    threshold;
    exponential;
    decimalPlace;
    units;
    constructor(units, option = {}) {
        this.units = units;
        this.decimal = option.decimal || 1000;
        this.threshold = option.threshold || 0;
        this.exponential = option.exponential;
        this.decimalPlace = option.decimalPlace;
    }
    getUnit(num) {
        let index = 0;
        while (num >= this.decimal + this.threshold && index < this.units.length - 1) {
            num /= this.decimal;
            index++;
        }
        return {
            num: num,
            unit: this.units[index],
        };
    }
    toString(num, decimalPlace = this.decimalPlace) {
        const { num: n, unit } = this.getUnit(num);
        let ns;
        if (typeof decimalPlace === 'number') {
            ns = this.toFraction(n, decimalPlace);
        }
        else if (typeof decimalPlace === 'string') {
            const [dp1, dp2] = decimalPlace
                .split('-');
            const ndp = (n.toString().split('.')[1] || '').length;
            const minDp = dp1 ? +dp1 : -Infinity;
            const maxDp = dp2 ? +dp2 : Infinity;
            if (ndp < minDp) {
                ns = this.toFraction(n, minDp);
            }
            else if (ndp > maxDp) {
                ns = this.toFraction(n, maxDp);
            }
            else {
                ns = this.toFraction(n);
            }
        }
        else {
            ns = this.toFraction(n);
        }
        return `${ns}${unit}`;
    }
    toFraction(num, dp) {
        if (typeof this.exponential === 'number' && num >= this.exponential) {
            if (typeof dp === 'number') {
                return num.toExponential(dp);
            }
            else {
                return num.toExponential();
            }
        }
        else {
            if (typeof dp === 'number') {
                return num.toFixed(dp);
            }
            else {
                return num.toString();
            }
        }
    }
}
exports.default = AutoUnit;
//# sourceMappingURL=index.js.map