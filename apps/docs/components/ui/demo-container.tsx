import { cn } from '@/lib/utils';
import * as React from 'react';

export const DemoContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border rounded-md min-h-[100px] py-12 px-6',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

DemoContainer.displayName = 'DemoContainer';
