import { Challenge, Solve } from '@prisma/client';
import prisma from '@/lib/prismadb';
import { CTFStart, Middleware } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import { getRankings, pointValue } from '@/lib/Rankings';
import { getTeam } from '@/lib/Utils';
import { StarIcon } from 'lucide-react';
import { Graph } from '@/components/BarGraph';

export const metadata = {
    title: 'EBucket | Rankings',
};

function getColor(num: number) {
    return `hsl(${num % 360}, 100%, 50%)`;
}

export default async function Home() {
    let middleware = await Middleware([CTFStart()]);
    if (middleware)
        return <Error reason={(await middleware.json())['Error']} />;

    let myTeam = await getTeam();

    let users = await prisma.user.findMany({
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

    challenges = await Promise.all(
        challenges.map(async (chall) => {
            chall.points = await pointValue(chall);
            return chall;
        }),
    );

    let rankings: Array<{
        label: string;
        id: string;
        data: number[];
        solves: Solve[];
    }> = [];

    rankings = await (
        await getRankings()
    ).map((ranking) => ({
        label: ranking.team.name,
        id: ranking.team.id,
        data: [ranking.team.points ?? 0],
        solves: ranking.team.solves,
    }));

    let top10 = rankings.slice(0, 9).map((ranking) => {
        let r: any = {};
        r.name = ranking.label;
        ranking.solves.forEach((solve) => {
            let chall = challenges.find((c) => c.id === solve.challengeId);
            r[chall!.name] = chall!.points;
            r[chall!.name + 'Color'] = getColor(chall!.points!);
        });
        return r;
    });

    console.log(top10);

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
                                        {myTeam && team.id === myTeam.id && (
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
                                                                solve.challengeId,
                                                        )!.name
                                                    }
                                                    &nbsp;-&nbsp;
                                                    {
                                                        users.find(
                                                            (user) =>
                                                                user.id ==
                                                                solve.userId,
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
                    <Graph
                        data={top10}
                        challengeNames={challenges.map((c) => c.name)}
                    />
                </div>
            </div>
        </>
    );
}
