import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const { id } = req.query;

            if (!isString(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request.',
                });
            }

            let challenge = await prisma.challenge.findFirst({
                where: {
                    id: id,
                },
            });

            if (!challenge) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    Error: 'Challenge not found.',
                });
            }

            challenge.flag = '';

            return res.status(StatusCodes.OK).json(challenge);
        }
        case 'DELETE': {
            const { id } = req.query;

            const session = await getSession({
                req: req,
            });

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

            await prisma.challenge.delete({
                where: {
                    id: id as string,
                },
            });

            return res.status(StatusCodes.OK).json({
                Message: 'Challenge deleted.',
            });
        }
    }
}
