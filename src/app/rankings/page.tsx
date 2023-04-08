import { Challenge, Solve, Team } from '@prisma/client';
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
                challenge.staticPoints
                    ? challenge.staticPoints
                    : challenge.solved.length > 150
                    ? 200
                    : 500 - challenge.solved.length * 2,
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
        solves: Solve[];
    }> = [];

    teams.forEach((team) => {
        rankings.push({
            label: team.name,
            id: team.id,
            data: [team.points ?? 0],
            backgroundColor: getColor(),
            solves: team.solves,
        });
    });

    rankings = rankings.sort((a, b) => {
        return b.data[0] - a.data[0];
    });

    const data: ChartData<'bar', number[], string> = {
        labels: [''],
        datasets: rankings.slice(0, 10) ?? [],
    };

    return (
        <>
            <div className="flex w-full">
                <div className="w-1/2">
                    {rankings &&
                        rankings.map((team, i) => (
                            <div key={Math.random()}>
                                <div
                                    className={`${
                                        user?.teamId && team.id == myTeam!.id
                                            ? 'bg-teal-700'
                                            : 'bg-slate-700'
                                    } m-1 text-center entry`}
                                >
                                    <code className="text-white text-lg">
                                        {i +
                                            1 +
                                            ' - ' +
                                            team.label +
                                            ' - ' +
                                            team.data[0]}
                                    </code>
                                </div>
                                <div id={team.id} className="hide">
                                    {team.solves &&
                                        team.solves.map((solve) => (
                                            <div
                                                key={Math.random()}
                                                className={`bg-indigo-700 m-1 text-center`}
                                            >
                                                <code className="text-white text-lg">
                                                    {
                                                        challenges.find(
                                                            (challenge) =>
                                                                challenge.id ==
                                                                solve.challengeId
                                                        )!.name
                                                    }
                                                </code>
                                            </div>
                                        ))}
                                </div>
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
