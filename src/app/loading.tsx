'use client';

import { Status, Statuses } from '@/components/Status';

export default function loading() {
    return (
        <Status
            status={Statuses.Loading}
            className="text-white mx-auto w-20 h-20"
        />
    );
}
