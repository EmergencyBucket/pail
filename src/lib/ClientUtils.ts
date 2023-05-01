import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function bkct(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
