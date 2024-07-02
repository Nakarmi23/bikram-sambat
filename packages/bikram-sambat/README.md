# Bikram Sambat

> FIX: Fixed a major issue related to importing the package in CommonJS.

## Introduction

A utility library for working with Nepali (Bikram Sambat) Dates and converting AD dates to BS dates and vice versa. This library supports BS year from 1970 to 2111.

## Installation

### Package Manager

Using npm:

```bash
npm install @nakarmi23/bikram-sambat
```

Using yarn:

```bash
yarn add @nakarmi23/bikram-sambat
```

Using pnpm:

```bash
pnpm add @nakarmi23/bikram-sambat
```

Once the package is installed, you can import the library using `import` or `require` approach:

```typescript
import BikramSambat from '@nakarmi23/bikram-sambat';
```

or

```typescript
const BikramSambat = require('@nakarmi23/bikram-sambat').default;
```

### CDN

Using jsDelivr CND:

```html
<script src="https://cdn.jsdelivr.net/npm/@nakarmi23/bikram-sambat@latest/dist/index.global.js"></script>
```

Using unpkg CND:

```html
<script src="https://unpkg.com/@nakarmi23/bikram-sambat@latest/dist/index.global.js"></script>
```

You can also request a specific version by replacing `latest` with the version name. Example: 1.0.4.

## Example

```typescript
import BikramSambat from '@nakarmi23/bikram-sambat';

console.log(BikramSambat.now());
/**
 * OUTPUT:
 * {
 *  bsYear: 2081
 *  bsMonth: 3
 *  bsDay: 14
 *  weekDay: 5
 *  adDate: Javascript Date Instance
 *  bsMonthName: 'Ashadh'
 * }
 **/

console.log(BikramSambat.fromAD('2021-06-28'));
/**
 * OUTPUT:
 * {
 *  bsYear: 2081
 *  bsMonth: 3
 *  bsDay: 14
 *  weekDay: 5
 *  adDate: Javascript Date Instance
 *  bsMonthName: 'Ashadh'
 * }
 **/

console.log(BikramSambat.parse('2081-03-14'));
/**
 * OUTPUT:
 * {
 *  bsYear: 2081
 *  bsMonth: 3
 *  bsDay: 14
 *  weekDay: 5
 *  adDate: Javascript Date Instance
 *  bsMonthName: 'Ashadh'
 * }
 **/
```

## Methods

### static .now() -> instance of BikramSambat

Returns an instance of BikramSambat for today's date.

### static .parse(bsDate) -> instance of BikramSambat

Parses and validates the given BS date and returns an instance of BikramSambat for that date.

- BS Year must be between 1970 and 2111
- BS Month must be between 1 and 12

### static .fromAD(adDate) -> instance of BikramSambat

Parses and validates the give AD date and returns an instance of BikramSambat for that date.

### static .getBikramSambatMonths(bsYear) -> {month, monthName, numberOfDays}[]

Returns the list of BS months and also returns the number of days for th month according to the year provided.

- BS Year must be between 1970 and 2111

### .clone() -> instance of BikramSambat

Creates a new instance of BikramSambat with same values.

### .format(formatString) -> string

Get the formatted date according to the string of tokens passed in.

#### List of all available formats

| Format | Output             | Description                           |
| ------ | ------------------ | ------------------------------------- |
| YYYY   | 2081               | Four-digit year                       |
| MMMM   | Baishakh - Chaitra | The BS full month name                |
| MM     | 01-12              | The month, 2-digits                   |
| M      | 1-12               | The month, beginning at 1             |
| DD     | 01-31              | The day of the month, 2-digit         |
| D      | 1-31               | The day of the month                  |
| dddd   | Sunday-Saturday    | The name of the day of the week       |
| ddd    | Sun-Sat            | The short name of the day of the week |
| dd     | Su-Sa              | The min name of the day of the week   |
| d      | 0-6                | The day of the week, with Sunday as 0 |

### .startOf(unit) -> instance of BikramSambat

Returns a cloned BikramSambat object and set it to the start of a unit of time. Units are case insensitive.

#### List of all available units

| Unit  | Description                 |
| ----- | --------------------------- |
| year  | Baishakh 1st                |
| month | The first day of this month |

### .endOf(unit) -> instance of BikramSambat

Returns a cloned BikramSambat object and set it to the end of a unit of time. Units are case insensitive.

#### List of all available units

| Unit  | Description                 |
| ----- | --------------------------- |
| year  | Baishakh 1st                |
| month | The first day of this month |

### .add(value, unit) -> instance of BikramSambat

Returns a cloned BikramSambat object with a specified amount of time added. Units are case insensitive.

| Unit  | Description |
| ----- | ----------- |
| year  | Year        |
| month | Month       |
| day   | Day         |

### .sub(value, unit) -> instance of BikramSambat

Returns a cloned BikramSambat object with a specified amount of time subtracted. Units are case insensitive.

| Unit  | Description |
| ----- | ----------- |
| year  | Year        |
| month | Month       |
| day   | Day         |

### .isSame(date, unit) -> boolean

Return true if provided BikramSambat object is the same as the other supplied BikramSambat date. Unit defaults to `day`.

| Unit  | Description |
| ----- | ----------- |
| year  | Year        |
| month | Month       |
| day   | Day         |
| week  | Week        |

### .isBefore(date, unit) -> boolean

Return true if provided BikramSambat object is before the other supplied BikramSambat date. Unit defaults to `day`.

| Unit  | Description |
| ----- | ----------- |
| year  | Year        |
| month | Month       |
| day   | Day         |
| week  | Week        |

### .isAfter(date, unit) -> boolean

Return true if provided BikramSambat object is after the other supplied BikramSambat date. Unit defaults to `day`.

| Unit  | Description |
| ----- | ----------- |
| year  | Year        |
| month | Month       |
| day   | Day         |
| week  | Week        |

### .toString() -> string

Returns the BikramSambat object as a string.
