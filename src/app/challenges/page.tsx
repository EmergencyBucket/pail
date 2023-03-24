import ChallengeContainer from '@/components/ChallengeContainer';
import { CTFStart } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';
import { Challenge, Solve } from '@prisma/client';
import { getServerSession } from 'next-auth';

export const metadata = {
    title: 'EBucket | Challenges',
};

function exclude<Challenge, Key extends keyof Challenge>(
    challenge: Challenge,
    keys: Key[]
): Omit<Challenge, Key> {
    for (let key of keys) {
        delete challenge[key];
    }
    return challenge;
}

export default async function Home() {
    if (await CTFStart()) {
        return (
            <code className="text-white text-2xl">
                This CTF has not started yet.
            </code>
        );
    }

    let session = await getServerSession();

    let user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email,
        },
    });

    let challenges: Partial<
        Challenge & {
            points: number;
            solved: Solve[];
        }
    >[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
    });

    challenges = challenges.filter((chall) => {
        let inc: boolean = true;
        chall.solved!.forEach((solve) => {
            if (solve.teamId === user?.teamId) {
                inc = false;
            }
        });
        return inc;
    });

    challenges.forEach((challenge) => {
        challenge.points = 500 - (challenge.solved?.length ?? 0) * 2;
    });

    let challengesWithoutSecrets = challenges.map((chall) =>
        exclude(chall, ['flag', 'solved'])
    );

    return (
        <div className="grid grid-cols-4 gap-4 mt-8">
            {challengesWithoutSecrets.map((challenge) => (
                <ChallengeContainer
                    key={Math.random()}
                    challenge={
                        challenge as Omit<
                            Challenge & {
                                points: number;
                            },
                            'flag'
                        >
                    }
                />
            ))}
        </div>
    );
}
