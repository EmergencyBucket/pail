'use client';

import Link from 'next/link';
import React from 'react';

interface Props {
    // eslint-disable-next-line
    onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
    children?: React.ReactNode;
    link?: string;
    className?: string;
}

const Button = ({ onClick, children, link, className }: Props) => {
    return (
        <>
            {link ? (
                <Link
                    href={link}
                    className={`bg-slate-800 text-white p-2 border-4 border-slate-700 hover:border-slate-500 ${className}`}
                >
                    {children}
                </Link>
            ) : (
                <button
                    onClick={onClick}
                    className={`bg-slate-800 text-white p-2 border-4 border-slate-700 hover:border-slate-500 focus:outline-none ${className}`}
                >
                    {children}
                </button>
            )}
        </>
    );
};

export default Button;
