import { PrismaClient, Session } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

const prisma = new PrismaClient();

const ajv = new Ajv();

interface JoinTeamRequest {
    secret: string;
}

const JoinTeamRequestSchema: JSONSchemaType<JoinTeamRequest> = {
    type: 'object',
    properties: {
        secret: {
            type: 'string',
        },
    },
    required: ['secret'],
};

const joinTeamRequestValidator = ajv.compile(JoinTeamRequestSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST': {
            const session: Session | null = await unstable_getServerSession(
                req,
                res,
                authOptions
            );

            if (!session) {
                return res.status(400).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            const data = JSON.parse(req.body);

            if (!joinTeamRequestValidator(data)) {
                return res.status(401).json({
                    Error: 'Bad request.',
                });
            }

            const team = await prisma.team.findFirst({
                where: {
                    secret: data.secret,
                },
            });

            if (!team) {
                return res.status(400).json({
                    Error: 'Bad secret.',
                });
            }

            await prisma.team.update({
                where: {
                    secret: data.secret,
                },
                data: {
                    members: {
                        connect: {
                            id: session.userId,
                        },
                    },
                },
            });

            return res.status(200).json(team);
        }
    }
}
