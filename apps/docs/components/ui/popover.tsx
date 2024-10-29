import { cn } from '@/lib/utils';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import React from 'react';
import { Code } from './code';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.PopoverTrigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverTrigger>
>(({ className, children, ...props }, ref) => (
  <div className='flex items-center gap-0.5 not-prose'>
    {children}
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn('p-1 hover:bg-gray-100/10 rounded-sm', className)}
      {...props}>
      <InfoCircledIcon />
    </PopoverPrimitive.Trigger>
  </div>
));

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        'rounded-md bg-background border shadow-lg p-3 max-w-80 text-sm text-gray-200/90',
        className
      )}
      {...props}>
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

export { Popover, PopoverContent, PopoverTrigger };
