import { BikramSambat } from '..';

export const getBSMonthTotalDays = (bsMonth: number, bsYear: number) => {
  const months = BikramSambat.getBikramSambatMonths(bsYear);

  const bsMonthIndex = bsMonth - 1;

  return months.at(bsMonthIndex)!.numberOfDays;
};
