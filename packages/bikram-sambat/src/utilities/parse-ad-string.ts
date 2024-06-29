import { getADMonthTotalDays } from './get-ad-month-total-days';

export const parseAdString = (date: string) => {
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

    const totalPossibleDays = getADMonthTotalDays(month, year);

    if (day < 1 || month > totalPossibleDays)
      throw new Error(
        `Invalid date day: ${day}. Day should be between 1 and ${totalPossibleDays} for month ${month}.`
      );

    return new Date(date);
  }

  throw new Error('Unable to parse AD string.');
};
