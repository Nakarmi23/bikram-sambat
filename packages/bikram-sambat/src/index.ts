import dayjs from 'dayjs';
import { nepEngCalenderMaps } from './constraints/nepali-english-calender-maps';
import { months } from './constraints/nepali-english-month-name';
import { nepDateNoOfDays } from './constraints/nepali-month-total-days';
import { adDateFromBS } from './utilities/get-ad-date-from-bs';
import { getBSMonthTotalDays } from './utilities/get-bs-month-total-days';
import { getMonthsWithCumulativeDays } from './utilities/get-months-with-cumulative-days';
import { parseAdString } from './utilities/parse-ad-string';

interface BikramSambatProps {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  adDate: Date;
  bsMonthName: string;
}

export type UnitType = 'day' | 'date' | 'month' | 'year' | 'week';

export type StarOfEndOfType = Exclude<UnitType, 'date' | 'day' | 'week'>;

export type ManipulateType = 'month' | 'year' | 'day';

const MIN_BS_YEAR = 1970;
const MAX_BS_YEAR = 2111;

const MIN_MONTH = 1;
const MAX_MONTH = 12;

/**
 * Represents a Bikram Sambat date.
 * Provides various methods to manipulate and format Bikram Sambat dates.
 */
export class BikramSambat implements BikramSambatProps {
  /**
   * @deprecated This field will be removed or made private in upcoming versions. Please use `.get('year')` instead.
   */
  bsYear!: number;
  /**
   * @deprecated This field will be removed or made private in upcoming versions. Please use `.get('month')` instead.
   */
  bsMonth!: number;
  /**
   * @deprecated This field will be removed or made private in upcoming versions. Please use `.get('date')` instead.
   */
  bsDay!: number;
  /**
   * @deprecated This field will be removed or made private in upcoming versions. Please use `.get('day')` instead.
   */
  weekDay!: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  adDate!: Date;
  bsMonthName!: string;

  /**
   * @private
   * @param {BikramSambatProps} props - The properties of the Bikram Sambat date.
   */
  private constructor(props: BikramSambatProps) {
    Object.assign(this, props);
  }

  /**
   * Parses and validates the given BS date and returns an instance of BikramSambat for that date.
   *
   * - BS Year must be between 1970 and 2111
   * - BS Month must be between 1 and 12
   * @param {string} date - BS Date string to be parsed. Valid pattern: YYYY-MM-DD
   * @returns {BikramSambat} An instance of {@link BikramSambat}
   */
  static parse(date: string): BikramSambat {
    if (!(typeof date === 'string'))
      throw new Error('This function only accepts string.');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error(
        `Invalid date format: "${date}". Expected format is YYYY-MM-DD.`
      );

    const [year, month, day] = date.split('-').map((num) => parseInt(num)) as [
      number,
      number,
      number,
    ];

    if (year < MIN_BS_YEAR || year > MAX_BS_YEAR)
      throw new Error(
        `Year should be between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}`
      );

    if (month < MIN_MONTH || month > MAX_MONTH)
      throw new Error(
        `Invalid date month: ${month}. Month should be between ${MIN_MONTH} and ${MAX_MONTH}.`
      );

    const currentMonthIndex = month - 1;

    const englishDate = adDateFromBS(year, month, day);

    const bikramSambatDate = {
      weekDay: englishDate.day(),
      bsYear: year,
      bsMonth: month,
      bsDay: day,
      bsMonthName: months[currentMonthIndex]!.nepName,
      adDate: englishDate.toDate(),
    };

    return new BikramSambat(bikramSambatDate);
  }

