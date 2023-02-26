import { Solve, Challenge, PrismaClient, Team } from '@prisma/client';
import { tidy, mutate, arrange, desc } from '@tidyjs/tidy';
import { StatusCodes } from 'http-status-codes';
import { CTFStart } from 'lib/Middleware';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    let temp;
    if ((temp = await CTFStart(prisma))) {
        return temp;
    }

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
                challenge.solved.length > 150
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
        score: number;
        pos?: number;
    }> = [];

    teams.forEach((team) => {
        rankings.push({
            label: team.name,
            id: team.id,
            score: team.points ?? 0,
        });
    });

    rankings = tidy(rankings, arrange(desc('score')));

    for (let index = 0; index < rankings.length; index++) {
        const ranking = rankings[index];
        ranking.pos = index + 1;
    }

    return NextResponse.json(rankings, {
        status: StatusCodes.OK,
    });
}
