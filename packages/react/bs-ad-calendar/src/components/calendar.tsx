import { BikramSambat } from '@nakarmi23/bikram-sambat';
import dayjs from 'dayjs';
import {
  createContext,
  forwardRef,
  Fragment,
  type KeyboardEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { dayOfWeek, dayOfWeekMin, dayOfWeekShort } from '../utils/days-of-week';
import { sliceIntoChunks } from '../utils/slice-into-chunks';

type CalendarMode = 'AD' | 'BS';
type CalendarValue = BikramSambat | null;

interface CalendarBaseProps {
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
  isDisabled?: boolean;
  focusedValue: BikramSambat;
  onFocusChange: (date: BikramSambat) => void;
  value: CalendarValue;
  defaultValue?: CalendarValue;
  onChange: (date: CalendarValue) => void;
  // TODO: implement min and max value feature
  minValue?: CalendarValue;
  maxValue?: CalendarValue;
  isDateUnavailable?: (date: BikramSambat) => boolean;
  initialFocusDate: BikramSambat;
}

const CalendarContext = createContext<CalendarBaseProps>({} as never);

interface CalendarRootDivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  children?: React.ReactNode;
}

type CalendarRootProps = CalendarRootDivProps &
  Partial<Omit<CalendarBaseProps, 'initialFocusDate'>>;

const CalendarRoot = forwardRef<HTMLDivElement, CalendarRootProps>(
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
      [focusedValue]
    );
    const [internalMode, setInternalMode] = useState<CalendarMode>('BS');
    const [internalValue, setInternalValue] = useState<CalendarValue>(
      defaultValue ?? null
    );
    const [internalFocusedValue, setInternalFocusedValue] =
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
            onChange: onChange ? onChange : setInternalValue,
            maxValue,
            minValue,
            isDateUnavailable,
            focusedValue: focusedValue ?? internalFocusedValue,
            onFocusChange: onFocusChange
              ? onFocusChange
              : setInternalFocusedValue,
            initialFocusDate: defaultFocusedValue,
            mode: mode ?? internalMode,
            onModeChange: onModeChange ? onModeChange : setInternalMode,
          }}>
          {children}
        </CalendarContext.Provider>
      </div>
    );
  }
);

CalendarRoot.displayName = 'CalendarRoot';

type CalendarTypeButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children' | 'onClick'
>;

const CalendarTypeButton = forwardRef<
  HTMLButtonElement,
  CalendarTypeButtonProps
>(({ className = '', ...props }, ref) => {
  const { mode, onModeChange, initialFocusDate, onFocusChange } =
    useContext(CalendarContext);

  const onClickHandler = useCallback(() => {
    onModeChange(mode === 'BS' ? 'AD' : 'BS');
    onFocusChange(initialFocusDate);
  }, [initialFocusDate, mode, onFocusChange, onModeChange]);

  return (
    <button
      type='button'
      ref={ref}
      className={`nakarmi23-CalendarTypeButton ${className}`.trim()}
      onClick={onClickHandler}
      {...props}>
      {mode}
    </button>
  );
});
CalendarTypeButton.displayName = 'CalendarTypeButton';

type CalendarHeaderProps = React.ComponentPropsWithoutRef<'div'>;

const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
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

CalendarHeader.displayName = 'CalendarHeader';

interface CalendarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
  slot: 'prev' | 'next';
}