  /**
   * Parses and validates the given AD date and returns an instance of BikramSambat for that date.
   * @param {Date | string} date - AD Date object or string to be parsed. Valid pattern for string: YYYY-MM-DD
   * @returns {BikramSambat} An instance of {@link BikramSambat}
   */
  static fromAD(date: string | Date): BikramSambat {
    if (typeof date === 'string') date = parseAdString(date);
    else if (!(date instanceof Date))
      throw new Error('This function only accepts string or Date object.');

    const englishDateDayjs = dayjs(date);
    const matchingCalendarPeriod = nepEngCalenderMaps.find((calendarPeriod) => {
      const startDate = dayjs(calendarPeriod.startDate);
      const endDate = dayjs(calendarPeriod.endDate);

      return (
        (endDate.isAfter(englishDateDayjs, 'date') &&
          startDate.isBefore(englishDateDayjs, 'date')) ||
        endDate.isSame(englishDateDayjs, 'date') ||
        startDate.isSame(englishDateDayjs, 'date')
      );
    });

    if (!matchingCalendarPeriod)
      throw new Error(
        `No corresponding Bikram Sambat date found for the English date ${date.toISOString().split('T')[0]}.`
      );

    const daysSinceStartOfPeriod =
      englishDateDayjs.diff(matchingCalendarPeriod.startDate, 'days') + 1;

    const bsMonthsWithCumulativeDays = getMonthsWithCumulativeDays(
      matchingCalendarPeriod.nepYear
    );

    const currentBsMonth = [...bsMonthsWithCumulativeDays].find(
      (month) => month.cumulativeDays >= daysSinceStartOfPeriod
    );

    if (!currentBsMonth)
      throw new Error(
        `Unable to determine the Bikram Sambat month for the given English date ${date.toISOString().split('T')[0]}.`
      );

    const previousBsMonth = bsMonthsWithCumulativeDays
      .filter((month) => month.cumulativeDays < daysSinceStartOfPeriod)
      .at(-1);

    const bikramSambatDate: BikramSambatProps = {
      weekDay: englishDateDayjs.day(),
      bsYear: matchingCalendarPeriod.nepYear,
      bsMonth: currentBsMonth.monthNumber,
      bsDay: previousBsMonth
        ? daysSinceStartOfPeriod - previousBsMonth.cumulativeDays
        : daysSinceStartOfPeriod,
      bsMonthName: currentBsMonth.monthName,
      adDate: date,
    };

    return new BikramSambat(bikramSambatDate);
  }

  /**
   * Returns a list of months and their total number of days of the year.
   * @param {number} year - Year to get the total number of days for each month.
   * @returns Array of months and their total number of days.
   * @throws {Error} Throws an error if the year is out of range (1970 - 2111) or invalid.
   */
  static getBikramSambatMonths(year: number) {
    if (year < MIN_BS_YEAR || year > MAX_BS_YEAR)
      throw new Error(
        `Year should be between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}`
      );

    const nepaliYearData = nepDateNoOfDays.find(
      (date) => date.nepYear === year
    );

    if (!nepaliYearData)
      throw new Error(
        `No data available for the year ${year} in the Bikram Sambat calendar.`
      );

    return months.map((month) => ({
      monthNumber: month.id,
      monthName: month.nepName,
      numberOfDays:
        nepaliYearData[`m${month.id}` as keyof typeof nepaliYearData],
    }));
  }

  /**
   * Returns the BikramSambat object as a string.
   * @returns {string} Formatted {@link BikramSambat} date as a formatted string `MMMM D YYYY`.
   */
  toString(): string {
    return `${this.bsMonthName} ${this.bsDay} ${this.bsYear}`;
  }

  /**
   * Returns an instance of BikramSambat for today's date.
   * @returns {BikramSambat} An instance of {@link BikramSambat} for today's date.
   */
  static now(): BikramSambat {
    return this.fromAD(new Date());
  }

  /**
   * Returns a cloned BikramSambat object with a specified amount of time added.
   * @param {number} value - The amount of the specified unit to add to the date.
   * @param {ManipulateType} [unit='day'] - The unit of time to add. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date with the specified amount of time added
   */
  add(value: number, unit: ManipulateType = 'day'): BikramSambat {
    const newDate = BikramSambat.fromAD(
      dayjs(this.adDate).add(value, unit).toDate()
    );

    return newDate;
  }

  /**
   * Returns a cloned BikramSambat object with a specified amount of time subtracted.
   * @param {number} value - The amount of the specified unit to subtract from the date.
   * @param {ManipulateType} [unit='day'] - The unit of time to subtract. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date with the specified amount of time subtracted
   */
  sub(value: number, unit: ManipulateType = 'day'): BikramSambat {
    return this.add(value * -1, unit);
  }

  /**
   * Returns a cloned BikramSambat object set to the start of the specified unit.
   * @param {StarOfEndOfType} unit - The unit to set to the start. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date set to the start of the specified unit
   */
  startOf(unit: StarOfEndOfType): BikramSambat {
    const clone = this.clone();
    if (unit === 'month') clone.bsDay = 1;
    if (unit === 'year') {
      clone.bsDay = 1;
      clone.bsMonth = 1;
      clone.bsMonthName = months.at(0)!.nepName;
    }

    const newAdDate = adDateFromBS(clone.bsYear, clone.bsMonth, clone.bsDay);

    clone.adDate = newAdDate.toDate();
    clone.weekDay = newAdDate.day();

    return clone;
  }

