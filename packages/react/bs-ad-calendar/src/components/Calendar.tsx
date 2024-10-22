import React, { useCallback, useContext, useMemo, useState } from 'react';
import { sliceIntoChunks } from '../utils/slice-into-chunks';
import BikramSambat from '@nakarmi23/bikram-sambat';
import '../styles/calendar-base-style.css';
import dayjs from 'dayjs';

const dayOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const dayOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayOfWeekMin = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CalendarType = 'AD' | 'BS';
type DateValue = BikramSambat | null;

interface CalendarBaseProps {
  type?: CalendarType;
  onTypeChange?: (type: CalendarType) => void;
  isDisabled?: boolean;
  focusedValue?: DateValue;
  onFocusChange?: (date: DateValue) => void;
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (date: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: BikramSambat) => boolean;
  initialFocusDate: DateValue;
}

const CalendarContext = React.createContext<CalendarBaseProps>({} as never);

interface CalendarRootDivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  children?: React.ReactNode;
}

type CalendarRootProps = CalendarRootDivProps &
  Omit<CalendarBaseProps, 'initialFocusDate'>;

const CalendarRoot = ({
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
  type,
  onTypeChange,
  ...props
}: CalendarRootProps) => {
  const defaultFocusedValue = useMemo(
    () => focusedValue?.clone() ?? BikramSambat.now(),
    []
  );
  const [internalType, onInternalTypeChange] = useState<CalendarType>('BS');
  const [internalValue, onInternalChange] = useState<DateValue>(
    BikramSambat.now()
  );
  const [internalFocusedValue, onInternalFocusChange] =
    useState<DateValue>(defaultFocusedValue);
  return (
    <div
      role='group'
      className={`nakarmi23-Calendar ${className}`.trim()}
      {...props}>
      <CalendarContext.Provider
        value={{
          isDisabled,
          defaultValue,
          value: value ?? internalValue,
          onChange: onChange ? onChange : onInternalChange,
          maxValue,
          minValue,
          isDateUnavailable,
          focusedValue: focusedValue ?? internalFocusedValue,
          onFocusChange: onFocusChange ? onFocusChange : onInternalFocusChange,
          initialFocusDate: defaultFocusedValue,
          type: type ?? internalType,
          onTypeChange: onTypeChange ? onTypeChange : onInternalTypeChange,
        }}>
        {children}
      </CalendarContext.Provider>
    </div>
  );
};

interface CalendarTypeButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'children' | 'onClick'
  > {}

const CalendarTypeButton = ({
  className = '',
  ...props
}: CalendarTypeButtonProps) => {
  const { type, onTypeChange, initialFocusDate, onFocusChange } =
    useContext(CalendarContext);

  return (
    <button
      {...props}
      className={`nakarmi23-CalendarTypeButton ${className}`.trim()}
      onClick={() => {
        onTypeChange?.(type === 'BS' ? 'AD' : 'BS');
        onFocusChange?.(initialFocusDate);
      }}>
      {type}
    </button>
  );
};

interface CalendarHeaderProp extends React.ComponentPropsWithoutRef<'div'> {}

const CalendarHeader = ({ className = '', ...props }: CalendarHeaderProp) => {
  return (
    <div
      {...props}
      className={`nakarmi23-CalendarHeader ${className}`.trim()}
    />
  );
};

interface CalendarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
  slot: 'prev' | 'next';
}

