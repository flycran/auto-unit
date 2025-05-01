"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanceUnit = exports.measUnit = void 0;
class AutoUnit {
    units;
    threshold;
    decimal;
    unitsStr = [];
    constructor(units, option = {}) {
        this.units = units;
        if (!units.length)
            throw new Error('units is empty');
        this.threshold = option.threshold || 1;
        this.decimal = option.decimal;
        if (option.baseDigit) {
            const us = [];
            for (let i = 0; i < units.length; i++) {
                this.unitsStr.push(units[i].toString());
                us.push(units[i], option.baseDigit);
            }
            this.units = us.slice(0, -1);
        }
        else {
            for (let i = 0; i < units.length; i += 2) {
                this.unitsStr.push(units[i].toString());
            }
            this.units = units;
        }
    }
    getUnit(num) {
        let i = 1;
        while (i < this.units.length - 1) {
            const n = this.units[i];
            if (typeof n === 'string')
                throw new Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`);
            if (num < n * this.threshold) {
                break;
            }
            num /= n;
            i += 2;
        }
        return {
            num: num,
            unit: this.units[i - 1],
        };
    }
    toString(num, decimal = this.decimal) {
        const { num: n, unit } = this.getUnit(num);
        let ns;
        if (typeof decimal === 'number') {
            ns = this.toFraction(n, decimal);
        }
        else if (typeof decimal === 'string') {
            const [dp1, dp2] = decimal
                .split('-');
            const ndp = (n.toString().split('.')[1] || '').length;
            const minDp = dp1 ? +dp1 : -Infinity;
            const maxDp = dp2 ? +dp2 : Infinity;
            if (ndp < minDp) {
                ns = n.toFixed(minDp);
            }
            else if (ndp > maxDp) {
                ns = this.toFraction(n, maxDp);
            }
            else {
                ns = this.toFraction(n);
            }
        }
        else {
            ns = n.toString();
        }
        return `${ns}${unit}`;
    }
    fromUnit(num, unit) {
        let i = 0;
        while (i < this.units.length) {
            if (this.units[i] === unit) {
                return num;
            }
            if (typeof this.units[i] === 'undefined') {
                break;
            }
            if (typeof this.units[i + 1] !== 'number')
                throw Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`);
            num *= this.units[i + 1];
            i += 2;
        }
        throw new Error(`Undefined unit ${unit}.`);
    }
    sepUnit(str) {
        const re = new RegExp(`^(\\d+(?:\\.\\d+)?)(${this.unitsStr.map(u => `${u}`).join('|')})`);
        const [, num, unit] = str.match(re) || [];
        return {
            num: +num,
            unit,
        };
    }
    fromString(str) {
        const { num, unit } = this.sepUnit(str);
        return this.fromUnit(+num, unit);
    }
    convertUnit(num, unit, decimal) {
        const nnum = this.fromUnit(num, unit);
        return this.toString(nnum, decimal);
    }
    toFraction(num, dp) {
        if (typeof dp === 'number') {
            return num.toFixed(dp);
        }
        else {
            return num.toString();
        }
    }
}
exports.default = AutoUnit;
exports.measUnit = new AutoUnit(['', 'k', 'M', 'G', 'T'], {
    baseDigit: 1000,
});
exports.distanceUnit = new AutoUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km']);
//# sourceMappingURL=index.js.map