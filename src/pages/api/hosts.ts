import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin } from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const ajv = new Ajv();

interface CreateHostRequest {
    port?: number;
    remote: string;
    ca?: string;
    cert?: string;
    key?: string;
}

const CreateHostSchema: JSONSchemaType<CreateHostRequest> = {
    type: 'object',
    properties: {
        port: { type: 'integer', nullable: true, minimum: 1, maximum: 65535 },
        remote: { type: 'string' },
        ca: { type: 'string', nullable: true },
        cert: { type: 'string', nullable: true },
        key: { type: 'string', nullable: true },
    },
    required: ['remote'],
};

const createHostValidator = ajv.compile(CreateHostSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            if (await admin(req, res, prisma)) return;

            const hosts = await prisma.host.findMany();

            return res.status(StatusCodes.OK).json(hosts);
        }
        case 'POST': {
            if (await admin(req, res, prisma)) return;

            const content = JSON.parse(req.body);

            if (!createHostValidator(content)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request',
                });
            }

            const host = await prisma.host.create({
                data: {
                    port: content.port,
                    remote: content.remote,
                    ca: content.ca,
                    cert: content.cert,
                    key: content.key,
                },
            });

            return res.status(StatusCodes.CREATED).json(host);
        }
    }
}
