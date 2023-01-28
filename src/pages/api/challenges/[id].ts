import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

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
    }
}
