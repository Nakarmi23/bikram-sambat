import React, { useCallback, useContext, useMemo, useState } from 'react';
import { sliceIntoChunks } from '../utils/slice-into-chunks';
import BikramSambat from '@nakarmi23/bikram-sambat';
import dayjs from 'dayjs';
import { dayOfWeekMin, dayOfWeekShort, dayOfWeek } from '../utils/days-of-week';

type CalendarMode = 'AD' | 'BS';
type CalendarValue = BikramSambat | null;

interface CalendarBaseProps {
  mode?: CalendarMode;
  onModeChange?: (mode: CalendarMode) => void;
  isDisabled?: boolean;
  focusedValue?: BikramSambat;
  onFocusChange?: (date: BikramSambat) => void;
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onChange?: (date: CalendarValue) => void;
  // TODO: implement min and max value feature
  minValue?: CalendarValue;
  maxValue?: CalendarValue;
  isDateUnavailable?: (date: BikramSambat) => boolean;
  initialFocusDate: BikramSambat;
}

const CalendarContext = React.createContext<CalendarBaseProps>({} as never);

interface CalendarRootDivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  children?: React.ReactNode;
}

type CalendarRootProps = CalendarRootDivProps &
  Omit<CalendarBaseProps, 'initialFocusDate'>;

const CalendarRoot = React.forwardRef<HTMLDivElement, CalendarRootProps>(
  (
    {
      children,
      isDisabled,
      value,
      defaultValue,
      onChange,
      maxValue,
      minValue,
      isDateUnavailable,
      focusedValue,
      onFocusChange,
      className = '',
      mode,
      onModeChange,
      ...props
    },
    ref
  ) => {
    const defaultFocusedValue = useMemo(
      () => focusedValue?.clone() ?? BikramSambat.now(),
      []
    );
    const [internalMode, onInternalModeChange] = useState<CalendarMode>('BS');
    const [internalValue, onInternalChange] = useState<CalendarValue>(
      defaultValue === undefined ? null : defaultValue
    );
    const [internalFocusedValue, onInternalFocusChange] =
      useState<BikramSambat>(defaultFocusedValue);
    return (
      <div
        ref={ref}
        role='group'
        className={`nakarmi23-Calendar ${className}`.trim()}
        {...props}>
        <CalendarContext.Provider
          value={{
            isDisabled,
            defaultValue,
            value: value === undefined ? internalValue : value,
            onChange: onChange ? onChange : onInternalChange,
            maxValue,
            minValue,
            isDateUnavailable,
            focusedValue: focusedValue ?? internalFocusedValue,
            onFocusChange: onFocusChange
              ? onFocusChange
              : onInternalFocusChange,
            initialFocusDate: defaultFocusedValue,
            mode: mode ?? internalMode,
            onModeChange: onModeChange ? onModeChange : onInternalModeChange,
          }}>
          {children}
        </CalendarContext.Provider>
      </div>
    );
  }
);

interface CalendarTypeButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'children' | 'onClick'
  > {}

const CalendarTypeButton = React.forwardRef<
  HTMLButtonElement,
  CalendarTypeButtonProps
>(({ className = '', ...props }, ref) => {
  const { mode, onModeChange, initialFocusDate, onFocusChange } =
    useContext(CalendarContext);

  const onClickHandler = useCallback(() => {
    onModeChange?.(mode === 'BS' ? 'AD' : 'BS');
    onFocusChange?.(initialFocusDate);
  }, []);

  return (
    <button
      ref={ref}
      className={`nakarmi23-CalendarTypeButton ${className}`.trim()}
      onClick={onClickHandler}
      {...props}>
      {mode}
    </button>
  );
});

interface CalendarHeaderProps extends React.ComponentPropsWithoutRef<'div'> {}

const CalendarHeader = React.forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`nakarmi23-CalendarHeader ${className}`.trim()}
        {...props}
      />
    );
  }
);

interface CalendarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
  slot: 'prev' | 'next';
}

const CalendarButton = React.forwardRef<HTMLButtonElement, CalendarButtonProps>(
  ({ className = '', slot, ...props }, ref) => {
    const { onFocusChange, focusedValue, mode } = useContext(CalendarContext);

    const onClick = useCallback(() => {
      if (mode === 'BS') {
        const focusDate = focusedValue!.startOf('month');
        if (slot === 'prev') {
          onFocusChange?.(focusDate.sub(1, 'month'));
        } else {
          onFocusChange?.(focusDate.add(1, 'month'));
        }
      } else {
        const currentFocusDate = dayjs(focusedValue!.adDate).startOf('month');
        if (slot === 'prev') {
          onFocusChange?.(
            BikramSambat.fromAD(currentFocusDate.subtract(1, 'month').toDate())
          );
        } else {
          onFocusChange?.(
            BikramSambat.fromAD(currentFocusDate.add(1, 'month').toDate())
          );
        }
      }
    }, [mode, focusedValue, slot, onFocusChange]);

    return (
      <button
        {...props}
        ref={ref}
        className={`nakarmi23-CalendarButton ${className}`.trim()}
        slot={slot}
        type='button'
        aria-label={slot === 'prev' ? 'Previous' : 'Next'}
        onClick={onClick}
      />
    );
  }
);

