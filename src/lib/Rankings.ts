import { Challenge, Solve, Team } from '@prisma/client';
import prisma from './prismadb';
import { tidy, arrange, desc } from '@tidyjs/tidy';

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

    await Promise.all(
        challenges.map(async (challenge) => {
            challenge.points = await pointValue(challenge);
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

    await Promise.all(
        teams.map(async (team) => {
            team.points = await countPoints(team);
        })
    );

    teams = tidy(teams, arrange(desc('points')));

    return teams.map((team, i) => ({
        team: team,
        pos: i + 1,
    }));
}

export async function pointValue(
    challenge: Challenge & {
        solved?: Solve[];
    }
): Promise<number> {
    if (!challenge.solved) {
        challenge.solved = await prisma.solve.findMany({
            where: {
                challengeId: challenge.id,
            },
        });
    }

    return challenge.staticPoints
        ? challenge.staticPoints
        : challenge.solved.length > 150
        ? 200
        : 500 - challenge.solved.length * 2;
}

export async function countPoints(
    team: Team & {
        solves?: Solve[];
    }
): Promise<number> {
    if (!team.solves) {
        team.solves = await prisma.solve.findMany({
            where: {
                teamId: team.id,
            },
        });
    }

    let challenges = await Promise.all(
        team.solves.map((solve) =>
            prisma.challenge.findFirst({
                where: { id: solve.challengeId },
                include: { solved: true },
            })
        )
    );

    return (
        await Promise.all(challenges.map((challenge) => pointValue(challenge!)))
    ).reduce((a, b) => a + b);
}
