import AutoUnit from '../src';
import Decimal from 'decimal.js';

describe('精度安全测试', () => {
  const au = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm' ], { highPrecision: true })

  it('基本转换测试', () => {
    const result = au.getUnit(123456789)
    expect(result.num).toBeCloseTo(123.456789)
    expect(result.decimal?.toString()).toEqual('123.456789')
    expect(result.unit).toEqual('km')
  })

  it('小数位数控制测试', () => {
    expect(au.format(123456789, 2)).toEqual('123.46km')
    expect(au.format(123456789, '1-3')).toEqual('123.457km')
  })

  it('超过JavaScript安全整数范围的值测试', () => {
    const result = au.getUnit('1e18')
    expect(result.num).toBeCloseTo(1000)
    expect(result.unit).toEqual('Tm')
  })

  it('转换为基本单位', () => {
    expect(au.toBase(123456789, 'Mm').toString()).toEqual(String(1.23456789e17))
  })

  it('带小数点的字符串测试', () => {
    const value = au.parse('123456789.123456km')
    expect(value.toString()).toEqual(new Decimal('123456789.123456').times(1e6).toString())
  })
})
