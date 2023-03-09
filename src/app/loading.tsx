'use client';

import { Status, Statuses } from '@/components/Status';

export default function loading() {
    return <Status status={Statuses.Loading} />;
}
