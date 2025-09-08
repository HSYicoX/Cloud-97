// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';

// @ts-ignore;
import { Label } from './label';
// @ts-ignore;
import { Input } from './input';
// @ts-ignore;

const Form = ({
  children,
  ...props
}) => {
  return <form {...props}>{children}</form>;
};
const FormControl = ({
  children
}) => {
  return <div className="space-y-2">{children}</div>;
};
const FormDescription = ({
  children,
  className
}) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
};
const FormField = ({
  control,
  name,
  render
}) => {
  return render({
    field: {
      name,
      value: '',
      onChange: () => {},
      onBlur: () => {}
    }
  });
};
const FormItem = ({
  children,
  className
}) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};
const FormLabel = ({
  children,
  className
}) => {
  return <Label className={cn(className)}>{children}</Label>;
};
const FormMessage = ({
  children,
  className
}) => {
  return <p className={cn("text-sm font-medium text-destructive", className)}>{children}</p>;
};
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage };