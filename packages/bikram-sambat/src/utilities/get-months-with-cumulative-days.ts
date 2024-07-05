import { BikramSambat } from '..';

export const getMonthsWithCumulativeDays = (year: number) => {
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
