## AutoUnit

<div align="center">
<a href="./README.zh.md">中文文档</a>
|
<a href="./README.md">English</a>
</div>

`AutoUnit` 是一个用于自动单位转换的工具类，支持自定义单位系统、阈值和小数位数设置。

- 自动选择合适的单位输出带单位的字符串
- 从带单位的字符串中逆向解析出基本数值
- 快速构建任何单位系统
- 支持高精度的计算
- 支持超出JS安全数值范围的计算

## 快速转到

- [快速开始](#快速开始)
- [最佳实践](#最佳实践)
- [API](#API)
- [贡献](#贡献)

## 快速开始

- **固定进制单位**

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ], {
  baseDigit: 1024,
})

console.log(autoUnit.format(1024 * 1024 * 100)) // 100MB
```

> `baseDigit`参数表示每个单位的进制数，比如1024，表示1KB等于1024字节。

- **不固定进制单位**

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])

console.log(autoUnit.format(1000)) // 1m
```

> 你可以自定义每个单位之间的换算基数，比如[ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ]
> 表示1cm等于10mm，1m等于100cm，1km等于1000m。

- **高精度和大整数**

```ts
import AutoUnit from 'auto-unit';

const units = [ 'mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm' ]
const autoUnit = new AutoUnit(units, { highPrecision: true })

console.log(autoUnit.format(1e18)) // 1000Tm
```

> `highPrecision`参数表示是否开启高精度模式，开启后，将使用`decimal.js`进行安全的计算，你可以直接提供
`number`、`string`、`BigInt`，或者`Decimal`进行计算。

## 最佳实践

- 大多数场景下只需要拼接单位的功能，如果你需要更方便的调用，你可以简单的封装`format`

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ], {
  baseDigit: 1024,
})

export const formatFileSize = (num: number) => {
  return autoUnit.format(num)
}
```

- 对于模块化项目，或者使用`React`、`Vue`的项目，应该在最开始时实例化所有你可能用的到的单位系统，而不是在每个模块/组件中重复实例化，你可以在
  `utils/units.ts`下实例化你用的到的单位系统。

## API

### **构造函数**

```ts
class AutoUnit {
  constructor(
    readonly units: (string | number)[],
    option: AutoUnitOptions<DS> = {},
  ) {}
}
```

- **参数**：
    - `units`: 单位数组。
    - `option`: 配置选项。
        - `baseDigit?`: 自动填充基数。如果提供，将根据该基数生成完整的单位列表。
        - `threshold?`: 阈值，默认值为 `1`。影响单位切换时的判断条件。
        - `decimal?`: 小数位数配置，可以是固定位数或范围格式。
        - `highPrecision?`: 是否开启高精度模式，开启后，将使用`decimal.js`进行安全的计算。

##### **方法**

###### `getUnit(num: Num<DS>)`

从基本单位获取最佳单位和计算后的数值。

- **参数**：
    - `num`: 输入数字，若开启了高精度模式，支持`number`、`string`、`BigInt`、`Decimal`。

- **返回值**：
    - `{ num: number, unit: string, decimal: Decimal }`：计算后的数值和单位。若开启了高精度模式，额外返回
      `Decimal`对象。

###### `format(num: Num<DS>, decimal = this.decimal)`

将数字格式化为带有最佳单位的字符串表示。

- **参数**：
    - `num`: 输入数字，若开启了高精度模式，支持`number`、`string`、`BigInt`、`Decimal`。。
    - `decimal?`: 小数位数配置，默认使用实例的默认值。

- **返回值**：
    - 格式化后的字符串，包含数值和单位。

###### `toBase(num: Num<DS>, unit: string)`

将指定单位下的数字转换为基础单位。

- **参数**：
    - `num`: 输入数字，若开启了高精度模式，支持`number`、`string`、`BigInt`、`Decimal`。
    - `unit`: 当前单位。

- **返回值**：
    - 转换后在基础单位下的数值。
    - 若开启了高精度模式，则返回`Decimal`

###### `splitUnit(str: string)`

从字符串中分离出数值和单位。

- **参数**：
    - `str`: 包含数值和单位的字符串。

- **返回值**：
    - `{ num: number, unit: string, decimal: Decimal }`：分离出的数值和单位。若开启了高精度模式，额外返回
      `Decimal`对象。

###### `parse(str: string)`

将字符串表示的数值和单位转换为基础单位的数字。

- **参数**：
    - `str`: 包含数值和单位的字符串。

- **返回值**：
    - 转换后在基础单位下的数字。
    - 若开启了安全精度计算，则返回`Decimal`

###### `fromUnitFormat(num: number, unit: string, decimal?: DecimalPlace)`

将数字从一种单位转换为最佳单位，并可指定小数位数。

- **参数**：
    - `num`: 输入数字。
    - `unit`: 原始单位。
    - `decimal?`: 小数位数配置，默认使用实例的默认值。

- **返回值**：
    - 转换后的字符串表示形式。

## 贡献

欢迎任何形式的贡献，包括但不限于报告错误、改进和翻译文档、改进和添加单元测试。
