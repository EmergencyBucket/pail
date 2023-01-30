import { PrismaClient, Session } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

const prisma = new PrismaClient();

const ajv = new Ajv();
interface SolveChallengeRequest {
    flag: string;
}

const SolveChallengeRequest: JSONSchemaType<SolveChallengeRequest> = {
    type: 'object',
    properties: {
        flag: { type: 'string' },
    },
    required: ['flag'],
};

const solveChallengeRequestValidator = ajv.compile(SolveChallengeRequest);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST': {
            const { id } = req.query;

            const session: Session | null = await getServerSession(
                req,
                res,
                authOptions
            );

            if (!session) {
                return res.status(400).json({
                    Error: 'You need to be logged in to preform this action.',
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: session.userId,
                },
            });

            if (!user || !user.teamId) {
                return res.status(400).json({
                    Error: 'You must be on a team to preform this action.',
                });
            }

            const team = await prisma.team.findFirst({
                where: {
                    id: user.teamId as string,
                },
            });

            const challenge = await prisma.challenge.findFirst({
                where: {
                    id: id as string,
                },
            });

            if (!challenge) {
                return res.status(401).json({
                    Error: 'Challenge not found.',
                });
            }

            const data = JSON.parse(req.body);

            if (!solveChallengeRequestValidator(data)) {
                return res.status(401).json({
                    Error: 'Bad request.',
                });
            }

            if (challenge.flag === data.flag) {
                await prisma.challenge.update({
                    where: {
                        id: id as string,
                    },
                    data: {
                        solved: {
                            connect: {
                                id: team?.id,
                            },
                        },
                    },
                });

                await prisma.team.update({
                    where: {
                        id: team?.id as string,
                    },
                    data: {
                        solves: {
                            connect: {
                                id: challenge.id,
                            },
                        },
                    },
                });

                return res.status(200).json({
                    Message: 'Correct flag.',
                });
            }

            return res.status(400).json({
                Error: 'Wrong flag.',
            });
        }
    }
}
