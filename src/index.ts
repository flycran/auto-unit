export type DecimalPlace =
  | number
  | `-${ number }`
  | `${ number }-`
  | `${ number }-${ number }`
  | undefined

export interface AutoUnitOptions {
  /** 进制位数 */
  decimal?: number
  /** 阈值 */
  threshold?: number
  /** 科学计数法 */
  exponential?: number
  /** 小数位数 */
  decimalPlace?: DecimalPlace
}

export default class AutoUnit {
  private readonly decimal: number
  private readonly threshold: number
  private readonly exponential?: number
  private readonly decimalPlace?: DecimalPlace
  private readonly units: string[]

  constructor(
    units: string[],
    option: AutoUnitOptions = {},
  ) {
    this.units = units
    this.decimal = option.decimal || 1000
    this.threshold = option.threshold || 0
    this.exponential = option.exponential
    this.decimalPlace = option.decimalPlace
  }

  getUnit(num: number) {
    let index = 0

    while(num >= this.decimal + this.threshold && index < this.units.length - 1) {
      num /= this.decimal
      index++
    }

    return {
      num: num,
      unit: this.units[index],
    }
  }

  toString(num: number, decimalPlace = this.decimalPlace) {
    const { num: n, unit } = this.getUnit(num)
    let ns: string
    if(typeof decimalPlace === 'number') {
      ns = this.toFraction(n, decimalPlace)
    } else if(typeof decimalPlace === 'string') {
      const [ dp1, dp2 ] = decimalPlace
        .split('-')
      const ndp = (n.toString().split('.')[1] || '').length

      const minDp = dp1 ? +dp1 : -Infinity
      const maxDp = dp2 ? +dp2 : Infinity

      if(ndp < minDp) {
        ns = this.toFraction(n, minDp)
      } else if(ndp > maxDp) {
        ns = this.toFraction(n, maxDp)
      } else {
        ns = this.toFraction(n)
      }
    } else {
      ns = this.toFraction(n)
    }
    return `${ ns }${ unit }`
  }

  private toFraction(num: number, dp?: number) {
    if(typeof this.exponential === 'number' && num >= this.exponential) {
      if(typeof dp === 'number') {
        return num.toExponential(dp)
      } else {
        return  num.toExponential()
      }
    } else {
      if(typeof dp === 'number') {
        return num.toFixed(dp)
      } else {
        return  num.toString()
      }
    }
  }
}
