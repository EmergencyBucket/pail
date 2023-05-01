import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { bkct } from '@/lib/ClientUtils';

const inputVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400  disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
    {
        variants: {
            variant: {
                default:
                    'bg-slate-900 hover:bg-slate-950 dark:hover:bg-gray-200 text-white dark:bg-slate-50 dark:text-slate-900',
                outline:
                    'bg-transparent border border-slate-200 dark:border-slate-700 dark:text-slate-100 hover:bg-slate-950 dark:hover:bg-gray-900',
                subtle: 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100 hover:bg-slate-950 dark:hover:bg-gray-900',
                error: 'bg-slate-900 text-white dark:bg-slate-50 hover:bg-slate-950 dark:hover:bg-gray-200 dark:text-slate-900 ring-offset-2 ring ring-rose-500',
                success:
                    'bg-slate-900 text-white hover:bg-slate-950 dark:hover:bg-gray-200  dark:bg-slate-50 dark:text-slate-900 ring-offset-2 ring ring-emerald-500',
                disabled:
                    'bg-slate-50 text-white dark:bg-slate-900 dark:text-slate-900 ',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2 rounded-md',
                lg: 'h-11 px-8 rounded-md',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
//@ts-ignore
export interface InputProps
    extends VariantProps<typeof inputVariants>,
        React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, size, ...props }, ref) => {
        const isDisabled = variant === 'disabled';
        return (
            <input
                className={bkct(inputVariants({ variant, size, className }))}
                ref={ref}
                disabled={isDisabled}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input, inputVariants };
