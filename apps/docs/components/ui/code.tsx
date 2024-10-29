import { cn } from '@/lib/utils';
import * as React from 'react';

const Code = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { type?: 'primary' | 'secondary' }
>(({ className, type, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      type === 'primary' ? 'bg-blue-700/30' : 'bg-gray-700/30',
      'rounded-sm px-1 not-prose',
      className
    )}
    {...props}
  />
));

export { Code };
