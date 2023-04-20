import { Challenge, Solve, Team } from '@prisma/client';
import prisma from './prismadb';
import { tidy, arrange, desc } from '@tidyjs/tidy';
import { logger } from './Logger';

interface Ranking {
    team: Team & {
        solves: Solve[];
        points?: number;
    };
    pos: number;
}

/**
 * Gets ranking for all teams
 * @returns Rankings for all teams in the @interface Ranking
 */
export async function getRankings(): Promise<Ranking[]> {
    logger.info(`Started team data collection.`);

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

    logger.info(`Ended team data collection.`);

    await Promise.all(
        teams.map(async (team) => {
            team.points = await countPoints(team, challenges);
        })
    );

    teams = tidy(teams, arrange(desc('points')));

    return teams.map((team, i) => ({
        team: team,
        pos: i + 1,
    }));
}

/**
 * Calculates the point value of a challenge
 * @param challenge The challenge to determine the point value for, can supply solved array or points to make this an instant function
 * @returns The point value as a number
 * @see getRankings
 */
export async function pointValue(
    challenge: Challenge & {
        solved?: Solve[];
        points?: number;
    }
): Promise<number> {
    if (challenge.points) {
        return challenge.points;
    }

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

/**
 * Gets total point value of team
 * @param team The team to count total points for
 * @param challenges Challege array, can be supplied with solves or point value to make an instant function
 * @returns The point value as a number
 */
export async function countPoints(
    team: Team & {
        solves?: (Solve & {
            challenge?: Challenge & {
                solved: Solve[];
            };
        })[];
    },
    challenges?: (Challenge & {
        solved: Solve[];
    })[]
): Promise<number> {
    if (!team.solves) {
        team.solves = await prisma.solve.findMany({
            where: {
                teamId: team.id,
            },
        });
    }

    if (team.solves.length == 0) {
        return 0;
    }

    if (team.solves[0].challenge) {
        challenges = team.solves.map((solve) => solve.challenge!);
    } else {
        let challId = team.solves.map((solve) => solve.challengeId);

        if (!challenges) {
            challenges = await prisma.challenge.findMany({
                where: {
                    id: {
                        in: challId,
                    },
                },
                include: { solved: true },
            });
        } else {
            challenges = challenges.filter((challenge) => {
                return challenge.solved
                    .map((solve) => solve.teamId)
                    .includes(team.id);
            });
        }
    }

    return (
        await Promise.all(challenges.map((challenge) => pointValue(challenge!)))
    ).reduce((a, b) => a + b);
}
