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
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        'rounded-md bg-background border shadow-lg p-3 max-w-80 text-sm dark:text-gray-200/90 text-gray-800',
        className
      )}
      {...props}>
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = 'PopoverContent';

interface SimplePopoverProps {
  children: React.ReactNode;
  content: () => React.ReactNode;
}

const SimplePopover = ({ children, content }: SimplePopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>{content()}</PopoverContent>
    </Popover>
  );
};

export { Popover, PopoverContent, PopoverTrigger, SimplePopover };
