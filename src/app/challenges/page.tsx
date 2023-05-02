import ChallengeContainer from '@/components/challenge/ChallengeContainer';
import { CTFStart, Middleware, teamMember } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';
import { Category, Challenge, Solve } from '@prisma/client';
import { arrange, asc, tidy } from '@tidyjs/tidy';
import { getServerSession } from 'next-auth';
import { Error } from '@/components/Error';
import { pointValue } from '@/lib/Rankings';

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
    let middleware = await Middleware([CTFStart(), teamMember()]);
    if (middleware)
        return <Error reason={(await middleware.json())['Error']} />;

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
            done: boolean;
        }
    >[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
    });

    challenges.forEach((chall) => {
        let inc: boolean = true;
        chall.solved!.forEach((solve) => {
            if (solve.teamId === user?.teamId) {
                inc = false;
            }
        });
        chall.done = !inc;
    });

    await Promise.all(
        challenges.map(async (challenge) => {
            challenge.points = await pointValue(
                challenge as Challenge & {
                    solved?: Solve[];
                }
            );
        })
    );

    let challengesWithoutSecrets = challenges.map((chall) =>
        exclude(chall, ['flag'])
    );

    challengesWithoutSecrets = tidy(challenges, arrange(asc('points')));

    return (
        <>
            <p className="text-white text-4xl font-bold font-mono">Web</p>
            <div className="grid sm:grid-cols-4 gap-4 my-4">
                {challengesWithoutSecrets
                    .filter((c) => c.category == Category.WEB)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        solved: Solve[];
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
            <p className="text-white text-4xl font-bold font-mono">Crypto</p>
            <div className="grid sm:grid-cols-4 gap-4 my-4">
                {challengesWithoutSecrets
                    .filter((c) => c.category == Category.CRYPTO)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        solved: Solve[];
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
            <p className="text-white text-4xl font-bold font-mono">Rev</p>
            <div className="grid sm:grid-cols-4 gap-4 my-4">
                {challengesWithoutSecrets
                    .filter((c) => c.category == Category.REV)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        solved: Solve[];
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
            <p className="text-white text-4xl font-bold font-mono">Pwn</p>
            <div className="grid sm:grid-cols-4 gap-4 my-4">
                {challengesWithoutSecrets
                    .filter((c) => c.category == Category.PWN)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        solved: Solve[];
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
            <p className="text-white text-4xl font-bold font-mono">Misc</p>
            <div className="grid sm:grid-cols-4 gap-4 my-4">
                {challengesWithoutSecrets
                    .filter((c) => c.category == Category.MISC)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        solved: Solve[];
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
        </>
    );
}
