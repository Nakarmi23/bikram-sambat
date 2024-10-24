# @nakarmi23/react-bs-ad-calendar

[![npm version](https://badge.fury.io/js/%40nakarmi23%2Freact-bs-ad-calendar.svg)](https://badge.fury.io/js/%40nakarmi23%2Freact-bs-ad-calendar)

> This library is currently in beta and is published for internal testing purposes.

## Introduction

`@nakarmi23/react-bs-ad-calendar` is a React component library that provides easy-to-use, customizable calendar and date picker components for the Bikram Sambat date system, with the ability to switch to the Gregorian calendar. Designed to address the lack of robust solutions for regional date systems, this library focuses on developer experience, flexibility, and accessibility, enabling seamless integration into modern web applications.


At its core, this library utilizes [@nakarmi23/bikram-sambat](https://www.npmjs.com/package/@nakarmi23/bikram-sambat), ensuring precise management and manipulation of Bikram Sambat dates. Inspired by [Radix UI](https://www.radix-ui.com/primitives), it follows a compound component pattern for modularity and composability, allowing developers to customize and build calendar features with ease.

## Installation

### Package Manager

Using npm:

```bash
npm install @nakarmi23/bikram-sambat @nakarmi23/react-bs-ad-calendar
```

Using yarn:

```bash
yarn add @nakarmi23/bikram-sambat @nakarmi23/react-bs-ad-calendar
```

Using pnpm:

```bash
pnpm add @nakarmi23/bikram-sambat @nakarmi23/react-bs-ad-calendar
```

## Anatomy
Import all parts and piece them together.

```tsx
import * as Bialog from "@nakarmi23/bs-ad-calendar";

export default ()=>(
    <Calendar.Root>
      <Calendar.Header>
        <Calendar.Button slot='prev' />
        <Calendar.Heading />
        <Calendar.TypeButton />
        <Calendar.Button slot='next'/>
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.GridHeaderCell />}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {(date) => <Calendar.Cell />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
)

```
