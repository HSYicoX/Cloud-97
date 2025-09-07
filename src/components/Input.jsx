// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Input as ShadcnInput } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({
  className,
  error,
  success,
  disabled = false,
  ...props
}, ref) => {
  return <ShadcnInput ref={ref} className={cn('bg-slate-700/50 border-slate-600 text-white transition-all duration-200', 'hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20', error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20', success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20', disabled && 'opacity-50 cursor-not-allowed', className)} disabled={disabled} {...props} />;
});
Input.displayName = 'Input';