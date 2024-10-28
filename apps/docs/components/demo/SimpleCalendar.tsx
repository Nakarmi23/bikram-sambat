'use client';

import { Calendar } from '@nakarmi23/react-bs-ad-calendar';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export const SimpleCalendarDemo = () => {
  return (
    <Calendar.Root className='not-prose'>
      <Calendar.Header>
        <Calendar.Button slot='prev'>
          <ChevronLeftIcon />
        </Calendar.Button>
        <Calendar.Heading />
        <Calendar.TypeButton />
        <Calendar.Button slot='next'>
          <ChevronRightIcon />
        </Calendar.Button>
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {(date) => <Calendar.Cell date={date} />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
  );
};
