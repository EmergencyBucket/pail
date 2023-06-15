'use client';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { bkct } from '@/lib/ClientUtils';
import Link from 'next/link';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
    {
        variants: {
            variant: {
                default:
                    'bg-slate-900 dark:hover:bg-slate-700 dark:hover:text-white text-white dark:bg-slate-50 dark:text-slate-900',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
                outline:
                    'bg-transparent border border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-100',
                subtle: 'hover:bg-slate-800 bg-slate-700 text-slate-100 border border-slate-700',
                ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
                link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-indigo-500 dark:text-indigo-400 hover:bg-transparent dark:hover:bg-transparent',
                unstyled: '',
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

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    link?: string;
    linkClassName?: string;
    target?: string;
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            linkClassName,
            target,
            variant,
            link,
            size,
            icon,
            children,
            ...props
        },
        ref
    ) => {
        if (link) {
            return (
                <Link href={link} className={linkClassName} target={target}>
                    <button
                        className={bkct(
                            buttonVariants({ variant, size, className })
                        )}
                        ref={ref}
                        {...props}
                    >
                        {icon && <span className="mr-2">{icon}</span>}
                        {children}
                    </button>
                </Link>
            );
        }

        return (
            <button
                className={bkct(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
