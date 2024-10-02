import React, { useContext, useMemo, useState } from 'react';
import BikramSambat from '../../../../bikram-sambat/dist';
import { sliceIntoChunks } from '../utils/slice-into-chunks';

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

type DateValue = BikramSambat | null;

interface CalendarBaseProps {
  isDisabled?: boolean;
  focusedValue?: DateValue;
  onFocusChange?: (date: DateValue) => void;
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (date: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: BikramSambat) => boolean;
}

const CalendarContext = React.createContext<CalendarBaseProps>({} as never);

interface CalendarRootProps extends CalendarBaseProps {
  children?: React.ReactNode;
}

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
}: CalendarRootProps) => {
  const [internalValue, onInternalChange] = useState<DateValue>(
    BikramSambat.now()
  );
  const [internalFocusedValue, onInternalFocusChange] = useState<DateValue>(
    BikramSambat.now()
  );
  return (
    <div>
      <CalendarContext.Provider
        value={{
          isDisabled,
          defaultValue,
          value: value ?? internalValue,
          onChange: internalValue ? onChange : onInternalChange,
          maxValue,
          minValue,
          isDateUnavailable,
          focusedValue: focusedValue ?? internalFocusedValue,
          onFocusChange: onFocusChange ? onFocusChange : onInternalFocusChange,
        }}>
        {children}
      </CalendarContext.Provider>
    </div>
  );
};

interface CalendarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
  slot: 'prev' | 'next';
}

const CalendarButton = (props: CalendarButtonProps) => {
  const { onFocusChange, focusedValue } = useContext(CalendarContext);

  const onClick = () => {
    if (props.slot === 'prev') {
      onFocusChange?.(focusedValue!.sub(1, 'month'));
    } else {
      onFocusChange?.(focusedValue!.add(1, 'month'));
    }
  };

  return (
    <button
      {...props}
      onClick={onClick}
    />
  );
};

const CalendarHeading = () => {
  const { focusedValue } = useContext(CalendarContext);
  return <span>{focusedValue!.format('MMMM, YYYY')}</span>;
};

interface CalendarGridProps extends React.ComponentPropsWithoutRef<'table'> {}

const CalendarGrid = (props: CalendarGridProps) => {
  return <table {...props} />;
};

interface CalendarGridHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'thead'>, 'children'> {
  dayOfWeekNameFormat?: 'min' | 'short' | 'full';
  children?: (day: string) => React.ReactNode;
}

const CalendarGridHeader = ({
  dayOfWeekNameFormat = 'min',
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
    <thead {...props}>
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

const CalendarGridHeaderCell = (props: CalendarGridHeaderCellProps) => {
  return <th {...props} />;
};

interface CalendarGridBodyProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'children'> {
  children?: (day: string | undefined) => React.ReactNode;
}

const CalendarGridBody = ({ children, ...props }: CalendarGridBodyProps) => {
  const { focusedValue } = useContext(CalendarContext);
  const focusedMonth = useMemo(
    () => focusedValue!.get('month'),
    [focusedValue]
  );

  const calendarDays = useMemo(() => {
    const startingWeekDay = focusedValue!.startOf('month').get('day');

    const focusedYear = focusedValue!.get('year');

    const totalDaysInMonth = BikramSambat.getBikramSambatMonths(focusedYear!)[
      focusedMonth! - 1
    ];

    const endingWeekDay = focusedValue!.endOf('month').get('day');

    const days: (undefined | string)[] = [
      ...(Array.from({ length: startingWeekDay! }) as never[]),
      ...(Array.from({ length: totalDaysInMonth!.numberOfDays }, (_, index) =>
        (index + 1).toString()
      ) as never[]),
      ...(Array.from({ length: 7 - (endingWeekDay! + 1) }) as never[]),
    ];

    const splitDays = sliceIntoChunks(days, 7);

    return splitDays;
  }, [focusedValue, focusedMonth]);

  return (
    <tbody {...props}>
      {calendarDays.map((week) => (
        <tr key={`${week}-${focusedMonth}`}>
          {week.map((day) => (
            <React.Fragment key={`${focusedMonth}-${day}`}>
              {children?.(day)}
            </React.Fragment>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

interface CalendarCellProps extends React.ComponentPropsWithoutRef<'td'> {}

const CalendarCell = (props: CalendarCellProps) => {
  return <td {...props} />;
};

export const Calendar = {
  Root: CalendarRoot,
  Heading: CalendarHeading,
  Button: CalendarButton,
  Grid: CalendarGrid,
  GridHeader: CalendarGridHeader,
  GridHeaderCell: CalendarGridHeaderCell,
  GridBody: CalendarGridBody,
  Cell: CalendarCell,
};
