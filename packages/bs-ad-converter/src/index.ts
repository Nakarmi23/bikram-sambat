import dayjs from 'dayjs';
import { nepEngCalenderMaps } from './nepali-english-calender-maps';
import { nepDateNoOfDays } from './nepali-month-total-days';
import { isEmpty } from 'lodash';
import { months } from './nepali-english-month-name';

export function getBikramSambatMonthNoOfDays(year: number) {
  const selectedNepDate = nepDateNoOfDays.find((date) => date.nepYear === year);
  if (!selectedNepDate) throw new Error('Unable to get months for the year');
  return [
    { month: 1, monthName: months[0]!.nepName, noOfDays: selectedNepDate.m1 },
    { month: 2, monthName: months[1]!.nepName, noOfDays: selectedNepDate.m2 },
    { month: 3, monthName: months[2]!.nepName, noOfDays: selectedNepDate.m3 },
    { month: 4, monthName: months[3]!.nepName, noOfDays: selectedNepDate.m4 },
    { month: 5, monthName: months[4]!.nepName, noOfDays: selectedNepDate.m5 },
    { month: 6, monthName: months[5]!.nepName, noOfDays: selectedNepDate.m6 },
    { month: 7, monthName: months[6]!.nepName, noOfDays: selectedNepDate.m7 },
    { month: 8, monthName: months[7]!.nepName, noOfDays: selectedNepDate.m8 },
    { month: 9, monthName: months[8]!.nepName, noOfDays: selectedNepDate.m9 },
    { month: 10, monthName: months[9]!.nepName, noOfDays: selectedNepDate.m10 },
    {
      month: 11,
      monthName: months[10]!.nepName,
      noOfDays: selectedNepDate.m11,
    },
    {
      month: 12,
      monthName: months[11]!.nepName,
      noOfDays: selectedNepDate.m12,
    },
  ];
}
function getMonthsWithCumulativeDays(year: number) {
  return getBikramSambatMonthNoOfDays(year).reduce(
    (
      prev: {
        month: number;
        monthName: string;
        cumulativeDays: number;
      }[],
      curr
    ) => {
      if (isEmpty(prev))
        return [
          {
            month: curr.month,
            monthName: curr.monthName,
            cumulativeDays: curr.noOfDays,
          },
        ];
      return [
        ...prev,
        {
          month: curr.month,
          monthName: curr.monthName,
          cumulativeDays: curr.noOfDays + prev.at(-1)!.cumulativeDays,
        },
      ];
    },
    []
  );
}

export function parseEnglishDate(toParse: Date = new Date()) {
  const date = dayjs(toParse);
  const tempNepEngCalender = nepEngCalenderMaps.find((nepEng) => {
    const startDate = new Date(nepEng.startDate);
    const endDate = new Date(nepEng.endDate);

    return +endDate >= +toParse && +startDate <= +toParse;
  });

  if (!tempNepEngCalender) throw new Error('Unable to parse english date');

  const daysDiffFromStartDate =
    date.diff(tempNepEngCalender.startDate, 'days') + 1;

  const bsMonthsWithCumulativeDays = getMonthsWithCumulativeDays(
    tempNepEngCalender.nepYear
  );

  const bsMonth = [...bsMonthsWithCumulativeDays].find(
    (date) => date.cumulativeDays >= daysDiffFromStartDate
  );

  if (!bsMonth) throw new Error('Unable to parse english date');

  const bsPrevMonth = bsMonthsWithCumulativeDays
    .filter((date) => date.cumulativeDays < daysDiffFromStartDate)
    .at(-1);

  const dateTimeBS = {
    dayOfWeek: date.day(),
    bsYear: tempNepEngCalender.nepYear,
    bsMonth: bsMonth.month,
    bsDate: bsPrevMonth
      ? daysDiffFromStartDate - bsPrevMonth.cumulativeDays
      : daysDiffFromStartDate,
    bsMonthName: bsMonth.monthName,
    engDate: toParse,
  };

  return dateTimeBS;
}

export function parseBikramSambatDate(toParse: string) {
  if (!/\d{4}-\d{2}-\d{2}/g.test(toParse))
    throw new Error('Invalid date provided. Valid date pattern: YYYY-MM-DD');
  const [year, month, date]: [number, number, number] = toParse
    .split('-')
    .map((num) => parseInt(num)) as never;

  if (month > 12)
    throw new Error(
      'Invalid month. Month must be less than 12 and greater then 0.'
    );

  const matchingCalendarMap = nepEngCalenderMaps.find(
    (date) => date.nepYear === year
  );

  if (!matchingCalendarMap) throw new Error('Unable to parse date.');

  const startDateOfYear = new Date(matchingCalendarMap.startDate);

  const bsMonthsWithCumulativeDays = getMonthsWithCumulativeDays(year);

  const currentMonthIndex = month - 1;
  const daysDiffFromStartDate =
    (month === 1
      ? 0
      : bsMonthsWithCumulativeDays[currentMonthIndex - 1]!.cumulativeDays) +
    date; // get prev month cumulativeDays

  const engDate = dayjs(startDateOfYear).add(daysDiffFromStartDate - 1, 'days'); // diff date has to be subtracted by 1 because startDateOfYear represents the first day of the year. so not subtracting by 1 results in end dates of next day.

  const dateTimeBS = {
    dayOfWeek: engDate.day(),
    bsYear: year,
    bsMonth: month,
    bsDate: date,
    bsMonthName: months[currentMonthIndex]!.nepName,
    engDate: engDate.toDate(),
  };

  return dateTimeBS;
}
