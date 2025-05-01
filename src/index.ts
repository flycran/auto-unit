export type DecimalPlace =
  | number
  | `-${ number }`
  | `${ number }-`
  | `${ number }-${ number }`
  | undefined

export interface AutoUnitOptions {
  /** 进制位数 */
  baseDigit?: number
  /**
   * 阈值
   * 最终的比较会先乘以 threshold
   */
  threshold?: number
  /** 小数位数 */
  decimal?: DecimalPlace
}

export default class AutoUnit {
  readonly threshold: number
  readonly decimal?: DecimalPlace
  readonly unitsStr: string[] = []

  constructor(
    readonly units: (string | number)[],
    option: AutoUnitOptions = {},
  ) {
    if(!units.length) throw new Error('units is empty')
    this.threshold = option.threshold || 1
    this.decimal = option.decimal
    if(option.baseDigit) {
      const us = []
      for(let i = 0; i < units.length; i++) {
        this.unitsStr.push(units[i].toString())
        us.push(units[i], option.baseDigit)
      }
      this.units = us.slice(0, -1)
    } else {
      for(let i = 0; i < units.length; i+=2) {
        this.unitsStr.push(units[i].toString())
      }
      this.units = units
    }
  }

  /**
   * Retrieves the unit and adjusted value based on the input number.
   *
   * @param num The input number for which the unit needs to be determined.
   * @return An object containing the adjusted number (`num`) and its corresponding unit (`unit`).
   */
  getUnit(num: number) {
    let i = 1

    while(i < this.units.length - 1) {
      const n = this.units[i]
      if(typeof n === 'string') throw new Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
      if(num < n * this.threshold) {
        break
      }
      num /= n
      i+=2
    }

    return {
      num: num,
      unit: this.units[i - 1],
    }
  }

  /**
   * Converts a number to its string representation with an optional decimal configuration.
   *
   * @param {number} num - The number to be converted to a string.
   * @param {number|string} [decimal=this.decimal] - Specifies the decimal precision or format.
   * If a number, it defines the fixed decimal places.
   * If a string, it should follow the format "minDp-maxDp" to define a range of decimal places.
   * If omitted, the default decimal configuration of the instance is used.
   *
   * @return {string} The formatted string representation of the number, including the unit.
   */
  toString(num: number, decimal = this.decimal) {
    const { num: n, unit } = this.getUnit(num)
    let ns: string
    if(typeof decimal === 'number') {
      ns = this.toFraction(n, decimal)
    } else if(typeof decimal === 'string') {
      const [ dp1, dp2 ] = decimal
        .split('-')
      const ndp = (n.toString().split('.')[1] || '').length

      const minDp = dp1 ? +dp1 : -Infinity
      const maxDp = dp2 ? +dp2 : Infinity

      if(ndp < minDp) {
        ns = n.toFixed(minDp)
      } else if(ndp > maxDp) {
        ns = this.toFraction(n, maxDp)
      } else {
        ns = this.toFraction(n)
      }
    } else {
      ns = n.toString()
    }
    return `${ ns }${ unit }`
  }

  /**
   * Converts a given number from a specified unit to the base unit.
   *
   * @param {number} num The number to be converted.
   * @param {string} unit The unit from which the number will be converted.
   * @return {number} The converted number in the base unit.
   */
  fromUnit(num: number, unit: string) {
    let i = 0

    while(i < this.units.length) {
      if(this.units[i] === unit) {
        return num
      }
      if(typeof this.units[i] === 'undefined') {
        break
      }
      if(typeof this.units[i + 1] !== 'number') throw Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
      num  *= this.units[i + 1] as number
      i+=2
    }
    throw new Error(`Undefined unit ${unit}.`)
  }

  /**
   * Separates the numeric part and the unit from a given string.
   *
   * @param {string} str - The input string containing a numeric value followed by a unit.
   * @return {Object} An object containing the numeric value as `num` and the unit as `unit`.
   * If no match is found, the returned object will have `num` as NaN and `unit` as undefined.
   */
  sepUnit(str: string) {
    const re = new RegExp(`^(\\d+(?:\\.\\d+)?)(${ this.unitsStr.map(u => `${ u }`).join('|') })`)

    const [ , num, unit ] = str.match(re) || []

    return {
      num: +num,
      unit,
    }
  }

  /**
   * Converts a string representation into a formatted value.
   *
   * @param {string} str - The input string containing a numeric value and unit.
   * @return {number} The formatted value derived from the numeric part and unit extracted from the input string.
   */
  fromString(str: string) {
    const { num, unit } = this.sepUnit(str)
    return this.fromUnit(+num, unit)
  }

  /**
   * Convert the given number from one unit to the optimal unit, with the option to specify decimal precision.
   *
   * @param num The number to be converted.
   * @param unit The original unit.
   * @param decimal Optional. The number of decimal places for the formatted output.
   * @return A string representation of the converted number, formatted to the specified decimal precision if provided.
   */
  convertUnit(num: number, unit:  string, decimal?: number) {
    const nnum = this.fromUnit(num, unit)
    return this.toString(nnum, decimal)
  }

  private toFraction(num: number, dp?: number) {
    if(typeof dp === 'number') {
      return num.toFixed(dp)
    } else {
      return  num.toString()
    }
  }
}

// 度量缩写
export const measUnit = new AutoUnit([ '', 'k', 'M', 'G', 'T' ], {
  baseDigit: 1000,
})
// 距离单位
export const distanceUnit = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])
