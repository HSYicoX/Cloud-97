// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(({
  className,
  hoverable = false,
  clickable = false,
  children,
  ...props
}, ref) => {
  return <ShadcnCard ref={ref} className={cn('bg-slate-800/40 backdrop-blur-md border-slate-700/50 transition-all duration-200', hoverable && 'hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-102', clickable && 'cursor-pointer active:scale-98', className)} {...props}>
      {children}
    </ShadcnCard>;
});
Card.displayName = 'Card';
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };