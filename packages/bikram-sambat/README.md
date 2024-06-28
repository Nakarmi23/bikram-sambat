# Bikram Sambat

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
const BikramSambat = require('@nakarmi23/bikram-sambat');
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

If you are using CDN you, the BikramSambat class is wrapped in an variable Object called `bikramSambat`.

```javascript
console.log(bikramSambat.BikramSambat.fromAD('2021-06-28'));
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

### BikramSambat.now() -> instanceof BikramSambat

Returns an instance of BikramSambat for today's date.

### BikramSambat.parse(bsDate) -> instanceof BikramSambat

Parses and validates the given BS date and returns an instance of BikramSambat for that date.

- BS Year must be between 1970 and 2111
- BS Month must be between 1 and 12

### BikramSambat.fromAD(adDate) -> instanceof BikramSambat

Parses and validates the give AD date and returns an instance of BikramSambat for that date.

### BikramSambat.getBikramSambatMonths(bsYear) -> {month, monthName, numberOfDays}[]

Returns the list of BS months and also returns the number of days for th month according to the year provided.

- BS Year must be between 1970 and 2111
