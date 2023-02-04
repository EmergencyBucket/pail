import { PrismaClient } from '@prisma/client';
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
                return res.status(400).json({
                    Error: 'Bad request.',
                });
            }

            let team = await prisma.team.findFirst({
                where: {
                    id: id,
                },
            });

            if (team) {
                team.secret = '';
            }

            return res.status(200).json(team);
        }
    }
}
