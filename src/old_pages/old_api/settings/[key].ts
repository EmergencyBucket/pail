import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { admin } from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const { key } = req.query;

            if (!isString(key)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request.',
                });
            }

            let setting = await prisma.setting.findFirst({
                where: {
                    key: key,
                },
            });

            if (!setting) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    Error: 'This setting was not found.',
                });
            }

            if (setting.public) {
                return res.status(StatusCodes.OK).json(setting);
            }

            if (await admin(req, res, prisma)) return;

            return res.status(StatusCodes.OK).json(setting);
        }
    }
}
