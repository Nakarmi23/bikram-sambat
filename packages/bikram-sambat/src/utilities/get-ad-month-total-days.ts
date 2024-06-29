import { isLeapYear } from './is-leap-year';

export const getADMonthTotalDays = (month: number, year: number): number => {
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
      return isLeapYear(year) ? 29 : 28;
    default:
      throw new Error(
        `Invalid date month: ${month}. Month should be between 1 and 12.`
      );
  }
};
