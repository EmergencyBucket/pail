import { Category, Difficulty, PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import Middleware from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const ajv = new Ajv();
interface CreateChallengeRequest {
    name: string;
    description: string;
    files: string[];
    flag: string;
    category: string;
    difficulty: string;
}

const CreateTeamRequestSchema: JSONSchemaType<CreateChallengeRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 50 },
        description: { type: 'string', minLength: 1 },
        files: { type: 'array', items: { type: 'string' } },
        flag: { type: 'string', minLength: 4 },
        category: {
            type: 'string',
            enum: ['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC'],
        },
        difficulty: {
            type: 'string',
            enum: ['EASY', 'MEDIUM', 'HARD'],
        },
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
            if (await Middleware.CTFStart(req, res, prisma)) return;

            const challenges = await prisma.challenge.findMany();

            challenges.forEach((challenge) => {
                challenge.flag = '';
            });

            return res.status(StatusCodes.OK).json(challenges);
        }
        case 'POST': {
            const session = await getSession({ req });

            if (!session) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            let user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user || !user.admin) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    Error: 'You do not have permission to preform this action.',
                });
            }

            const content = JSON.parse(req.body);

            if (!createTeamRequestValidator(content)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request',
                });
            }

            const challenge = await prisma.challenge.create({
                data: {
                    name: content.name,
                    description: content.description,
                    files: content.files,
                    flag: content.flag,
                    category: content.category as Category,
                    difficulty: content.difficulty as Difficulty,
                    solved: undefined,
                },
            });

            return res.status(StatusCodes.CREATED).json(challenge);
        }
    }
}
