import { Challenge, Solve } from '@prisma/client';
import { ChartData, ChartOptions } from 'chart.js';
import { Graph } from '@/components/BarGraph';
import prisma from '@/lib/prismadb';
import { CTFStart, Middleware } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import { getRankings } from '@/lib/Rankings';
import { getTeam } from '@/lib/Utils';
import { StarIcon } from 'lucide-react';

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
    let middleware = await Middleware([CTFStart()]);
    if (middleware)
        return <Error reason={(await middleware.json())['Error']} />;

    let myTeam = await getTeam();

    let challenges: (Challenge & {
        solved: Solve[];
        points?: number;
    })[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
    });

    let rankings: Array<{
        label: string;
        id: string;
        data: number[];
        backgroundColor: string;
        solves: Solve[];
    }> = [];

    rankings = await (
        await getRankings()
    ).map((ranking) => ({
        label: ranking.team.name,
        id: ranking.team.id,
        data: [ranking.team.points ?? 0],
        backgroundColor: getColor(),
        solves: ranking.team.solves,
    }));

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
                                    className={`bg-slate-800 border border-slate-700 m-1 text-center entry rounded-lg flex`}
                                >
                                    <div className="mx-auto flex gap-4">
                                        {team.id === myTeam!.id && (
                                            <StarIcon className="text-yellow-500 my-auto" />
                                        )}
                                        <code className="text-white text-lg">
                                            {i +
                                                1 +
                                                ' - ' +
                                                team.label +
                                                ' - ' +
                                                team.data[0]}
                                        </code>
                                    </div>
                                </div>
                                <div id={team.id} className="hide">
                                    {team.solves &&
                                        team.solves.map((solve) => (
                                            <div
                                                key={Math.random()}
                                                className={`bg-indigo-900 m-1 text-center rounded-lg border border-indigo-700`}
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
