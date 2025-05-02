import AutoUnit, { ERROR_NAN_INPUT, ERROR_HIGH_PRECISION_NOT_ENABLED } from '../src'

describe('AutoUnit错误处理测试', () => {
  describe('未提供有效的单位集', () => {
    it('should throw an error if units array is empty', () => {
      expect(() => new AutoUnit([])).toThrow('units is empty.')
    })
  })

  describe('getUnit', () => {
    const au = new AutoUnit(['mm', 10, 'cm'])

    it('意外的NaN输入', () => {
      expect(() => au.getUnit(NaN)).toThrow(ERROR_NAN_INPUT)
    })

    it('有意的NaN输入', () => {
      AutoUnit.ignoreNaNInputs = true
      expect(() => au.getUnit(NaN)).not.toThrow()
      AutoUnit.ignoreNaNInputs = false // Reset for other tests
    })

    it('未开启安全模式', () => {
      //@ts-expect-error
      expect(() => au.getUnit('123')).toThrow(ERROR_HIGH_PRECISION_NOT_ENABLED)
    })
  })

  describe('fromUnit', () => {
    const au = new AutoUnit(['mm', 10, 'cm'])

    it('意外的NaN输入', () => {
      expect(() => au.toBase(NaN, 'mm')).toThrow(ERROR_NAN_INPUT)
    })

    it('无效的单位', () => {
      expect(() => au.toBase(100, 'invalidUnit')).toThrow('Undefined unit: "invalidUnit".')
    })
  })

  describe('sepUnit', () => {
    const au = new AutoUnit(['mm', 10, 'cm'])

    it('无效的单位', () => {
      expect(() => au.splitUnit('123invalid')).toThrow('Undefined unit: "123invalid".')
    })
  })
})