const CalendarButton = ({
  className = '',
  slot,
  ...props
}: CalendarButtonProps) => {
  const { onFocusChange, focusedValue, type } = useContext(CalendarContext);

  const onClick = useCallback(() => {
    if (type === 'BS') {
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
  }, [type, focusedValue, slot, onFocusChange]);

  return (
    <button
      {...props}
      className={`nakarmi23-CalendarButton ${className}`.trim()}
      slot={slot}
      type='button'
      aria-label={slot === 'prev' ? 'Previous' : 'Next'}
      onClick={onClick}
    />
  );
};

interface CalendarHeadingProps
  extends Omit<React.ComponentPropsWithoutRef<'h2'>, 'children'> {
  children?: (currentFocusDate: BikramSambat) => React.ReactNode;
}

const CalendarHeading = ({
  className = '',
  children,
  ...props
}: CalendarHeadingProps) => {
  const { focusedValue, type } = useContext(CalendarContext);

  const defaultHeading = useMemo(() => {
    if (type === 'BS') return focusedValue!.format('MMMM, YYYY');

    const ad = dayjs(focusedValue!.adDate);

    return ad.format('MMMM, YYYY');
  }, [focusedValue, type]);

  return (
    <h2
      {...props}
      className={`nakarmi23-CalendarHeading ${className}`.trim()}
      aria-hidden='true'>
      {children?.(focusedValue!) ?? defaultHeading}
    </h2>
  );
};

interface CalendarGridProps extends React.ComponentPropsWithoutRef<'table'> {}

const CalendarGrid = ({ className = '', ...props }: CalendarGridProps) => {
  const { focusedValue } = useContext(CalendarContext);
  return (
    <table
      {...props}
      className={`nakarmi23-CalendarGrid ${className}`.trim()}
      role='grid'
      aria-label={focusedValue?.format('MMMM YYYY')}
    />
  );
};

interface CalendarGridHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'thead'>, 'children'> {
  dayOfWeekNameFormat?: 'min' | 'short' | 'full';
  children?: (day: string) => React.ReactNode;
}

const CalendarGridHeader = ({
  dayOfWeekNameFormat = 'min',
  className = '',
  children,
  ...props
}: CalendarGridHeaderProps) => {
  const dayOfWeekNames =
    dayOfWeekNameFormat === 'min'
      ? dayOfWeekMin
      : dayOfWeekNameFormat === 'short'
        ? dayOfWeekShort
        : dayOfWeek;

  return (
    <thead
      {...props}
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
};

interface CalendarGridHeaderCellProps
  extends React.ComponentPropsWithoutRef<'th'> {}

const CalendarGridHeaderCell = ({
  className = '',
  ...props
}: CalendarGridHeaderCellProps) => {
  return (
    <th
      {...props}
      className={`nakarmi23-CalendarGridHeaderCell ${className}`.trim()}
    />
  );
};

interface CalendarGridBodyProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'children'> {
  children?: (day: BikramSambat) => React.ReactNode;
}

const CalendarGridBody = ({
  children,
  className = '',
  ...props
}: CalendarGridBodyProps) => {
  const { focusedValue, type } = useContext(CalendarContext);
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

    if (type === 'BS') {
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
  }, [focusedValue, focusedMonth, type]);

  return (
    <tbody
      {...props}
      className={`nakarmi23-CalendarGridBody ${className}`.trim()}>
      {calendarDays.map((week) => (
        <tr key={`${week}-${focusedMonth}`}>
          {week.map((day) => (
            <td
              role='gridcell'
              key={
                type === 'BS'
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
};

interface CalendarCellProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  date: BikramSambat;
  children?: (date: BikramSambat) => React.ReactNode;
}

const CalendarCell = ({
  date,
  className = '',
  children,
  ...props
}: CalendarCellProps) => {
  const {
    value,
    onChange,
    focusedValue,
    isDateUnavailable,
    isDisabled: isParentDisabled,
    type,
  } = useContext(CalendarContext);

  const cellDataProps = useMemo(() => {
    const isUnavailable = isDateUnavailable?.(date);
    const isSelected = value?.isSame(date);
    let isSameMonthAsFocused: boolean;
    let isToday: boolean;

    if (type === 'BS') {
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
  }, [focusedValue, date, value, isDateUnavailable, type]);

  const defaultDay = useMemo(() => {
    if (type === 'BS') return date.format('D');
    return date.adDate.getDate();
  }, [type, date]);

  return (
    <div
      role='button'
      {...props}
      {...cellDataProps}
      onClick={
        cellDataProps['data-disabled'] || cellDataProps['data-selected']
          ? undefined
          : () => onChange?.(date)
      }
      className={`nakarmi23-CalendarCell ${className}`.trim()}>
      {children?.(date) ?? defaultDay}
    </div>
  );
};

export const Calendar = {
  Root: CalendarRoot,
  Header: CalendarHeader,
  TypeButton: CalendarTypeButton,
  Heading: CalendarHeading,
  Button: CalendarButton,
  Grid: CalendarGrid,
  GridHeader: CalendarGridHeader,
  GridHeaderCell: CalendarGridHeaderCell,
  GridBody: CalendarGridBody,
  Cell: CalendarCell,
};