interface CalendarHeadingProps
  extends Omit<React.ComponentPropsWithoutRef<'h2'>, 'children'> {
  children?: (currentFocusDate: BikramSambat) => React.ReactNode;
}

const CalendarHeading = React.forwardRef<
  HTMLHeadingElement,
  CalendarHeadingProps
>(({ className = '', children, ...props }, ref) => {
  const { focusedValue, mode } = useContext(CalendarContext);

  const defaultHeading = useMemo(() => {
    if (mode === 'BS') return focusedValue!.format('MMMM, YYYY');

    const ad = dayjs(focusedValue!.adDate);

    return ad.format('MMMM, YYYY');
  }, [focusedValue, mode]);

  return (
    <h2
      ref={ref}
      className={`nakarmi23-CalendarHeading ${className}`.trim()}
      aria-hidden='true'
      {...props}>
      {children?.(focusedValue!) ?? defaultHeading}
    </h2>
  );
});

interface CalendarGridProps extends React.ComponentPropsWithoutRef<'table'> {}

const CalendarGrid = React.forwardRef<HTMLTableElement, CalendarGridProps>(
  ({ className = '', ...props }, ref) => {
    const { focusedValue } = useContext(CalendarContext);
    return (
      <table
        {...props}
        ref={ref}
        className={`nakarmi23-CalendarGrid ${className}`.trim()}
        role='grid'
        aria-label={focusedValue?.format('MMMM YYYY')}
      />
    );
  }
);

interface CalendarGridHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'thead'>, 'children'> {
  dayOfWeekNameFormat?: 'min' | 'short' | 'full';
  children?: (day: string) => React.ReactNode;
}

const CalendarGridHeader = React.forwardRef<
  HTMLTableSectionElement,
  CalendarGridHeaderProps
>(
  (
    { dayOfWeekNameFormat = 'min', className = '', children, ...props },
    ref
  ) => {
    const dayOfWeekNames =
      dayOfWeekNameFormat === 'min'
        ? dayOfWeekMin
        : dayOfWeekNameFormat === 'short'
          ? dayOfWeekShort
          : dayOfWeek;

    return (
      <thead
        {...props}
        ref={ref}
        className={`nakarmi23-CalendarGridHeader ${className}`.trim()}
        aria-hidden='true'>
        <tr>
          {dayOfWeekNames.map((day, index) => (
            <React.Fragment key={`${index}-${day}`}>
              {children?.(day)}
            </React.Fragment>
          ))}
        </tr>
      </thead>
    );
  }
);

interface CalendarGridHeaderCellProps
  extends React.ComponentPropsWithoutRef<'th'> {}

const CalendarGridHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  CalendarGridHeaderCellProps
>(({ className = '', ...props }, ref) => {
  return (
    <th
      {...props}
      ref={ref}
      className={`nakarmi23-CalendarGridHeaderCell ${className}`.trim()}
    />
  );
});

interface CalendarGridBodyProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'children'> {
  children?: (day: BikramSambat) => React.ReactNode;
}

const CalendarGridBody = React.forwardRef<
  HTMLTableSectionElement,
  CalendarGridBodyProps
