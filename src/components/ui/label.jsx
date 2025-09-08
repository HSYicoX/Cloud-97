// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';

// @ts-ignore;
import * as LabelPrimitive from '@radix-ui/react-label';
// @ts-ignore;

const labelVariants = () => "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const Label = React.forwardRef(({
  className,
  ...props
}, ref) => <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />);
Label.displayName = LabelPrimitive.Root.displayName;
export { Label };