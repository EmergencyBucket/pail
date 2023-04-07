import ChallengeContainer from '@/components/ChallengeContainer';
import { CTFStart, teamMember } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';
import { Category, Challenge, Difficulty, Solve } from '@prisma/client';
import { arrange, asc, tidy } from '@tidyjs/tidy';
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

export default async function Home({
    searchParams,
}: {
    searchParams: { search?: string; difficulty?: string; category?: string };
}) {
    if (await CTFStart()) {
        return (
            <code className="text-white text-2xl">
                This CTF has not started yet.
            </code>
        );
    }

    if (await teamMember()) {
        return (
            <code className="text-white text-2xl">
                Create a team to access this page.
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
            done: boolean;
        }
    >[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
        where: {
            name: {
                search: searchParams.search ? searchParams.search : undefined,
            },
            difficulty: (searchParams.difficulty as Difficulty)
                ? (searchParams.difficulty as Difficulty)
                : undefined,
            category: (searchParams.category as Category)
                ? (searchParams.category as Category)
                : undefined,
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

    challenges.forEach((challenge) => {
        challenge.points = Math.max(
            200,
            challenge.staticPoints
                ? challenge.staticPoints
                : 500 -
                      challenge.solved!.length *
                          (challenge.difficulty == Difficulty.EASY
                              ? 4
                              : challenge.difficulty == Difficulty.MEDIUM
                              ? 3
                              : 2)
        );
    });

    let challengesWithoutSecrets = challenges.map((chall) =>
        exclude(chall, ['flag', 'solved'])
    );

    challengesWithoutSecrets = tidy(challenges, arrange(asc('points')));

    return (
        <>
            <form method="GET" className="flex gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none text-white"
                    defaultValue={searchParams.search}
                />
                <select
                    defaultValue={searchParams.difficulty}
                    name="difficulty"
                    className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none text-white"
                >
                    <option value={''}>None</option>
                    <option value={'EASY'}>Easy</option>
                    <option value={'MEDIUM'}>Medium</option>
                    <option value={'HARD'}>Hard</option>
                </select>
                <select
                    defaultValue={searchParams.category}
                    name="category"
                    className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none text-white"
                >
                    <option value={''}>None</option>
                    <option value={'WEB'}>Web</option>
                    <option value={'CRYPTO'}>Crypto</option>
                    <option value={'REV'}>Rev</option>
                    <option value={'PWN'}>Pwn</option>
                    <option value={'MISC'}>Misc</option>
                </select>
                <input
                    type="submit"
                    className="bg-slate-800 cursor-pointer text-white my-2 p border-2 w-full border-slate-700 hover:border-slate-500"
                />
            </form>
            <p className="text-white text-3xl underline">Unsolved</p>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {challengesWithoutSecrets
                    .filter((c) => !c.done)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
                                        done: boolean;
                                    },
                                    'flag'
                                >
                            }
                        />
                    ))}
            </div>
            <p className="text-white text-3xl underline">Solved</p>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {challengesWithoutSecrets
                    .filter((c) => c.done)
                    .map((challenge) => (
                        <ChallengeContainer
                            key={Math.random()}
                            challenge={
                                challenge as Omit<
                                    Challenge & {
                                        points: number;
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