>(({ children, className = '', ...props }, ref) => {
  const { focusedValue, mode } = useContext(CalendarContext);
  const focusedMonth = useMemo(
    () => focusedValue!.get('month'),
    [focusedValue]
  );

  const calendarDays = useMemo(() => {
    let startingDate: BikramSambat;
    let startingWeekDay: number;

    let totalDaysInMonth: number;

    let endingDate: BikramSambat;
    let endingWeekDay: number;

    if (mode === 'BS') {
      startingDate = focusedValue!.startOf('month');
      startingWeekDay = startingDate.get('day');

      const focusedYear = focusedValue!.get('year');

      totalDaysInMonth = BikramSambat.getBikramSambatMonths(focusedYear!)[
        focusedMonth! - 1
      ]?.numberOfDays!;

      endingDate = focusedValue!.endOf('month');
      endingWeekDay = endingDate.get('day');
    } else {
      const focusedAd = dayjs(focusedValue!.adDate);
      startingDate = BikramSambat.fromAD(focusedAd!.startOf('month').toDate());
      startingWeekDay = startingDate.get('day');

      totalDaysInMonth = focusedAd.daysInMonth();

      endingDate = BikramSambat.fromAD(focusedAd!.endOf('month').toDate());
      endingWeekDay = endingDate.get('day');
    }

    const days = [
      ...Array.from({ length: startingWeekDay }, (_, index) =>
        startingDate.sub(index + 1)
      ).reverse(),
      ...Array.from({ length: totalDaysInMonth }, (_, index) =>
        startingDate.add(index)
      ),
      ...Array.from({ length: 7 - (endingWeekDay + 1) + 7 }, (_, index) =>
        endingDate.add(index + 1)
      ),
    ];

    let splitDays = sliceIntoChunks(days, 7);

    if (splitDays.length > 6) splitDays.pop();

    return splitDays;
  }, [focusedValue, focusedMonth, mode]);

  return (
    <tbody
      {...props}
      ref={ref}
      className={`nakarmi23-CalendarGridBody ${className}`.trim()}>
      {calendarDays.map((week) => (
        <tr key={`${week}-${focusedMonth}`}>
          {week.map((day) => (
            <td
              role='gridcell'
              key={
                mode === 'BS'
                  ? `${focusedMonth}-${day}`
                  : `${focusedMonth}-${day.adDate}`
              }
              aria-disabled='true'>
              {children?.(day)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
});

interface CalendarCellProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  date: BikramSambat;
  children?: (date: BikramSambat) => React.ReactNode;
}

const CalendarCell = React.forwardRef<HTMLDivElement, CalendarCellProps>(
  ({ date, className = '', children, ...props }, ref) => {
    const {
      value,
      onChange,
      focusedValue,
      isDateUnavailable,
      isDisabled: isParentDisabled,
      mode,
    } = useContext(CalendarContext);

    const cellDataProps = useMemo(() => {
      const isUnavailable = isDateUnavailable?.(date);
      const isSelected = value?.isSame(date);
      let isSameMonthAsFocused: boolean;
      let isToday: boolean;

      if (mode === 'BS') {
        isSameMonthAsFocused = focusedValue!.isSame(date, 'month');
        isToday = date.isSame(new Date());
      } else {
        const adFocusedValue = dayjs(focusedValue!.adDate);
        isSameMonthAsFocused = adFocusedValue?.isSame(date.adDate, 'month');
        isToday = date.isSame(new Date());
      }
      const cellProp: Record<string, unknown> = {
        tabIndex: -1,
        'aria-label':
          (isToday ? 'Today, ' : '') +
          date.format(`dddd, MMMM DD, YYYY`) +
          (isSelected ? ' selected' : ''),
      };

      if (isParentDisabled || isUnavailable || !isSameMonthAsFocused) {
        cellProp['data-disabled'] = true;
        cellProp['aria-disabled'] = true;
      }

      if (isUnavailable) cellProp['data-unavailable'] = true;

      if (!isSameMonthAsFocused) cellProp['data-outside-month'] = true;

      if (isToday) {
        cellProp['data-today'] = true;
        cellProp['tabIndex'] = 0;
      }

      if (isSelected) {
        cellProp['data-selected'] = true;
      }

      return cellProp;
    }, [focusedValue, date, value, isDateUnavailable, mode]);

    const defaultDay = useMemo(() => {
      if (mode === 'BS') return date.format('D');
      return date.adDate.getDate();
    }, [mode, date]);

    const onClickProp = useMemo(() => {
      if (cellDataProps['data-disabled']) return undefined;

      return () => onChange?.(cellDataProps['data-selected'] ? null : date);
    }, [
      cellDataProps['data-disabled'],
      cellDataProps['data-selected'],
      onChange,
    ]);

    return (
      <div
        ref={ref}
        role='button'
        {...props}
        {...cellDataProps}
        onClick={onClickProp}
        className={`nakarmi23-CalendarCell ${className}`.trim()}>
        {children?.(date) ?? defaultDay}
      </div>
    );
  }
);

export const Root = CalendarRoot;
export const Header = CalendarHeader;
export const TypeButton = CalendarTypeButton;
export const Heading = CalendarHeading;
export const Button = CalendarButton;
export const Grid = CalendarGrid;
export const GridHeader = CalendarGridHeader;
export const GridHeaderCell = CalendarGridHeaderCell;
export const GridBody = CalendarGridBody;
export const Cell = CalendarCell;

export type RootProps = CalendarRootProps;
export type HeaderProps = CalendarHeaderProps;
export type TypeButtonProps = CalendarTypeButtonProps;
export type HeadingProps = CalendarHeadingProps;
export type ButtonProps = CalendarButtonProps;
export type GridProps = CalendarGridProps;
export type GridHeaderProps = CalendarGridHeaderProps;
export type GridHeaderCellProps = CalendarGridHeaderCellProps;
export type GridBodyProps = CalendarGridBodyProps;
export type CellProps = CalendarCellProps;
export type Mode = CalendarMode;
export type Value = CalendarValue;
