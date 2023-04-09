import { Solve, Challenge, Team } from '@prisma/client';
import { tidy, mutate, arrange, desc } from '@tidyjs/tidy';
import { StatusCodes } from 'http-status-codes';
import { CTFStart, Middleware } from '@/lib/Middleware';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
    let middleware = await Middleware([CTFStart()]);
    if (middleware) return middleware;

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
        team: string;
        id: string;
        score: number;
        pos?: number;
    }> = [];

    teams.forEach((team) => {
        rankings.push({
            team: team.name,
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
