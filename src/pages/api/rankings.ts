import { Challenge, PrismaClient, Solve, Team } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { tidy, mutate, arrange, desc } from '@tidyjs/tidy';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

function getColor() {
    return `rgba(${255 * Math.random()}, ${255 * Math.random()}, ${
        255 * Math.random()
    }, 0.25)`;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
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

            rankings = tidy(rankings, arrange(desc('data')));

            return res.status(StatusCodes.OK).json(rankings);
        }
    }
}
