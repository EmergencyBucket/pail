import { PrismaClient } from '@prisma/client';
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
                return res.status(401).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user?.teamId) {
                return res.status(404).json({
                    Error: 'You are not apart of a team.',
                });
            }

            const team = await prisma.team.findFirst({
                where: {
                    id: user?.teamId,
                },
            });

            return res.status(200).json(team);
        }
    }
}
