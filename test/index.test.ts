import AutoUnit from '../src/index'

describe('自定义进位测试 距离单位', () => {
  const au = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])

  it('10', () => {
    expect(au.toString(10)).toEqual('1cm')
  })
  it('100', () => {
    expect(au.toString(100)).toEqual('10cm')
  })
  it('1000', () => {
    expect(au.toString(1000)).toEqual('1m')
  })
  it('10000', () => {
    expect(au.toString(10000)).toEqual('10m')
  })
  it('1000000', () => {
    expect(au.toString(1000000)).toEqual('1km')
  })
})

describe('自动进位测试 度量缩写', () => {
  const au = new AutoUnit([ '', 'k', 'M', 'G', 'T' ], {
    baseDigit: 1000,
  })

  it('1e2', () => {
    expect(au.toString(1e2)).toEqual('100')
  })
  it('1e4', () => {
    expect(au.toString(1e4)).toEqual('10k')
  })
  it('1e6', () => {
    expect(au.toString(1e6)).toEqual('1M')
  })
  it('1e9', () => {
    expect(au.toString(1e9)).toEqual('1G')
  })
  it('1e13', () => {
    expect(au.toString(1e13)).toEqual('10T')
  })
})

describe('小数测试', () => {
  const au = new AutoUnit([ 'byte', 'KB', 'MB', 'GB' ], {
    baseDigit: 1024,
  })

  it('不带小数', () => {
    expect(au.toString(1024 * 1024 * 12.34)).toEqual('12.34MB')
  })
  it('带固定小数', () => {
    expect(au.toString(1024 * 1024 * 12.34, 1)).toEqual('12.3MB')
  })
  it('带小数范围(-3)', () => {
    expect(au.toString(1024 * 1024 * 12.34, '-3')).toEqual('12.34MB')
  })
  it('带小数范围(3-)', () => {
    expect(au.toString(1024 * 1024 * 12.34, '3-')).toEqual('12.340MB')
  })
  it('带小数范围(1-3)', () => {
    expect(au.toString(1024 * 1024 * 12.34, '1-3')).toEqual('12.34MB')
  })
  it('getUnit', () => {
    expect(au.getUnit(1024 * 1024 * 1000)).toEqual({
      num: 1000,
      unit: 'MB',
    })
  })
})

describe('逆向测试', () => {
  const au = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])

  it('1cm', () => {
    expect(au.fromUnit(1, 'cm')).toEqual(10)
  })
  it('10cm', () => {
    expect(au.fromUnit(10, 'cm')).toEqual(100)
  })
  it('1m', () => {
    expect(au.fromUnit(1, 'm')).toEqual(1e3)
  })
  it('10m', () => {
    expect(au.fromUnit(10, 'm')).toEqual(1e4)
  })
  it('1km', () => {
    expect(au.fromUnit(1, 'km')).toEqual(1e6)
  })
})

describe('逆向测试 自动识别单位', () => {
  const au = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])

  it('1cm', () => {
    expect(au.fromString('1cm')).toEqual(10)
  })
  it('10cm', () => {
    expect(au.fromString('10cm')).toEqual(100)
  })
  it('1m', () => {
    expect(au.fromString('1m')).toEqual(1e3)
  })
  it('10m', () => {
    expect(au.fromString('10m')).toEqual(1e4)
  })
  it('1km', () => {
    expect(au.fromString('1km')).toEqual(1e6)
  })
})
