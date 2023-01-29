import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface Props {
    // eslint-disable-next-line
    onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
    children?: React.ReactNode;
    link?: string;
}

const Button = ({ onClick, children, link }: Props) => {
    return (
        <>
            {link ? (
                <Link
                    href={link}
                    className={clsx(
                        "inline-flex select-none items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                        "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
                        "hover:bg-gray-50",
                        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                        // Register all radix states
                        "group",
                        "radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900",
                        "radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
                        "radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50"
                      )}
                >
                    {children}
                </Link>
            ) : (
                <button
                    onClick={onClick}
                    className={clsx(
                        "inline-flex select-none items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                        "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
                        "hover:bg-gray-50",
                        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                        // Register all radix states
                        "group",
                        "radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900",
                        "radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
                        "radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50"
                      )}
                >
                    {children}
                </button>
            )}
        </>
    );
};

export default Button;
