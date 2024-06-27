import dayjs from 'dayjs';
import { nepEngCalenderMaps } from './nepali-english-calender-maps';
import { nepDateNoOfDays } from './nepali-month-total-days';
import { months } from './nepali-english-month-name';

interface BikramSambatProps {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  adDate: Date;
  bsMonthName: string;
}

const _isLeap = (year: number) => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

const _getADMonthTotalDays = (month: number, year: number) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return _isLeap(year) ? 29 : 28;
    default:
      throw new Error(
        `Invalid date month: ${month}. Month should be between 1 and 12.`
      );
  }
};

const _parseAdString = (date: string) => {
  if (typeof date === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error(
        `Invalid date format: "${date}". Expected format is YYYY-MM-DD.`
      );
    const [year, month, day] = date.split('-').map((num) => parseInt(num)) as [
      number,
      number,
      number,
    ];

    if (month < 1 || month > 12)
      throw new Error(
        `Invalid date month: ${month}. Month should be between 1 and 12.`
      );

    const totalPossibleDays = _getADMonthTotalDays(month, year);

    if (day < 1 || month > totalPossibleDays)
      throw new Error(
        `Invalid date day: ${day}. Day should be between 1 and ${totalPossibleDays} for month ${month}.`
      );

    return new Date(date);
  }

  throw new Error('Unable to parse AD string.');
};

const _getMonthsWithCumulativeDays = (year: number) => {
  return BikramSambat.getBikramSambatMonths(year).reduce(
    (
      accumulatedMonths: {
        monthNumber: number;
        monthName: string;
        cumulativeDays: number;
      }[],
      currentMonth
    ) => {
      const cumulativeDays =
        !accumulatedMonths || accumulatedMonths.length === 0
          ? currentMonth.numberOfDays
          : currentMonth.numberOfDays +
            accumulatedMonths.at(-1)!.cumulativeDays;
      return [
        ...accumulatedMonths,
        {
          monthNumber: currentMonth.monthNumber,
          monthName: currentMonth.monthName,
          cumulativeDays: cumulativeDays,
        },
      ];
    },
    []
  );
};

export default class BikramSambat implements BikramSambatProps {
  bsYear!: number;
  bsMonth!: number;
  bsDay!: number;
  weekDay!: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  adDate!: Date;
  bsMonthName!: string;

  private constructor(props: BikramSambatProps) {
    Object.assign(this, props);
  }

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

    if (year < 1970 || year > 2111)
      throw new Error('Year should be between 1970 and 2111.');

    if (month < 1 || month > 12)
      throw new Error(
        `Invalid date month: ${month}. Month should be between 1 and 12.`
      );

    const matchingCalendarPeriod = nepEngCalenderMaps.find(
      (calendarPeriod) => calendarPeriod.nepYear === year
    );

    if (!matchingCalendarPeriod)
      throw new Error(
        `No corresponding data found for the Bikram Sambat year ${year}.`
      );

    const totalPossibleDays = matchingCalendarPeriod[
      `m${month}` as keyof typeof matchingCalendarPeriod
    ] as number;

    if (day < 1 || day > totalPossibleDays)
      throw new Error(
        `Invalid date day: ${day}. Day should be between 1 and ${totalPossibleDays} for month ${month}.`
      );

    const startOfYearDate = new Date(matchingCalendarPeriod.startDate);

    const bsMonthsWithCumulativeDays = _getMonthsWithCumulativeDays(year);

    const currentMonthIndex = month - 1;
    const daysSinceStartOfYear =
      (month === 1
        ? 0
        : bsMonthsWithCumulativeDays[currentMonthIndex - 1]!.cumulativeDays) +
      day;

    const englishDate = dayjs(startOfYearDate).add(
      daysSinceStartOfYear - 1,
      'days'
    );

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

  static fromAD(date: string | Date) {
    if (typeof date === 'string') date = _parseAdString(date);
    else if (!(date instanceof Date))
      throw new Error('This function only accepts string or Date object.');

    const englishDateDayjs = dayjs(date);
    const matchingCalendarPeriod = nepEngCalenderMaps.find((calendarPeriod) => {
      const startDate = new Date(calendarPeriod.startDate);
      const endDate = new Date(calendarPeriod.endDate);

      return +endDate >= +date && +startDate <= +date;
    });

    if (!matchingCalendarPeriod)
      throw new Error(
        `No corresponding Bikram Sambat date found for the English date ${date.toISOString().split('T')[0]}.`
      );

    const daysSinceStartOfPeriod =
      englishDateDayjs.diff(matchingCalendarPeriod.startDate, 'days') + 1;

    const bsMonthsWithCumulativeDays = _getMonthsWithCumulativeDays(
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

  toString() {
    return `${this.bsMonthName} ${this.bsDay} ${this.bsYear}`;
  }

  static now() {
    return this.fromAD(new Date());
  }
}
