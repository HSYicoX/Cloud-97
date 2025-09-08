// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';

const Select = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};
const SelectContent = ({
  children,
  className
}) => {
  return <div className={cn("bg-background border rounded-md shadow-lg p-1", className)}>{children}</div>;
};
const SelectItem = ({
  children,
  value,
  className
}) => {
  return <div className={cn("px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer", className)}>{children}</div>;
};
const SelectTrigger = ({
  children,
  className
}) => {
  return <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>{children}</div>;
};
const SelectValue = ({
  placeholder
}) => {
  return <span className="text-muted-foreground">{placeholder}</span>;
};
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };