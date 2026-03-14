/*!
 * auto-unit
 * Copyright (c) [2025] [flycran]
 * MIT License. See LICENSE for details.
 */

import Decimal from 'decimal.js'

export type DecimalPlace =
  | number
  | `-${ number }`
  | `${ number }-`
  | `${ number }-${ number }`
  | undefined

export interface AutoUnitOptions<HP extends boolean = false> {
  /** 进制位数 */
  baseDigit?: number
  /**
   * 阈值
   * 最终的比较会先乘以 threshold
   */
  threshold?: number
  /**
   * 结果保留的小数位数
   */
  decimal?: DecimalPlace
  /**
   * 进行高精度计算
   * - 开启选项会使用`decimal.js`进行高精度浮点数计算
   * - 同时支持超过js安全整数的计算
   * - 为`format`等方法支持`string`、`BigInt`、`Decimal`类型。
   */
  highPrecision?: HP
}

export interface NumUnit {
  /* 数值 */
  num: number
  /* Decimal */
  decimal?: Decimal
  /* 单位 */
  unit: string
}

export type Num<DS extends boolean = false> = DS extends true ? number | bigint | string | Decimal : number

export const ERROR_NAN_INPUT = 'Accepting NaN as an argument may be unintentional and could lead to invalid results. If this is intentional, please set `AutoUnit.ignoreNaNInputs` to `true`.'

export const ERROR_HIGH_PRECISION_NOT_ENABLED = 'By default, only number input is supported. To enable high-precision calculations, explicitly set the decimalSafety parameter to true.'

export class AutoUnit<HP extends boolean = false> {
  static ignoreNaNInputs = false
  readonly threshold: number
  readonly decimal?: DecimalPlace
  readonly unitsStr: string[] = []
  readonly highPrecision: HP

  constructor(
    readonly units: (string | number)[],
    option: AutoUnitOptions<HP> = {},
  ) {
    if(!units.length) throw new Error('units is empty.')
    this.threshold = option.threshold || 1
    this.decimal = option.decimal
    this.highPrecision = option.highPrecision
    if(option.baseDigit) {
      const us = []
      for(let i = 0; i < units.length; i++) {
        this.unitsStr.push(units[i].toString())
        us.push(units[i], option.baseDigit)
      }
      this.units = us.slice(0, -1)
    } else {
      for(let i = 0; i < units.length; i += 2) {
        this.unitsStr.push(units[i].toString())
      }
      this.units = units
    }
  }

