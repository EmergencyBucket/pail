'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

enum Statuses {
    Unsubmitted,
    Loading,
    Correct,
    Incorrect,
}

interface Props {
    status: Statuses;
}

const Status = ({ status }: Props) => {
    switch (status) {
        case Statuses.Unsubmitted: {
            return <></>;
        }
        case Statuses.Loading: {
            return <Loader2 rotate={10} className="animate-spin" />;
        }
        case Statuses.Correct: {
            return <CheckIcon />;
        }
        case Statuses.Incorrect: {
            return <XIcon />;
        }
    }
};

export { Status, Statuses };
