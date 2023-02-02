import { PrismaClient, Session } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const { id } = req.query;

            let challenge = await prisma.challenge.findFirst({
                where: {
                    id: id as string,
                },
            });

            return res.status(200).json(challenge);
        }
        case 'DELETE': {
            const { id } = req.query;

            const session: Session | null = await getServerSession(
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
                    id: session.userId
                }
            })

            if(!user || !user.admin) {
                return res.status(401).json({
                    Error: 'You do not have permission to preform this action.',
                });
            }

            await prisma.challenge.delete({
                where: {
                    id: id as string
                }
            })

            return res.status(200).json({
                Message: "Challenge deleted."
            })
        }
    }
}
