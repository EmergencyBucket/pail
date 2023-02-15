import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const ajv = new Ajv();
interface CreateTeamRequest {
    name: string;
}

const CreateTeamRequestSchema: JSONSchemaType<CreateTeamRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 4, maxLength: 50 },
    },
    required: ['name'],
};

const createTeamRequestValidator = ajv.compile(CreateTeamRequestSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const teams = await prisma.team.findMany();

            teams.forEach((team) => {
                team.secret = '';
            });

            return res.status(StatusCodes.OK).json(teams);
        }
        case 'POST': {
            const session = await getSession({ req });

            if (!session) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            if (createTeamRequestValidator(JSON.parse(req.body))) {
                const { name } = JSON.parse(req.body);

                const user = await prisma.user.findFirst({
                    where: {
                        id: session?.user?.id,
                    },
                });

                if (user?.teamId) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        Error: 'Leave your current team first.',
                    });
                }

                const currTeam = await prisma.team.findFirst({
                    where: {
                        name: name,
                    },
                });

                if (currTeam) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        Error: 'This team name is already taken.',
                    });
                }

                const team = await prisma.team.create({
                    data: {
                        name: name,
                        members: {
                            connect: {
                                id: user?.id,
                            },
                        },
                    },
                });

                return res.status(StatusCodes.CREATED).json(team);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Team name can have a maximum length of 50 characters.',
                });
            }
        }
    }
}
