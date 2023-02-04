import { PrismaClient } from '@prisma/client';
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
                return res.status(400).json({
                    Error: 'Bad request.',
                });
            }

            let challenge = await prisma.challenge.findFirst({
                where: {
                    id: id,
                },
            });

            if (!challenge) {
                return res.status(404).json({
                    Error: 'Challenge not found.',
                });
            }

            challenge.flag = '';

            return res.status(200).json(challenge);
        }
        case 'DELETE': {
            const { id } = req.query;

            const session = await getSession({
                req: req,
            });

            if (!session) {
                return res.status(401).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            let user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user || !user.admin) {
                return res.status(401).json({
                    Error: 'You do not have permission to preform this action.',
                });
            }

            await prisma.challenge.delete({
                where: {
                    id: id as string,
                },
            });

            return res.status(200).json({
                Message: 'Challenge deleted.',
            });
        }
    }
}
