
// @ts-ignore;
import { clsx } from 'clsx';
// @ts-ignore;
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
