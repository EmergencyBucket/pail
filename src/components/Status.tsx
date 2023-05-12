'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import React from 'react';

enum Statuses {
    Unsubmitted,
    Loading,
    Correct,
    Incorrect,
}

interface Props extends React.HTMLAttributes<HTMLElement> {
    status: Statuses;
}

const Status = ({ status, className }: Props) => {
    switch (status) {
        case Statuses.Unsubmitted: {
            return <></>;
        }
        case Statuses.Loading: {
            return (
                <Loader2 rotate={10} className={`animate-spin ${className}`} />
            );
        }
        case Statuses.Correct: {
            return <CheckIcon className={className} />;
        }
        case Statuses.Incorrect: {
            return <XIcon className={className} />;
        }
    }
};

export { Status, Statuses };