  /**
   * Returns a cloned BikramSambat object set to the end of the specified unit.
   * @param {StarOfEndOfType} unit - The unit to set to the end. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date set to the end of the specified unit
   */
  endOf(unit: StarOfEndOfType): BikramSambat {
    const clone = this.clone();
    if (unit === 'month') {
      clone.bsDay = getBSMonthTotalDays(clone.bsMonth, clone.bsYear);
    } else if (unit === 'year') {
      clone.bsMonth = 12;
      clone.bsMonthName = months.at(-1)!.nepName;
      clone.bsDay = getBSMonthTotalDays(clone.bsMonth, clone.bsYear);
    }

    const newAdDate = adDateFromBS(clone.bsYear, clone.bsMonth, clone.bsDay);

    clone.adDate = newAdDate.toDate();
    clone.weekDay = newAdDate.day();

    return clone;
  }

  /**
   * Formats the BikramSambat date according to the specified format string.
   * Supported tokens:
   * - YYYY: Full year
   * - MM: Month number (zero-padded)
   * - M: Month number
   * - MMMM: Full month name
   * - DD: Date (zero-padded)
   * - D: Date
   * - dddd: Full weekday name
   * - ddd: Abbreviated weekday name
   * - dd: Minimized weekday name
   * - d: Day of the week
   * @param {string} formatString - The format string to use for formatting the date.
   * @returns {string} The formatted date string.
   */
  format(formatString: string): string {
    const REGEX_FORMAT = /Y{4}|M{1,4}|D{1,2}|d{1,4}/g;

    const matches = (match: string) => {
      switch (match) {
        case 'MMMM':
          return this.bsMonthName;
        case 'MM':
          return this.bsMonth.toString().padStart(2, '0');
        case 'M':
          return this.bsMonth.toString();
        case 'YYYY':
          return this.bsYear.toString();
        case 'DD':
          return this.bsDay.toString().padStart(2, '0');
        case 'D':
          return this.bsDay.toString();
        case 'dddd':
          return dayjs(this.adDate).format('dddd');
        case 'ddd':
          return dayjs(this.adDate).format('ddd');
        case 'dd':
          return dayjs(this.adDate).format('dd');
        case 'd':
          return dayjs(this.adDate).format('d');
      }
      return null;
    };

    return formatString.replace(
      REGEX_FORMAT,
      (match) => matches(match) || match
    );
  }

  /**
   * Creates and returns a deep copy of the current BikramSambat instance.
   * @returns {BikramSambat} A new instance of {@link BikramSambat} with the same date properties.
   */
  clone(): BikramSambat {
    return new BikramSambat({
      adDate: new Date(this.adDate),
      bsDay: this.bsDay,
      bsMonth: this.bsMonth,
      bsMonthName: this.bsMonthName,
      bsYear: this.bsYear,
      weekDay: this.weekDay,
    });
  }

  /**
   * Checks if the current BikramSambat date is the same as the given date.
   * @param {BikramSambat | Date} date - The date to compare with.
   * @param {UnitType} [unit='day'] - The unit of time to compare. Defaults to 'day'.
   * @returns {boolean} True if the dates are the same, false otherwise.
   * @throws {Error} Throws an error if the value is not a instance of BikramSambat or Date.
   */
  isSame(date: BikramSambat | Date, unit: UnitType = 'day'): boolean {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isSame(date, unit);
  }

  /**
   * Checks if the current BikramSambat date is before the given date.
   * @param {BikramSambat | Date} date - The date to compare with.
   * @param {UnitType} [unit='day'] - The unit of time to compare. Defaults to 'day'.
   * @returns {boolean} True if the current date is before the given date, false otherwise.
   * @throws {Error} Throws an error if the value is not a instance of BikramSambat or Date.
   */
  isBefore(date: BikramSambat | Date, unit: UnitType = 'day'): boolean {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isBefore(date, unit);
  }

  /**
   * Checks if the current BikramSambat date is after the given date.
   * @param {BikramSambat | Date} date - The date to compare with.
   * @param {UnitType} [unit='day'] - The unit of time to compare. Defaults to 'day'.
   * @returns {boolean} True if the current date is after the given date, false otherwise.
   * @throws {Error} Throws an error if the value is not a instance of BikramSambat or Date.
   */
  isAfter(date: BikramSambat | Date, unit: UnitType = 'day'): boolean {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isAfter(date, unit);
  }

