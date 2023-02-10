import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
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
                    Error: 'You must be an admin to preform this action.',
                });
            }

            let settings = await prisma.setting.findMany();

            return res.status(200).json(settings);
        }
        case 'POST': {
            const session = await getSession({ req });

            if (!session) {
                return res.status(401).json({
                    Error: 'You must be logged in to preform this action.',
                });
            }

            if (settingRequestValidator(JSON.parse(req.body))) {
                const { key, value } = JSON.parse(req.body);

                const user = await prisma.user.findFirst({
                    where: {
                        id: session?.user?.id,
                    },
                });

                if (!user || !user.admin) {
                    return res.status(401).json({
                        Error: 'You must be an admin to preform this action.',
                    });
                }

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

                    return res.status(201).json(curr);
                }

                let setting = await prisma.setting.create({
                    data: {
                        key: key,
                        value: value,
                    },
                });

                return res.status(201).json(setting);
            } else {
                return res.status(400).json({
                    Error: 'Bad request.',
                });
            }
        }
    }
}
