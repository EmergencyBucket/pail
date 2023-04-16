import { Challenge, Solve, Team } from '@prisma/client';
import prisma from './prismadb';
import { tidy, mutate, asc, arrange } from '@tidyjs/tidy';

interface Ranking {
    team: Team & {
        solves: Solve[];
        points?: number;
    };
    pos: number;
}

export async function getRankings(): Promise<Ranking[]> {
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

    let teams: (Team & {
        solves: Solve[];
        points?: number;
    })[] = await prisma.team.findMany({
        include: {
            solves: true,
        },
    });

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
        }),
        arrange(asc('points'))
    );

    return teams.map((team, i) => ({
        team: team,
        pos: i + 1,
    }));
}
