# auto-unit

<div align="center">
<a href="./README.md">English</a>
</div>

### AutoUnit API 文档
#### 中文版本
**类：`AutoUnit`**
`AutoUnit` 是一个用于自动单位转换的工具类，支持自定义单位系统、阈值和小数位数设置。
##### **构造函数**
``` typescript
constructor(units: (string | number)[], option: AutoUnitOptions = {})
```
- **参数**：
    - `units`: 单位数组，偶数索引为单位名称（字符串或数字），奇数索引为其换算基数。
    - : 配置选项。
        - `baseDigit?`: 自动填充基数。如果提供，将根据该基数生成完整的单位列表。
        - `threshold?`: 阈值，默认值为 `1`。影响单位切换时的判断条件。
        - `decimal?`: 小数位数配置，可以是固定位数或范围格式。

`option`

##### **方法**
###### `getUnit(num: number)`
获取输入数字对应的单位和调整后的数值。
- **参数**：
    - `num`: 输入数字。

- **返回值**：
    - `{ num: number, unit: string }`：调整后的数字及其对应的单位。

###### `toString(num: number, decimal = this.decimal)`
将数字转换为带有单位的字符串表示形式。
- **参数**：
    - `num`: 输入数字。
    - `decimal?`: 小数位数配置，默认使用实例的默认值。

- **返回值**：
    - 格式化后的字符串，包含数值和单位。

###### `fromUnit(num: number, unit: string)`
将指定单位下的数字转换为基础单位。
- **参数**：
    - `num`: 数字。
    - `unit`: 当前单位。

- **返回值**：
    - 转换后在基础单位下的数字。

###### `sepUnit(str: string)`
从字符串中分离出数值和单位。
- **参数**：
    - `str`: 包含数值和单位的字符串。

- **返回值**：
    - `{ num: number, unit: string }`：分离出的数值和单位。

###### `fromString(str: string)`
将字符串表示的数值和单位转换为基础单位的数字。
- **参数**：
    - `str`: 包含数值和单位的字符串。

- **返回值**：
    - 转换后在基础单位下的数字。

###### `convertUnit(num: number, unit: string, decimal?: number)`
将数字从一种单位转换为最佳单位，并可指定小数位数。
- **参数**：
    - `num`: 输入数字。
    - `unit`: 原始单位。
    - `decimal?`: 小数位数。

- **返回值**：
    - 转换后的字符串表示形式。
