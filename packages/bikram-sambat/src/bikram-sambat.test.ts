import { describe, expect, test } from '@jest/globals';
import BikramSambat from '.';

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
    expect(() => BikramSambat.parse('2081-01-90')).toThrow();
    expect(() => BikramSambat.parse('2081-12-31')).toThrow();
    expect(() => BikramSambat.parse('2112-01-01')).toThrow();
    expect(() => BikramSambat.parse('1969-01-01')).toThrow();
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
    expect(() => BikramSambat.fromAD('1913-04-12')).toThrow();
    expect(() => BikramSambat.fromAD(new Date('2055-04-15'))).toThrow();
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
});
