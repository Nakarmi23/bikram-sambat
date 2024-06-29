import dayjs from 'dayjs';
import { nepEngCalenderMaps } from '../constraints/nepali-english-calender-maps';
import { getBSMonthTotalDays } from './get-bs-month-total-days';
import { getMonthsWithCumulativeDays } from './get-months-with-cumulative-days';

export const adDateFromBS = (
  bsYear: number,
  bsMonth: number,
  bsDay: number
) => {
  const matchingCalendarPeriod = nepEngCalenderMaps.find(
    (calendarPeriod) => calendarPeriod.nepYear === bsYear
  );

  if (!matchingCalendarPeriod)
    throw new Error(
      `No corresponding data found for the Bikram Sambat year ${bsYear}.`
    );

  const totalPossibleDays = getBSMonthTotalDays(bsMonth, bsYear);

  if (bsDay < 1 || bsDay > totalPossibleDays)
    throw new Error(
      `Invalid date day: ${bsDay}. Day should be between 1 and ${totalPossibleDays} for month ${bsMonth}.`
    );

  const startOfYearDate = new Date(matchingCalendarPeriod.startDate);

  const bsMonthsWithCumulativeDays = getMonthsWithCumulativeDays(bsYear);

  const currentMonthIndex = bsMonth - 1;
  const daysSinceStartOfYear =
    (bsMonth === 1
      ? 0
      : bsMonthsWithCumulativeDays[currentMonthIndex - 1]!.cumulativeDays) +
    bsDay;

  return dayjs(startOfYearDate).add(daysSinceStartOfYear - 1, 'days');
};
