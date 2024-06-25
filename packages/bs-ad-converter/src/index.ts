import dayjs from 'dayjs';
import { nepEngCalenderMaps } from './nepali-english-calender-maps';
import { nepDateNoOfDays } from './nepali-month-total-days';
import { isEmpty } from 'lodash';
import { months } from './nepali-english-month-name';

export function getBikramSambatMonthNoOfDays(year: number) {
  const nepaliYearData = nepDateNoOfDays.find((date) => date.nepYear === year);

  if (!nepaliYearData)
    throw new Error(
      `No data available for the year ${year} in the Bikram Sambat calendar.`
    );

  return months.map((month) => ({
    monthNumber: month.id,
    monthName: month.nepName,
    numberOfDays: nepaliYearData[`m${month.id}` as never] as number,
  }));
}

function getMonthsWithCumulativeDays(year: number) {
  return getBikramSambatMonthNoOfDays(year).reduce(
    (
      accumulatedMonths: {
        monthNumber: number;
        monthName: string;
        cumulativeDays: number;
      }[],
      currentMonth
    ) => {
      const cumulativeDays = isEmpty(accumulatedMonths)
        ? currentMonth.numberOfDays
        : currentMonth.numberOfDays + accumulatedMonths.at(-1)!.cumulativeDays;
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
}

export function parseEnglishDate(englishDate: Date = new Date()) {
  const englishDateDayjs = dayjs(englishDate);
  const matchingCalendarPeriod = nepEngCalenderMaps.find((calendarPeriod) => {
    const startDate = new Date(calendarPeriod.startDate);
    const endDate = new Date(calendarPeriod.endDate);

    return +endDate >= +englishDate && +startDate <= +englishDate;
  });

  if (!matchingCalendarPeriod)
    throw new Error(
      `No corresponding Bikram Sambat date found for the English date ${englishDate.toISOString().split('T')[0]}.`
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
      `Unable to determine the Bikram Sambat month for the given English date ${englishDate.toISOString().split('T')[0]}.`
    );

  const previousBsMonth = bsMonthsWithCumulativeDays
    .filter((month) => month.cumulativeDays < daysSinceStartOfPeriod)
    .at(-1);

  const bikramSambatDate = {
    dayOfWeek: englishDateDayjs.day(),
    bsYear: matchingCalendarPeriod.nepYear,
    bsMonth: currentBsMonth.monthNumber,
    bsDay: previousBsMonth
      ? daysSinceStartOfPeriod - previousBsMonth.cumulativeDays
      : daysSinceStartOfPeriod,
    bsMonthName: currentBsMonth.monthName,
    engDate: englishDate,
  };

  return bikramSambatDate;
}

export function parseBikramSambatDate(bikramSambatDateString: string) {
  if (!/\d{4}-\d{2}-\d{2}/g.test(bikramSambatDateString))
    throw new Error(
      `Invalid date format: "${bikramSambatDateString}". Expected format is YYYY-MM-DD.`
    );
  const [bsYear, bsMonth, bsDay]: [number, number, number] =
    bikramSambatDateString.split('-').map((num) => parseInt(num)) as never;

  if (bsMonth < 1 || bsMonth > 12)
    throw new Error(
      `Invalid month: ${bsMonth}. Month must be between 1 and 12.`
    );

  const matchingCalendarPeriod = nepEngCalenderMaps.find(
    (calendarPeriod) => calendarPeriod.nepYear === bsYear
  );

  if (!matchingCalendarPeriod)
    throw new Error(
      `No corresponding data found for the Bikram Sambat year ${bsYear}.`
    );

  const startOfYearDate = new Date(matchingCalendarPeriod.startDate);

  const bsMonthsWithCumulativeDays = getMonthsWithCumulativeDays(bsYear);

  const currentMonthIndex = bsMonth - 1;
  const daysSinceStartOfYear =
    (bsMonth === 1
      ? 0
      : bsMonthsWithCumulativeDays[currentMonthIndex - 1]!.cumulativeDays) +
    bsDay;

  const englishDate = dayjs(startOfYearDate).add(
    daysSinceStartOfYear - 1,
    'days'
  );

  const bikramSambatDate = {
    dayOfWeek: englishDate.day(),
    bsYear,
    bsMonth,
    bsDay,
    bsMonthName: months[currentMonthIndex]!.nepName,
    engDate: englishDate.toDate(),
  };

  return bikramSambatDate;
}
