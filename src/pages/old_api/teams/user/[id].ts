import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { NextApiRequest, NextApiResponse } from 'next';

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

            let user = await prisma.user.findFirst({
                where: {
                    id: id,
                },
            });

            if (!isString(user?.teamId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'This user has not joined a team.',
                });
            }

            let team = await prisma.team.findFirst({
                where: {
                    id: user?.teamId,
                },
            });

            if (team) {
                team.secret = '';
            }

            return res.status(StatusCodes.OK).json(team);
        }
    }
}
