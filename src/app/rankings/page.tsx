import { Challenge, Difficulty, Solve, Team } from '@prisma/client';
import { ChartData, ChartOptions } from 'chart.js';
import { tidy, mutate } from '@tidyjs/tidy';
import { Graph } from '@/components/Graph';
import prisma from '@/lib/prismadb';
import { CTFStart } from '@/lib/Middleware';
import { getServerSession } from 'next-auth';

export const metadata = {
    title: 'EBucket | Rankings',
};

const options: ChartOptions = {
    responsive: true,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    scales: {
        y: {
            grid: {
                color: '#FFFFFF',
            },
            title: {
                display: true,
                text: 'Points',
                color: 'white',
                font: {
                    size: 24,
                },
            },
        },
    },
};

function getColor() {
    return `rgba(${255 * Math.random()}, ${255 * Math.random()}, ${
        255 * Math.random()
    }, 0.25)`;
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

    let myTeam = await prisma.team.findFirst({
        where: {
            id: user?.teamId ?? undefined,
        },
    });

    let teams: (Team & {
        solves: Solve[];
        points?: number;
    })[] = await prisma.team.findMany({
        include: {
            solves: true,
        },
    });

    let challenges: (Challenge & {
        solved: Solve[];
        points?: number;
    })[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
    });

    challenges = tidy(
        challenges,
        mutate({
            points: (
                challenge: Challenge & {
                    solved: Solve[];
                }
            ) =>
                Math.max(
                    200,
                    challenge.staticPoints
                        ? challenge.staticPoints
                        : 500 -
                              challenge.solved.length *
                                  (challenge.difficulty == Difficulty.EASY
                                      ? 4
                                      : challenge.difficulty ==
                                        Difficulty.MEDIUM
                                      ? 3
                                      : 2)
                ),
        })
    );

    teams = tidy(
        teams,
        mutate({
            points: (
                team: Team & {
                    solves: Solve[];
                    points?: number;
                }
            ) => {
                let points = 0;
                team.solves.forEach((solve) => {
                    points += challenges.find(
                        (challenge) => challenge.id == solve.challengeId
                    )?.points as number;
                });
                return points;
            },
        })
    );

    let rankings: Array<{
        label: string;
        id: string;
        data: number[];
        backgroundColor: string;
    }> = [];

    teams.forEach((team) => {
        rankings.push({
            label: team.name,
            id: team.id,
            data: [team.points ?? 0],
            backgroundColor: getColor(),
        });
    });

    rankings = rankings.sort((a, b) => {
        return a.data[0] - b.data[0];
    });

    const data: ChartData<'bar', number[], string> = {
        labels: [''],
        datasets: rankings ?? [],
    };

    return (
        <>
            <div className="flex w-full">
                <div className="w-1/2">
                    {rankings &&
                        rankings.map((team) => (
                            <div
                                key={Math.random()}
                                className={`${
                                    user?.teamId && team.id == myTeam!.id
                                        ? 'bg-teal-700'
                                        : 'bg-slate-700'
                                } m-1 text-center`}
                            >
                                <code className="text-white text-lg">
                                    {team.label + ' - ' + team.data[0]}
                                </code>
                            </div>
                        ))}
                </div>
                <div className="w-1/2">
                    <Graph options={options} data={data} />
                </div>
            </div>
        </>
    );
}
