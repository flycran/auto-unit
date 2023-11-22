# 介绍

`auto-unit` 是一个精简的，自动选择合适的计量单位的库。

# 特性

- 自动选择合适的计量单位
- 支持自动切换科学计数法
- 支持自定义进制位数
- 支持自定义单位列表
- 支持自定义小数位数
- 支持自定义阈值

# 安装

```bash
npm install auto-unit
```

# 使用

```ts
const au = new AutoUnit([ 'b', 'kb', 'mb' ], {
  decimal: 1024,
})

console.log(au.toString(1024)) // 1kb
```

# API

## AutoUnit

```ts
export default class AutoUnit {
  constructor(units: string[], options?: AutoUnitOptions) {
  }
}
```

### 参数

- **units**

    - 类型: `string[]`
    - 示例: `['b', 'kb', 'mb', 'gb', 'tb']`

  > 计量单位列表

- **options**

    - 类型: [AutoUnitOptions](#AutoUnitOptions)
    - 示例: `{ decimal: 1024 }`
    - 可选

  > [配置项](#AutoUnitOptions)

## getUnit

```ts
export default class AutoUnit {
  getUnit(num: number): { unit: string; num: number } {
  }
}
```

### 参数

- **num**

    - 类型: `number`
    - 示例值: `1024 * 10`

  > 数字，根据`num`自动选择合适的计量单位

### 返回值

> 返回值`unit`表示单位，`num`表示转换后的数字

## toString

```ts
export default class AutoUnit {
  toString(num: number, decimalPlace?: number): string {
  }
}
```

### 参数

- **num**

  - 类型: `number`
  - 示例值: `1024 * 10`

  >   数字，根据`num`自动选择合适的计量单位

  - **decimalPlace**

  - 类型: `number`
  - 示例值: `2`

  > 覆盖`option.decimalPlace`
  >
  > 具体效果见[DecimalPlace](#DecimalPlace)

# Interface

## AutoUnitOptions

```ts
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
```

### decimal

- 类型: `number`
- 示例值: `1000`
- 可选

> 进制位数

### threshold

- 类型: `number`
- 示例值: `1024`
- 默认值: `1`
- 可选

> 阈值
> 表述超出进制位数的多少后开始升级单位
>
> 例如当设置`threshold`为`1024*2`时，只有当`num`大于等于`2048`时才会使用`kb`为单位。
> 当然也可以设置为负数，例如`-24`，当`num`大于大于`1000`的时候就使用`kb`为单位。

### exponential

- 类型: `number`
- 示例值: `1000`
- 可选

> 科学计数法
>
> 例如`1024 * 1024 * 1000`会被转换为`1e+3md`
>
> 科学计数法的生效与单位无关，只要最后的数字部分超过`exponential`就会生效。

### decimalPlace

- 类型: [DecimalPlace](#DecimalPlace)
- 示例值: `2-1`
- 可选

> [小数位数](#DecimalPlace)

## DecimalPlace

```ts
export type DecimalPlace =
  | number
  | `-${ number }`
  | `${ number }-`
  | `${ number }-${ number }`
  | undefined
```

> 描述小数位数
>
> 当使用`number`时，固定小数位数，行为类似`toFixed`
>
> 当使用`min-max`时表示小数位保持在`min`到`max`之间，如果小数位不足`min`则填充`0`，如果超过`max`则截断
> `min`和`max`各自可选，但不能同时不指定，如果不指定，则表示不限制

# 扩展

> 你可以通过`extend`关键字来扩展`AutoUnit`。
> 具体的做法应该参考typescript的类的继承。