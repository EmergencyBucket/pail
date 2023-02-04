import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST': {
            const session = await getSession();

            if (!session) {
                return res.status(400).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user?.teamId) {
                return res.status(403).json({
                    Error: 'You must be on a team to leave your team.',
                });
            }

            let team = await prisma.team.update({
                include: {
                    members: true,
                },
                where: {
                    id: user.teamId,
                },
                data: {
                    members: {
                        disconnect: {
                            id: user.id,
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

            return res.status(200).json(team);
        }
    }
}
