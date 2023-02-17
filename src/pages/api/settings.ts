import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin } from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const ajv = new Ajv();
interface SettingRequest {
    key: string;
    value: string;
}

const SettingRequestSchema: JSONSchemaType<SettingRequest> = {
    type: 'object',
    properties: {
        key: { type: 'string' },
        value: { type: 'string' },
    },
    required: ['key', 'value'],
};

const settingRequestValidator = ajv.compile(SettingRequestSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const session = await getSession({ req });

            if (!session) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            let user = await prisma.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (!user || !user.admin) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    Error: 'You must be an admin to preform this action.',
                });
            }

            let settings = await prisma.setting.findMany();

            return res.status(StatusCodes.OK).json(settings);
        }
        case 'POST': {
            if (await admin(req, res, prisma)) return;

            if (settingRequestValidator(JSON.parse(req.body))) {
                const { key, value } = JSON.parse(req.body);

                let curr = await prisma.setting.findFirst({
                    where: {
                        key: key,
                    },
                });

                if (curr) {
                    await prisma.setting.update({
                        where: {
                            key: key,
                        },
                        data: {
                            value: value,
                        },
                    });

                    return res.status(StatusCodes.OK).json(curr);
                }

                let setting = await prisma.setting.create({
                    data: {
                        key: key,
                        value: value,
                    },
                });

                return res.status(StatusCodes.CREATED).json(setting);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request.',
                });
            }
        }
    }
}
