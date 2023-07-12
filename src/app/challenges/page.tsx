import ChallengeContainer from '@/components/challenge/ChallengeContainer';
import { CTFStart, Middleware, teamMember } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';
import { Category, Challenge, Solve } from '@prisma/client';
import { arrange, asc, tidy } from '@tidyjs/tidy';
import { Error } from '@/components/Error';
import { countPoints, pointValue } from '@/lib/Rankings';
import { getTeam, getUser } from '@/lib/Utils';
import Image from 'next/image';

export const metadata = {
    title: 'EBucket | Challenges',
};

function exclude<Challenge, Key extends keyof Challenge>(
    challenge: Challenge,
    keys: Key[],
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

    let user = await getUser();

    let team = await getTeam();

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
                },
            );
        }),
    );

    let challengesWithoutSecrets = challenges.map((chall) =>
        exclude(chall, ['flag']),
    );

    challengesWithoutSecrets = tidy(challenges, arrange(asc('points')));

    return (
        <>
            <div className="grid grid-cols-4 text-center bg-slate-800 rounded-lg border border-slate-700 my-2 p-2 text-white text-2xl font-medium font-mono">
                <p className="border-r border-slate-700">
                    Solved:{' '}
                    {challengesWithoutSecrets.filter((c) => c.done).length}
                </p>
                <p className="border-r border-slate-700">
                    Unsolved:{' '}
                    {challengesWithoutSecrets.filter((c) => !c.done).length}
                </p>
                <p className="border-r border-slate-700">{team?.name}</p>
                <p className="flex mx-auto">
                    {await countPoints(team!)}&nbsp;
                    <Image
                        src={'/bucket.png'}
                        alt="Bucket Logo"
                        width={32}
                        height={32}
                    />{' '}
                </p>
            </div>
            <p className="text-white text-3xl font-bold font-mono">Web</p>
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
            <p className="text-white text-3xl font-bold font-mono">Crypto</p>
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
            <p className="text-white text-3xl font-bold font-mono">Rev</p>
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
            <p className="text-white text-3xl font-bold font-mono">Pwn</p>
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
            <p className="text-white text-3xl font-bold font-mono">Misc</p>
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
