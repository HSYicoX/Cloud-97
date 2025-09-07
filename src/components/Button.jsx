// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button as ShadcnButton } from '@/components/ui';
// @ts-ignore;
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  const baseStyles = 'transition-all duration-200 ease-in-out transform';
  const variants = {
    default: cn('bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:bg-blue-700 active:scale-95', 'hover:shadow-lg hover:shadow-blue-500/25', 'disabled:bg-slate-400 disabled:text-slate-200 disabled:scale-100 disabled:cursor-not-allowed'),
    outline: cn('border border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800 hover:text-white hover:border-slate-500', 'hover:scale-105 active:bg-slate-700 active:scale-95', 'disabled:border-slate-700 disabled:text-slate-500 disabled:scale-100 disabled:cursor-not-allowed'),
    ghost: cn('text-slate-300 hover:bg-slate-800 hover:text-white', 'hover:scale-105 active:bg-slate-700 active:scale-95', 'disabled:text-slate-500 disabled:scale-100 disabled:cursor-not-allowed'),
    destructive: cn('bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:bg-red-700 active:scale-95', 'hover:shadow-lg hover:shadow-red-500/25', 'disabled:bg-slate-400 disabled:text-slate-200 disabled:scale-100 disabled:cursor-not-allowed')
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  return <ShadcnButton ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          加载中...
        </div> : children}
    </ShadcnButton>;
});
Button.displayName = 'Button';