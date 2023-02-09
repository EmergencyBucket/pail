import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import isString from 'is-string';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

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

            const session = await getSession({ req });

            if (!session) {
                return res.status(401).json({
                    Error: 'You need to be logged in to preform this action.',
                });
            }

            if (!isString(id) || !isString(session.user?.id)) {
                return res.status(400).json({
                    Error: 'Bad request.',
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
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
                await prisma.solve.create({
                    data: {
                        challenge: {
                            connect: {
                                id: challenge.id,
                            },
                        },
                        team: {
                            connect: {
                                id: team?.id,
                            },
                        },
                        time: new Date(),
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
