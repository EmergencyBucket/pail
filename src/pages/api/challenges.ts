import { PrismaClient, Session } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

const ajv = new Ajv();
interface CreateChallengeRequest {
    name: string;
    description: string;
    files: string[];
    flag: string;
}

const CreateTeamRequestSchema: JSONSchemaType<CreateChallengeRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 50 },
        description: { type: 'string', minLength: 1 },
        files: { type: 'array', items: { type: 'string' } },
        flag: { type: 'string', minLength: 4 },
    },
    required: ['name', 'description', 'files', 'flag'],
};

const createTeamRequestValidator = ajv.compile(CreateTeamRequestSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const challenges = await prisma.challenge.findMany();

            challenges.forEach((challenge) => {
                challenge.flag = '';
            });

            return res.status(200).json(challenges);
        }
        case 'POST': {
            const session: Session | null = await unstable_getServerSession(
                req,
                res,
                authOptions
            );

            if (!session) {
                return res.status(401).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            let user = await prisma.user.findFirst({
                where: {
                    id: session.userId,
                },
            });

            if (!user || !user.admin) {
                return res.status(401).json({
                    Error: 'You do not have permission to preform this action.',
                });
            }

            const content = JSON.parse(req.body);

            if (!createTeamRequestValidator(content)) {
                return res.status(400).json({
                    Error: 'Bad request',
                });
            }

            const challenge = await prisma.challenge.create({
                data: {
                    name: content.name,
                    description: content.description,
                    files: content.files,
                    flag: content.flag,
                },
            });

            return res.status(201).json(challenge);
        }
    }
}
