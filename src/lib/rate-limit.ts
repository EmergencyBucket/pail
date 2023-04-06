import { NextResponse } from 'next/server';
import LRU from 'lru-cache';

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export default function rateLimit(options?: Options) {
    const tokenCache = new LRU({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: async function (limit: number, token: string) {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;

            let res = NextResponse.json(
                { error: 'Rate limit exceeded' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit + '',
                        'X-RateLimit-Remaining':
                            (isRateLimited ? 0 : limit - currentUsage) + '',
                    },
                }
            );

            return isRateLimited ? res : undefined;
        },
    };
}
