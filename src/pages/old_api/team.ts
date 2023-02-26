import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const session = await getSession({ req });

            if (!session) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user?.teamId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'You are not apart of a team.',
                });
            }

            const team = await prisma.team.findFirst({
                where: {
                    id: user?.teamId,
                },
            });

            return res.status(StatusCodes.OK).json(team);
        }
    }
}