const CalendarButton = forwardRef<HTMLButtonElement, CalendarButtonProps>(
  ({ className = '', slot, ...props }, ref) => {
    const { onFocusChange, focusedValue, mode } = useContext(CalendarContext);

    const onClick = useCallback(() => {
      if (mode === 'BS') {
        const focusDate = focusedValue.startOf('month');
        if (slot === 'prev') {
          onFocusChange(focusDate.sub(1, 'month'));
        } else {
          onFocusChange(focusDate.add(1, 'month'));
        }
      } else {
        const currentFocusDate = dayjs(focusedValue.adDate).startOf('month');
        if (slot === 'prev') {
          onFocusChange(
            BikramSambat.fromAD(currentFocusDate.subtract(1, 'month').toDate())
          );
        } else {
          onFocusChange(
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

CalendarButton.displayName = 'CalendarButton';

interface CalendarHeadingProps
  extends Omit<React.ComponentPropsWithoutRef<'h2'>, 'children'> {
  children?: (currentFocusDate: BikramSambat) => React.ReactNode;
}

const CalendarHeading = forwardRef<HTMLHeadingElement, CalendarHeadingProps>(
  ({ className = '', children, ...props }, ref) => {
    const { focusedValue, mode } = useContext(CalendarContext);

    const defaultHeading = useMemo(() => {
      if (mode === 'BS') return focusedValue.format('MMMM, YYYY');

      const ad = dayjs(focusedValue.adDate);

      return ad.format('MMMM, YYYY');
    }, [focusedValue, mode]);

    return (
      <h2
        ref={ref}
        className={`nakarmi23-CalendarHeading ${className}`.trim()}
        aria-hidden='true'
        {...props}>
        {children?.(focusedValue) ?? defaultHeading}
      </h2>
    );
  }
);

CalendarHeading.displayName = 'CalendarHeading';

type CalendarGridProps = React.ComponentPropsWithoutRef<'table'>;

const CalendarGrid = forwardRef<HTMLTableElement, CalendarGridProps>(
  ({ className = '', ...props }, ref) => {
    const { focusedValue } = useContext(CalendarContext);
    return (
      <table
        {...props}
        ref={ref}
        className={`nakarmi23-CalendarGrid ${className}`.trim()}
        role='grid'
        aria-label={focusedValue.format('MMMM YYYY')}
      />
    );
  }
);

CalendarGrid.displayName = 'CalendarGrid';

interface CalendarGridHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'thead'>, 'children'> {
  dayOfWeekNameFormat?: 'min' | 'short' | 'full';
  children: (day: string) => React.ReactNode;
}

const CalendarGridHeader = forwardRef<
  HTMLTableSectionElement,
  CalendarGridHeaderProps
>(
  (
    { dayOfWeekNameFormat = 'min', className = '', children, ...props },
    ref
  ) => {
    const dayOfWeekNames = useMemo(() => {
      if (dayOfWeekNameFormat === 'min') return dayOfWeekMin;

      if (dayOfWeekNameFormat === 'short') return dayOfWeekShort;

      return dayOfWeek;
    }, [dayOfWeekNameFormat]);

    return (
      <thead
        {...props}
        ref={ref}
        className={`nakarmi23-CalendarGridHeader ${className}`.trim()}
        aria-hidden='true'>
        <tr>
          {dayOfWeekNames.map((day, dayNo) => (
            <Fragment key={`${dayNo.toString()}-${day}`}>
              {children(day)}
            </Fragment>
          ))}
        </tr>
      </thead>
    );
  }
);

CalendarGridHeader.displayName = 'CalendarGridHeader';

type CalendarGridHeaderCellProps = React.ComponentPropsWithoutRef<'th'>;

const CalendarGridHeaderCell = forwardRef<
  HTMLTableColElement,
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

CalendarGridHeaderCell.displayName = 'CalendarGridHeaderCell';

interface CalendarGridBodyProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'children'> {
  children: (day: BikramSambat) => React.ReactNode;
}

const CalendarGridBody = forwardRef<
  HTMLTableSectionElement,
  CalendarGridBodyProps
>(({ children, className = '', ...props }, ref) => {
  const { focusedValue, mode } = useContext(CalendarContext);
  const focusedMonth = useMemo(() => focusedValue.get('month'), [focusedValue]);

  const calendarDays = useMemo(() => {
    let startingDate: BikramSambat;
    let startingWeekDay: number;

    let totalDaysInMonth: number;

    let endingDate: BikramSambat;
    let endingWeekDay: number;

    if (mode === 'BS') {
      startingDate = focusedValue.startOf('month');
      startingWeekDay = startingDate.get('day');

      const focusedYear = focusedValue.get('year');

      totalDaysInMonth =
        BikramSambat.getBikramSambatMonths(focusedYear)[focusedMonth - 1]
          ?.numberOfDays ?? 0;

      endingDate = focusedValue.endOf('month');
      endingWeekDay = endingDate.get('day');
    } else {
      const focusedAd = dayjs(focusedValue.adDate);
      startingDate = BikramSambat.fromAD(focusedAd.startOf('month').toDate());
      startingWeekDay = startingDate.get('day');

      totalDaysInMonth = focusedAd.daysInMonth();

      endingDate = BikramSambat.fromAD(focusedAd.endOf('month').toDate());
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

    const splitDays = sliceIntoChunks(days, 7);

    if (splitDays.length > 6) splitDays.pop();

    return splitDays;
  }, [focusedValue, focusedMonth, mode]);

  return (
    <tbody
      {...props}
      ref={ref}
      className={`nakarmi23-CalendarGridBody ${className}`.trim()}>
      {calendarDays.map((week, weekNo) => (
        <tr key={`${weekNo.toString()}-${focusedMonth.toString()}`}>
          {week.map((day) => (
            <td
              role='gridcell'
              key={
                mode === 'BS'
                  ? `${focusedMonth.toString()}-${day.toString()}`
                  : `${focusedMonth.toString()}-${day.adDate.toString()}`
              }
              aria-disabled='true'>
              {children(day)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
});

CalendarGridBody.displayName = 'CalendarGridBody';

interface CalendarCellProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  date: BikramSambat;
  children?: (date: BikramSambat) => React.ReactNode;
}

const CalendarCell = forwardRef<HTMLDivElement, CalendarCellProps>(
  ({ date, className = '', children, ...props }, ref) => {
    const {
      value,
      onChange,
      focusedValue,
      isDateUnavailable,
      isDisabled: isParentDisabled = false,
      mode,
    } = useContext(CalendarContext);

    const isToday = useMemo(() => date.isSame(new Date()), [date]);

    const cellDataProps = useMemo(() => {
      const isUnavailable = isDateUnavailable?.(date) ?? false;
      const isSelected = value?.isSame(date);
      let isSameMonthAsFocused: boolean;

      if (mode === 'BS') {
        isSameMonthAsFocused = focusedValue.isSame(date, 'month');
      } else {
        const adFocusedValue = dayjs(focusedValue.adDate);
        isSameMonthAsFocused = adFocusedValue.isSame(date.adDate, 'month');
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
        cellProp.tabIndex = 0;
      }

      if (isSelected) {
        cellProp['data-selected'] = true;
      }

      return cellProp;
    }, [
      isDateUnavailable,
      date,
      value,
      mode,
      isToday,
      isParentDisabled,
      focusedValue,
    ]);

    const defaultDay = useMemo(() => {
      if (mode === 'BS') return date.format('D');
      return date.adDate.getDate();
    }, [mode, date]);

    const onClickProp = useMemo(() => {
      if (cellDataProps['data-disabled']) return undefined;

      return () => {
        onChange(cellDataProps['data-selected'] ? null : date);
      };
    }, [cellDataProps, date, onChange]);

    const onKeyDownProp = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClickProp) {
          onClickProp();
          event.preventDefault();
        }
      },
      [onClickProp]
    );

    return (
      <div
        ref={ref}
        tabIndex={isToday ? 0 : -1}
        role='button'
        {...props}
        {...cellDataProps}
        onClick={onClickProp}
        onKeyDown={onKeyDownProp}
        className={`nakarmi23-CalendarCell ${className}`.trim()}>
        {children?.(date) ?? defaultDay}
      </div>
    );
  }
);

CalendarCell.displayName = 'CalendarCell';

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
