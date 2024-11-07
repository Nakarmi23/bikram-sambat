import { cn } from '@/lib/utils';
import * as React from 'react';

const Code = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { type?: 'primary' | 'secondary' }
>(({ className, type, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      type === 'primary'
        ? 'dark:bg-blue-700/30 dark:text-blue-100 bg-blue-700/10 text-blue-700'
        : 'dark:bg-gray-700/30 dark:text-gray-100 bg-gray-700/10 text-gray-700',
      'rounded-sm px-1 not-prose',
      className
    )}
    {...props}
  />
));
Code.displayName = 'Code';

export { Code };