  /**
   * 根据输入数值获取单位和调整后的值
   *
   * @param {Num} num 需要确定单位的输入数值
   * @return {NumUnit} 一个包含调整后数值（`num`）及其对应单位（`unit`）的对象
   */
  getUnit(num: Num<HP>): NumUnit {
    if(!AutoUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 1

    if(this.highPrecision) {
      let dn = new Decimal(typeof num === 'bigint' ? num.toString() : num)
      while(i < this.units.length - 1) {
        const n = this.units[i]
        if(typeof n === 'string') throw new Error(`The unit setting is incorrect; the element at index [${ i }] should be of numeric type.`)
        if(dn.lt(n * this.threshold)) {
          break
        }
        dn = dn.dividedBy(n)
        i += 2
      }

      return {
        num: dn.toNumber(),
        decimal: dn,
        unit: this.units[i - 1].toString(),
      }
    } else {
      if(typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      while(i < this.units.length - 1) {
        const n = this.units[i]
        if(typeof n === 'string') throw new Error(`The unit setting is incorrect; the element at index [${ i }] should be of numeric type.`)
        if(num < n * this.threshold) {
          break
        }
        num /= n
        i += 2
      }
      return {
        num: num,
        unit: this.units[i - 1].toString(),
      }
    }
  }

  /**
   * 将数字转换为字符串表示形式，并可选择配置小数位数。
   *
   * @param {Num} num 要转换为字符串的数字。
   * @param {DecimalPlace} [decimal=this.decimal] 指定小数精度
   * - 如果是一个数字，它定义了固定的小数位数
   * - 如果是一个字符串，它应遵循"最小小数位数-最大小数位数"的格式来定义小数位数的范围
   * - 如果省略，则使用实例的默认小数配置
   *
   * @return {string} 该数字的格式化字符串表示，包含单位
   */
  format(num: Num<HP>, decimal: DecimalPlace = this.decimal): string {
    const {
      num: n,
      unit,
      decimal: dec,
    } = this.getUnit(num)
    let ns: string
    if(typeof decimal === 'number') {
      ns = (dec ?? n).toFixed(decimal)
    } else if(typeof decimal === 'string') {
      const [ dp1, dp2 ] = decimal
        .split('-')
      const ndp = (n.toString().split('.')[1] || '').length

      const minDp = dp1 ? +dp1 : -Infinity
      const maxDp = dp2 ? +dp2 : Infinity

      if(ndp < minDp) {
        ns = (dec ?? n).toFixed(minDp)
      } else if(ndp > maxDp) {
        ns = (dec ?? n).toFixed(maxDp)
      } else {
        ns = (dec ?? n).toString()
      }
    } else {
      ns = (dec ?? n).toString()
    }
    return `${ ns }${ unit }`
  }

  /**
   * 将给定数值从指定单位转换为基本单位
   *
   * @param {Num} num 待转换的数字
   * @param {string} unit 要转换的数字的原始单位
   * @return {number | string} 以基本单位转换后的数值
   * - 若开启了安全精度计算，则返回`Decimal`
   */
  toBase(num: Num<HP>, unit: string): HP extends true ? Decimal : number {
    if(!AutoUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 0

    if(this.highPrecision) {
      // 高精度计算
      let dn = new Decimal(typeof num === 'bigint' ? num.toString() : num)
      while(i < this.units.length) {
        if(this.units[i] === unit) {
          return dn as HP extends true ? Decimal : number
        }
        if(typeof this.units[i] === 'undefined') {
          break
        }
        const cn = this.units[i + 1]
        if(typeof cn !== 'number') throw Error(`The unit setting is incorrect; the element at index [${ i }] should be of numeric type.`)
        dn = dn.times(cn)
        i += 2
      }
    } else {
      if(typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      let nn = num
      // 普通计算
      while(i < this.units.length) {
        if(this.units[i] === unit) {
          return nn as HP extends true ? Decimal : number
        }
        if(typeof this.units[i + 1] === 'undefined') {
          break
        }
        if(typeof this.units[i + 1] !== 'number') throw Error(`The unit setting is incorrect; the element at index [${ i }] should be of numeric type.`)
        nn *= this.units[i + 1] as number
        i += 2
      }
    }
    throw new Error(`Undefined unit: "${ unit }".`)
  }

  /**
   * 从给定字符串中分离出数字部分和单位
   *
   * @param {string} str - 输入字符串包含一个数值后跟一个单位
   * @return {NumUnit} 一个包含数值`num`和单位`unit`的对象。
   * 只支持已定义的单位
   * 如果未找到匹配项，将抛出错误
   */
  splitUnit(str: string): NumUnit {
    const re = new RegExp(`^(\\d+(?:\\.\\d+)?)(${ this.unitsStr.map(u => `${ u }`).join('|') })`)

    const [ , num, unit ] = str.match(re) || []

    if(num === undefined || unit === undefined) {
      throw new Error(`Undefined unit: "${ str }".`)
    }

    return {
      num: +num,
      unit,
      decimal: this.highPrecision ? new Decimal(num) : undefined,
    }
  }

  /**
   * 将带单位的值转换为基础单位的数值
   *
   * @param {string} str - 输入的字符串包含数值和单位
   * @return {number} 格式化值
   * - 若开启了安全精度计算，则返回`Decimal`
   */
  parse(str: string): HP extends true ? Decimal : number {
    const {
      num,
      unit,
      decimal,
    } = this.splitUnit(str)
    return this.toBase(((decimal ?? num) as Num<HP>), unit)
  }

  /**
   * 将给定数值从原单位转换为最佳单位，并可指定小数精度
   *
   * @param {Num} num 待转换的数字
   * @param {unit} unit 原单位
   * @param {decimal} decimal 可选，格式化输出时保留的小数位数
   * @return {string} 转换后的数字字符串表示
   */
  fromUnitFormat(num: Num<HP>, unit: string, decimal?: DecimalPlace): string {
    const nnum = this.toBase(num, unit)
    return this.format(nnum, decimal)
  }
}

export default AutoUnit
