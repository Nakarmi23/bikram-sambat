import { describe, expect, test } from '@jest/globals';
import { BikramSambat } from '.';

describe('Bikram Sambat', () => {
  test('BS parse', () => {
    const date = BikramSambat.parse('2081-03-15');
    expect(date.bsDay).toBe(15);
    expect(date.bsMonth).toBe(3);
    expect(date.bsYear).toBe(2081);
    expect(date.weekDay).toBe(6);
    expect(date.adDate.toLocaleDateString()).toBe('6/29/2024');
  });

  test('BS out of range parse', () => {
    expect(() => BikramSambat.parse('2081-01-90')).toThrowError();
    expect(() => BikramSambat.parse('2081-12-31')).toThrowError();
    expect(() => BikramSambat.parse('2112-01-01')).toThrowError();
    expect(() => BikramSambat.parse('1969-01-01')).toThrowError();
  });

  test('AD parse', () => {
    const date = BikramSambat.fromAD('2024-06-29');
    expect(date.bsDay).toBe(15);
    expect(date.bsMonth).toBe(3);
    expect(date.bsYear).toBe(2081);
    expect(date.weekDay).toBe(6);
    expect(date.adDate.toLocaleDateString()).toBe('6/29/2024');

    const date2 = BikramSambat.fromAD(new Date('2024-06-29'));
    expect(date2.bsDay).toBe(15);
    expect(date2.bsMonth).toBe(3);
    expect(date2.bsYear).toBe(2081);
    expect(date.weekDay).toBe(6);
    expect(date2.adDate.toLocaleDateString()).toBe('6/29/2024');
  });

  test('AD out of range parse', () => {
    expect(() => BikramSambat.fromAD('1913-04-12')).toThrowError();
    expect(() => BikramSambat.fromAD(new Date('2055-04-15'))).toThrowError();
  });

  test('clone', () => {
    const date = BikramSambat.parse('2081-03-15');
    const dateClone = date.clone();

    expect(JSON.stringify(dateClone)).toBe(JSON.stringify(date));
    expect(dateClone).not.toBe(date);
  });

  test('Date format', () => {
    const date = BikramSambat.parse('2081-03-15');

    expect(date.format('MMMM, DD YYYY dddd')).toBe('Ashadh, 15 2081 Saturday');
    expect(date.format('MMMM MMM MM M')).toBe('Ashadh MMM 03 3');
    expect(date.format('dddd ddd dd d')).toBe('Saturday Sat Sa 6');
  });

  test('Date Manipulation: startOf', () => {
    const date = BikramSambat.parse('2081-03-13');
    const monthStartOf = date.startOf('month');

    expect(monthStartOf.bsDay).toBe(1);
    expect(monthStartOf.bsMonth).toBe(3);
    expect(monthStartOf.bsMonthName).toBe('Ashadh');
    expect(monthStartOf.weekDay).toBe(6);

    const yearStartOf = date.startOf('year');

    expect(yearStartOf.bsDay).toBe(1);
    expect(yearStartOf.bsMonth).toBe(1);
    expect(yearStartOf.bsMonthName).toBe('Baishakh');
    expect(yearStartOf.weekDay).toBe(6);
  });

  test('Date Manipulation: endOf', () => {
    const date = BikramSambat.parse('2081-03-13');
    const monthEndOf = date.endOf('month');

    expect(monthEndOf.bsDay).toBe(31);
    expect(monthEndOf.bsMonth).toBe(3);
    expect(monthEndOf.bsMonthName).toBe('Ashadh');
    expect(monthEndOf.weekDay).toBe(1);

    const yearEndOf = date.endOf('year');

    expect(yearEndOf.bsDay).toBe(30);
    expect(yearEndOf.bsMonth).toBe(12);
    expect(yearEndOf.bsMonthName).toBe('Chaitra');
    expect(yearEndOf.weekDay).toBe(0);
  });

  test('Date Manipulation: add', () => {
    const date = BikramSambat.parse('2081-03-25');

    const dayAddDate = date.add(11, 'day');
    expect(dayAddDate.bsDay).toBe(5);
    expect(dayAddDate.bsMonth).toBe(4);
    expect(dayAddDate.bsMonthName).toBe('Shrawan');
    expect(dayAddDate.bsYear).toBe(2081);
    expect(dayAddDate.weekDay).toBe(6);
    expect(dayAddDate.adDate.toLocaleDateString()).toBe('7/20/2024');

    const monthAddDate = dayAddDate.add(2, 'month');
    expect(monthAddDate.bsDay).toBe(4);
    expect(monthAddDate.bsMonth).toBe(6);
    expect(monthAddDate.bsMonthName).toBe('Ashwin');
    expect(monthAddDate.bsYear).toBe(2081);
    expect(monthAddDate.weekDay).toBe(5);
    expect(monthAddDate.adDate.toLocaleDateString()).toBe('9/20/2024');

    const yearAddDate = monthAddDate.add(2, 'year');
    expect(yearAddDate.bsDay).toBe(4);
    expect(yearAddDate.bsMonth).toBe(6);
    expect(yearAddDate.bsMonthName).toBe('Ashwin');
    expect(yearAddDate.bsYear).toBe(2083);
    expect(yearAddDate.weekDay).toBe(0);
    expect(yearAddDate.adDate.toLocaleDateString()).toBe('9/20/2026');
  });

  test('Date Manipulation: sub', () => {
    const date = BikramSambat.parse('2081-03-04');

    const daySubDate = date.sub(11, 'day');
    expect(daySubDate.bsDay).toBe(25);
    expect(daySubDate.bsMonth).toBe(2);
    expect(daySubDate.bsMonthName).toBe('Jestha');
    expect(daySubDate.bsYear).toBe(2081);
    expect(daySubDate.weekDay).toBe(5);
    expect(daySubDate.adDate.toLocaleDateString()).toBe('6/7/2024');

    const monthSubDate = daySubDate.sub(2, 'month');
    expect(monthSubDate.bsDay).toBe(25);
    expect(monthSubDate.bsMonth).toBe(12);
    expect(monthSubDate.bsMonthName).toBe('Chaitra');
    expect(monthSubDate.bsYear).toBe(2080);
    expect(monthSubDate.weekDay).toBe(0);
    expect(monthSubDate.adDate.toLocaleDateString()).toBe('4/7/2024');

    const yearSubDate = monthSubDate.sub(2, 'year');
    expect(yearSubDate.bsDay).toBe(24);
    expect(yearSubDate.bsMonth).toBe(12);
    expect(yearSubDate.bsMonthName).toBe('Chaitra');
    expect(yearSubDate.bsYear).toBe(2078);
    expect(yearSubDate.weekDay).toBe(4);
    expect(yearSubDate.adDate.toLocaleDateString()).toBe('4/7/2022');
  });

  test('Date Comparison: isSame', () => {
    const date = BikramSambat.parse('2081-03-16');
    const sameBsDate = BikramSambat.fromAD('2024-06-30');

    expect(date.isSame(sameBsDate)).toBeTruthy();

    const diffBsDate = BikramSambat.parse('2024-03-03');

    expect(date.isSame(diffBsDate)).toBeFalsy();

    const diffAdDate = new Date('2024-03-03');

    expect(date.isSame(diffAdDate)).toBeFalsy();

    expect(() => date.isSame('2024-03-03' as never)).toThrowError();
  });

  test('Date Comparison: isBefore', () => {
    const date = BikramSambat.parse('2081-03-16');

    const beforeDate = BikramSambat.parse('2081-03-03');

    expect(beforeDate.isBefore(date)).toBeTruthy();

    const afterDate = BikramSambat.parse('2081-03-19');

    expect(afterDate.isBefore(date)).toBeFalsy();

    expect(() => date.isBefore('2024-03-03' as never)).toThrowError();
  });

  test('Date Comparison: isAfter', () => {
    const date = BikramSambat.parse('2081-03-16');

    const afterDate = BikramSambat.parse('2081-03-19');

    expect(afterDate.isAfter(date)).toBeTruthy();

    const beforeDate = BikramSambat.parse('2081-03-03');

    expect(beforeDate.isAfter(date)).toBeFalsy();

    expect(() => date.isBefore('2024-03-03' as never)).toThrowError();
  });

  test('Date Getters: get, date, day, year, month', () => {
    const date = BikramSambat.fromAD('2024-07-04');

    expect(date.get('year')).toBe(2081);
    expect(date.get('date')).toBe(20);
    expect(date.get('month')).toBe(3);
    expect(date.get('day')).toBe(4);

    expect(date.year()).toBe(2081);
    expect(date.date()).toBe(20);
    expect(date.month()).toBe(3);
    expect(date.day()).toBe(4);
  });

  test('Date Setters: get, date, day, year, month', () => {
    const date = BikramSambat.fromAD('2024-07-04');

    const newYearSetDate = date.set('year', 2080);
    expect(newYearSetDate).toBeInstanceOf(BikramSambat);
    expect(newYearSetDate.format('YYYY-MM-DD')).toBe('2080-03-20');
    expect(newYearSetDate.adDate.toLocaleDateString()).toBe('7/5/2023');

    const newMonthSetDate = date.set('month', 2);
    expect(newMonthSetDate).toBeInstanceOf(BikramSambat);
    expect(newMonthSetDate.format('YYYY-MM-DD')).toBe('2081-02-20');
    expect(newMonthSetDate.adDate.toLocaleDateString()).toBe('6/2/2024');

    const newDateSetDate = date.set('date', 1);
    expect(newDateSetDate).toBeInstanceOf(BikramSambat);
    expect(newDateSetDate.format('YYYY-MM-DD')).toBe('2081-03-01');
    expect(newDateSetDate.adDate.toLocaleDateString()).toBe('6/15/2024');
    expect(newDateSetDate.set('date', -1).format('YYYY-MM-DD')).toBe(
      '2081-02-31'
    );
    expect(newDateSetDate.set('date', -1).adDate.toLocaleDateString()).toBe(
      '6/13/2024'
    );

    const newMonthDateExceedDate = date
      .set('month', 2)
      .set('date', 32)
      .set('month', 3);
    expect(newMonthDateExceedDate).toBeInstanceOf(BikramSambat);
    expect(newMonthDateExceedDate.format('YYYY-MM-DD')).toBe('2081-03-31');
    expect(newMonthDateExceedDate.adDate.toLocaleDateString()).toBe(
      '7/15/2024'
    );

    const newWeekDaySetDate = date.set('day', -10);
    expect(newWeekDaySetDate).toBeInstanceOf(BikramSambat);
    expect(newWeekDaySetDate.format('YYYY-MM-DD')).toBe('2081-03-06');
    expect(newWeekDaySetDate.adDate.toLocaleDateString()).toBe('6/20/2024');

  test('Date Between: isBetween', () => {
    const date = BikramSambat.parse('2081-03-16');

    const beginDate = BikramSambat.parse('2081-03-15');
    const endDate = BikramSambat.parse('2081-03-17');

    expect(date.isBetween(beginDate, endDate, 'day')).toBeTruthy();
    expect(beginDate.isBetween(date, endDate, 'day')).toBeFalsy();
    expect(endDate.isBetween(beginDate, date, 'day')).toBeFalsy();

    // case when beginDate is equal to date
    const beginDatec1 = BikramSambat.parse('2081-03-16');
    expect(date.isBetween(beginDatec1, endDate, 'day')).toBeTruthy();
    expect(date.isBetween(beginDatec1, endDate, 'day', '[)')).toBeFalsy();
    expect(beginDatec1.isBetween(date, endDate, 'day')).toBeTruthy();
    expect(endDate.isBetween(beginDatec1, date, 'day')).toBeFalsy();

    // case when endDate is equal to date
    const endDatec1 = BikramSambat.parse('2081-03-16');
    expect(date.isBetween(beginDate, endDatec1, 'day')).toBeTruthy();
    expect(date.isBetween(beginDate, endDatec1, 'day', '(]')).toBeFalsy();
    expect(beginDate.isBetween(date, endDatec1, 'day')).toBeFalsy();
    expect(endDatec1.isBetween(beginDate, date, 'day')).toBeTruthy();
    expect(() => endDatec1.isBetween('' as never, date, 'day')).toThrowError();
    expect(() =>
      endDatec1.isBetween(beginDate, '' as never, 'day')
    ).toThrowError();

    // testing the is between in between year

    const ydate = BikramSambat.parse('2081-03-16');

    const ybeginDate = BikramSambat.parse('2080-03-15');
    const yendDate = BikramSambat.parse('2082-03-17');

    expect(ydate.isBetween(ybeginDate, yendDate, 'year')).toBeTruthy();
    expect(ybeginDate.isBetween(ydate, yendDate, 'year')).toBeFalsy();
    expect(yendDate.isBetween(ybeginDate, ydate, 'year')).toBeFalsy();

    // case when beginDate is equal to date
    const ybeginDatec1 = BikramSambat.parse('2081-03-16');
    expect(ydate.isBetween(ybeginDatec1, yendDate, 'year')).toBeTruthy();
    expect(ydate.isBetween(ybeginDatec1, yendDate, 'year', '[)')).toBeFalsy();
    expect(ybeginDatec1.isBetween(ydate, yendDate, 'year')).toBeTruthy();
    expect(yendDate.isBetween(ybeginDatec1, ydate, 'year')).toBeFalsy();

    // case when endDate is equal to date
    const yendDatec1 = BikramSambat.parse('2081-03-16');
    expect(ydate.isBetween(ybeginDate, yendDatec1, 'year')).toBeTruthy();
    expect(ydate.isBetween(ybeginDate, yendDatec1, 'year', '(]')).toBeFalsy();
    expect(ydate.isBetween(ybeginDate, yendDatec1, 'year', '[]')).toBeFalsy();
    expect(ybeginDate.isBetween(ydate, yendDatec1, 'year')).toBeFalsy();
    expect(yendDatec1.isBetween(ybeginDate, ydate, 'year')).toBeTruthy();
    expect(() =>
      yendDatec1.isBetween('' as never, ydate, 'year')
    ).toThrowError();
    expect(() =>
      yendDatec1.isBetween(ybeginDate, '' as never, 'year')
    ).toThrowError();

    expect(() =>
      yendDatec1.isBetween('' as never, ydate, 'year', ')(' as never)
    ).toThrowError();

    expect(() =>
      yendDatec1.isBetween('' as never, ydate, 'year', 'abc' as never)
    ).toThrowError();

    expect(() =>
      yendDatec1.isBetween(ybeginDate, '' as never, 'year')
    ).toThrowError();

    expect(() =>
      yendDatec1.isBetween(ybeginDate, '' as never, 'no' as never)
    ).toThrowError();
  });
});
