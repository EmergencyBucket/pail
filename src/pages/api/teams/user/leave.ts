import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { teamMember } from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST': {
            if (await teamMember(req, res, prisma)) return;

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

            let team = await prisma.team.update({
                include: {
                    members: true,
                },
                where: {
                    id: user!.teamId as string,
                },
                data: {
                    members: {
                        disconnect: {
                            id: user!.id,
                        },
                    },
                },
            });

            if (team.members.length === 0) {
                await prisma.team.delete({
                    where: {
                        id: team.id,
                    },
                });
            }

            return res.status(StatusCodes.OK).json(team);
        }
    }
}
