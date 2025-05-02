# AutoUnit

English documentation is translated by AI. If you have any questions about the content, please refer to the [Chinese document](./README.zh.md). Contributions to improve translations are welcome.

<div align="center">
<a href="./README.zh.md">中文文档</a>
|
<a href="./README.md">English</a>
</div>

`AutoUnit` is a utility class for automatic unit conversion, supporting custom unit systems, thresholds, and decimal place configurations.

- Automatically selects appropriate units to output formatted strings
- Reverse parses numeric values from unit-formatted strings
- Quickly build any unit system
- Supports high-precision calculations
- Supports calculations beyond JS safe number ranges

## Quick Links

- [Quick Start](#quick-start)
- [Best Practices](#best-practices)
- [API](#api)
- [Contributing](#contributing)

## Quick Start

- **Fixed-base Units**

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ], {
  baseDigit: 1024,
})

console.log(autoUnit.format(1024 * 1024 * 100)) // 100MB
```

> The `baseDigit` parameter represents the conversion base between units. For example, 1024 means 1KB equals 1024 bytes.

- **Variable-base Units**

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ])

console.log(autoUnit.format(1000)) // 1m
```

> You can customize conversion bases between units. For example, [ 'mm', 10, 'cm', 100, 'm', 1e3, 'km' ] means:
> 1 cm equals 10 mm, 1 m equals 100 cm, and 1 km equals 1000 m.

- **High Precision & Large Integers**

```ts
import AutoUnit from 'auto-unit';

const units = [ 'mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm' ]
const autoUnit = new AutoUnit(units, { highPrecision: true })

console.log(autoUnit.format(1e18)) // 1000Tm
```

> The `highPrecision` parameter enables high-precision mode using `decimal.js`. It supports `number`, `string`, `BigInt`, and `Decimal` inputs.

## Best Practices

- For most use cases requiring formatted unit strings, consider wrapping `format`:

```ts
import AutoUnit from 'auto-unit';

const autoUnit = new AutoUnit([ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ], {
  baseDigit: 1024,
})

export const formatFileSize = (num: number) => {
  return autoUnit.format(num)
}
```

- In modular projects (e.g., React/Vue), pre-initialize unit systems globally (e.g., in `utils/units.ts`) rather than recreating them per component.

## API

### **Constructor**

```ts
class AutoUnit {
  constructor(
          readonly units: (string | number)[],
          option: AutoUnitOptions<DS> = {},
  ) {}
}
```

- **Parameters**:
  - `units`: Unit array.
  - `option`: Configuration options.
    - `baseDigit?`: Base number for auto-generating unit conversions.
    - `threshold?`: Unit switch threshold (default: `1`).
    - `decimal?`: Decimal configuration (fixed number or range format).
    - `highPrecision?`: Enables `decimal.js` for precise calculations.

### **Methods**

###### `getUnit(num: Num<DS>)`

Gets the optimal unit and converted value from base units.

- **Parameters**:
  - `num`: Input number. Supports `number`, `string`, `BigInt`, and `Decimal` in high-precision mode.

- **Returns**:
  - `{ num: number, unit: string, decimal: Decimal }`: Converted value with unit. Includes `Decimal` in high-precision mode.

###### `format(num: Num<DS>, decimal = this.decimal)`

Formats a number into a unit-string representation.

- **Parameters**:
  - `num`: Input number (supports extended types in high-precision mode).
  - `decimal?`: Overrides default decimal configuration.

- **Returns**:
  - Formatted string with value and unit.

###### `toBase(num: Num<DS>, unit: string)`

Converts a unit-formatted number back to base units.

- **Parameters**:
  - `num`: Input value in specified unit.
  - `unit`: Current unit.

- **Returns**:
  - Converted value in base units (`number` or `Decimal`).

###### `splitUnit(str: string)`

Extracts numeric value and unit from a string.

- **Parameters**:
  - `str`: Input string containing value and unit.

- **Returns**:
  - `{ num: number, unit: string, decimal: Decimal }`: Parsed components with `Decimal` in high-precision mode.

###### `parse(str: string)`

Converts a unit-formatted string to base unit value.

- **Parameters**:
  - `str`: Input string.

- **Returns**:
  - Converted value in base units (`number` or `Decimal`).

###### `fromUnitFormat(num: number, unit: string, decimal?: DecimalPlace)`

Converts between units and formats with specified decimals.

- **Parameters**:
  - `num`: Input value.
  - `unit`: Source unit.
  - `decimal?`: Overrides default decimal configuration.

- **Returns**:
  - Formatted string with converted value and unit.

## Contributing

Contributions of all forms are welcome, including bug reports, documentation improvements, translation updates, and test enhancements.
