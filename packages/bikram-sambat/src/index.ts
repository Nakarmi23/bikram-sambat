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
export default class BikramSambat implements BikramSambatProps {
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
   * @param {string} toParse - BS Date string to be parsed. Valid pattern: YYYY-MM-DD
   * @returns {BikramSambat} An instance of {@link BikramSambat}
   */
  static parse(date: string) {
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
  static fromAD(date: string | Date) {
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
   * @param {number} year - Year to get the total number of days for each month
   * @returns {MonthTotalDaysItem[]} Array of months and their total number of days
   */
  static getBikramSambatMonths(year: number) {
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
   * @returns {string} Formatted {@link BikramSambat} date as a string
   */
  toString() {
    return `${this.bsMonthName} ${this.bsDay} ${this.bsYear}`;
  }

  /**
   * Returns an instance of BikramSambat for today's date.
   * @returns {BikramSambat} An instance of {@link BikramSambat} for today's date
   */
  static now() {
    return this.fromAD(new Date());
  }

  /**
   * Returns a cloned BikramSambat object with a specified amount of time added.
   * @param {number} value - The amount of the specified unit to add to the date.
   * @param {ManipulateType} [unit='day'] - The unit of time to add. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date with the specified amount of time added
   */
  add(value: number, unit: ManipulateType = 'day') {
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
  sub(value: number, unit: ManipulateType = 'day') {
    return this.add(value * -1, unit);
  }

  /**
   * Returns a cloned BikramSambat object set to the start of the specified unit.
   * @param {StarOfEndOfType} unit - The unit to set to the start. Valid units include 'day', 'month', 'year'.
   * @returns {BikramSambat} A new {@link BikramSambat} date set to the start of the specified unit
   */
  startOf(unit: StarOfEndOfType) {
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
  endOf(unit: StarOfEndOfType) {
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
  format(formatString: string) {
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
  clone() {
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
   */
  isSame(date: BikramSambat | Date, unit: UnitType = 'day') {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isSame(date, unit);
  }

  /**
   * Checks if the current BikramSambat date is before the given date.
   * @param {BikramSambat | Date} date - The date to compare with.
   * @param {UnitType} [unit='day'] - The unit of time to compare. Defaults to 'day'.
   * @returns {boolean} True if the current date is before the given date, false otherwise.
   */
  isBefore(date: BikramSambat | Date, unit: UnitType = 'day') {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isBefore(date, unit);
  }

  /**
   * Checks if the current BikramSambat date is after the given date.
   * @param {BikramSambat | Date} date - The date to compare with.
   * @param {UnitType} [unit='day'] - The unit of time to compare. Defaults to 'day'.
   * @returns {boolean} True if the current date is after the given date, false otherwise.
   */
  isAfter(date: BikramSambat | Date, unit: UnitType = 'day') {
    if (date instanceof BikramSambat) date = date.adDate;
    else if (!(date instanceof Date)) throw new Error('Invalid compare value');

    return dayjs(this.adDate).isAfter(date, unit);
  }

  get(unit: Exclude<UnitType, 'week'>) {
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

    return BikramSambat.parse(`${value}-${currentMonth}-${newDate}`);
  }

  month(value?: number): number | BikramSambat {
    if (!value) return this.get('month');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    if (value < MIN_MONTH || value > MIN_MONTH)
      throw new Error(`Month should be between ${MIN_MONTH} and ${MAX_MONTH}`);

    const currentYear = this.get('year');

    const totalPossibleDays = getBSMonthTotalDays(value, currentYear);

    const newDate =
      this.get('date') > totalPossibleDays
        ? totalPossibleDays
        : this.get('date');

    return BikramSambat.parse(`${currentYear}-${value}-${newDate}`);
  }

  date(value?: number): number | BikramSambat {
    if (!value) return this.get('date');
    if (typeof value != 'number')
      throw new Error(`Invalid value ${value}. Value must be a number.`);

    const currentYear = this.get('year');
    const currentMonth = this.get('month');

    const totalPossibleDays = getBSMonthTotalDays(currentMonth, currentYear);

    if (value < 1 || value > totalPossibleDays)
      throw new Error(`Date should be between ${1} and ${totalPossibleDays}`);

    return BikramSambat.parse(`${currentYear}-${currentMonth}-${value}`);
  }

  day(value?: number): number | BikramSambat {
    if (!value) return this.get('day');

    // if current week day is 4 (Thu) and the value is 1 (Mon), then 1 - 4 = -3 represents the number of days that needs to be added to the current date, which will result in the week day of the new date object being Monday.
    value = value - this.get('day');

    return this.add(value, 'day');
  }
}
