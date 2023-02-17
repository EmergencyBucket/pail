import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import Middleware from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            if (await Middleware.CTFStart(req, res, prisma)) return;

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

            if (await Middleware.admin(req, res, prisma)) return;

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
