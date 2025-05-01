# auto-unit

<div align="center">
<a href="./README.zh.md">中文文档</a>
</div>

**Class: `AutoUnit`**
`AutoUnit` is a utility class designed for automatic unit conversion. It supports custom unit systems, threshold settings, and decimal precision configurations.
##### **Constructor**
``` typescript
constructor(units: (string | number)[], option: AutoUnitOptions = {})
```
- **Parameters**:
  - `units`: An array of units where even indices represent unit names (strings or numbers), and odd indices represent their conversion bases.
  - : Configuration options.
    - `baseDigit?`: Base digit for automatic unit generation. If provided, it will generate a complete list of units based on this base.
    - `threshold?`: Threshold value, default is `1`. Affects the condition for unit switching.
    - `decimal?`: Decimal configuration, can be a fixed number of decimal places or a range format.

`option`

##### **Methods**
###### `getUnit(num: number)`
Retrieves the corresponding unit and adjusted value based on the input number.
- **Parameters**:
  - `num`: Input number.

- **Returns**:
  - `{ num: number, unit: string }`: The adjusted number and its corresponding unit.

###### `toString(num: number, decimal = this.decimal)`
Converts a number to its string representation with an optional decimal configuration.
- **Parameters**:
  - `num`: Input number.
  - `decimal?`: Decimal configuration, defaults to the instance's default value.

- **Returns**:
  - A formatted string containing the number and its unit.

###### `fromUnit(num: number, unit: string)`
Converts a number from a specified unit to the base unit.
- **Parameters**:
  - `num`: Number to be converted.
  - `unit`: The unit from which the number will be converted.

- **Returns**:
  - The number converted to the base unit.

###### `sepUnit(str: string)`
Separates the numeric part and the unit from a given string.
- **Parameters**:
  - `str`: A string containing a numeric value followed by a unit.

- **Returns**:
  - `{ num: number, unit: string }`: The separated numeric value and unit.

###### `fromString(str: string)`
Converts a string representation into a formatted value in the base unit.
- **Parameters**:
  - `str`: A string containing a numeric value and unit.

- **Returns**:
  - The formatted value derived from the numeric part and unit extracted from the input string.

###### `convertUnit(num: number, unit: string, decimal?: number)`
Converts a number from one unit to the optimal unit, with the option to specify decimal precision.
- **Parameters**:
  - `num`: The number to be converted.
  - `unit`: The original unit.
  - `decimal?`: The number of decimal places for the formatted output.

- **Returns**:
  - A string representation of the converted number, formatted to the specified decimal precision if provided.