  /**
   * Get the value of a specific unit (day, month, year, date).
   *
   * @param {Exclude<UnitType, 'week'>} unit - The unit type to get the value of ('day', 'month', 'year', 'date').
   * @returns {number} The value of the specified unit.
   * @throws {Error} Throws an error if an invalid unit is provided.
   */
  get(unit: Exclude<UnitType, 'week'>): number {
    switch (unit) {
      case 'day':
        return this.weekDay;
      case 'month':
        return this.bsMonth;
      case 'year':
        return this.bsYear;
      case 'date':
        return this.bsDay;
      default:
        throw new Error(`Invalid unit: ${unit}`);
    }
  }

  /**
   * Get or set the Bikram Sambat year.
   *
   * If setting the year, it adjusts the date to ensure it is valid within the new year.
   *
   * @param {number} [value] - The year to set. If not provided, returns the current year.
   * @returns {number | BikramSambat} The current year if no value is provided, otherwise a new BikramSambat instance with the updated year.
   * @throws {Error} Throws an error if the value is not a number or is out of range (1970 - 2111).
   */
  year(value?: number): number | BikramSambat {
    if (!value) return this.get('year');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    if (value < MIN_BS_YEAR || value > MAX_BS_YEAR)
      throw new Error(
        `Year should be between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}`
      );

    const currentMonth = this.get('month');

    const totalPossibleDays = getBSMonthTotalDays(currentMonth, value);

    const newDate =
      this.get('date') > totalPossibleDays
        ? totalPossibleDays
        : this.get('date');

    return BikramSambat.parse(
      `${value}-${currentMonth.toString().padStart(2, '0')}-${newDate.toString().padStart(2, '0')}`
    );
  }

  /**
   * Get or set the Bikram Sambat month.
   *
   * If setting the month, it adjusts the date to ensure it is valid within the new month.
   *
   *
   * @param {number} [value] - The month to set. If not provided, returns the current month.
   * @returns {number|BikramSambat} - The current month if no value is provided, otherwise a new BikramSambat instance with the updated month.
   * @throws {Error} - Throws an error if the value is not a number.
   */
  month(value?: number): number | BikramSambat {
    if (!value) return this.get('month');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    // if current date is 2081-03-03 and the value is 1, then 1 - 3 = -2 represents the number of months that needs to be added to the current date, which will result in the new date object being 2081-01-03.
    value = value - this.get('month');

    const updatedDate = this.add(value, 'month');

    const daysInUpdatedMonth = getBSMonthTotalDays(
      updatedDate.get('month'),
      updatedDate.get('year')
    );

    const adjustedDays =
      daysInUpdatedMonth < this.get('date')
        ? daysInUpdatedMonth
        : this.get('date');

    return updatedDate.date(adjustedDays);
  }

  /**
   * Get or set the Bikram Sambat date.
   *
   * @param {number} [value] - The date to set. If not provided, returns the current date.
   * @returns {number | BikramSambat} The current date if no value is provided, otherwise a new BikramSambat instance with the updated date.
   * @throws {Error} Throws an error if the value is not a number.
   */
  date(value?: number): number | BikramSambat {
    if (!value) return this.get('date');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    // if current date is 2081-03-03 and the value is 1, then 1 - 3 = -2 represents the number of days that needs to be added to the current date, which will result in the new date object being 2081-03-01.
    value = value - this.get('date');

    return this.add(value, 'day');
  }

  /**
   * Get or set the Bikram Sambat day of the week.
   *
   * @param {number} [value] - The day of the week to set. If not provided, returns the current day of the week.
   * @returns {number|BikramSambat} The current day of the week if no value is provided, otherwise a new BikramSambat instance with the updated day of the week.
   * @throws {Error} Throws an error if the value is not a number.
   */
  day(value?: number): number | BikramSambat {
    if (!value) return this.get('day');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    // if current week day is 4 (Thu) and the value is 1 (Mon), then 1 - 4 = -3 represents the number of days that needs to be added to the current date, which will result in the week day of the new date object being Monday.
    value = value - this.get('day');

    return this.add(value, 'day');
  }

  /**
   * Set the value of a specific unit (day, month, year, date).
   *
   * @param {Exclude<UnitType, 'week'>} unit - The unit type to set the value of ('day', 'month', 'year', 'date').
   * @param {number} value - The value to set for the specified unit.
   * @returns {BikramSambat} A new BikramSambat instance with the updated unit value.
   * @throws {Error} Throws an error if the value is not a number.
   */
  set(unit: Exclude<UnitType, 'week'>, value: number): BikramSambat {
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    return this[unit](value) as BikramSambat;
  }
}

export default BikramSambat;
