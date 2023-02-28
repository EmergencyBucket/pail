import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin, Middleware } from 'lib/Middleware';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const ajv = new Ajv();

interface CreateHostRequest {
    port?: number;
    remote: string;
    ip?: string;
    ca?: string;
    cert?: string;
    key?: string;
}

const CreateHostSchema: JSONSchemaType<CreateHostRequest> = {
    type: 'object',
    properties: {
        port: { type: 'integer', nullable: true, minimum: 1, maximum: 65535 },
        remote: { type: 'string' },
        ip: { type: 'string', nullable: true },
        ca: { type: 'string', nullable: true },
        cert: { type: 'string', nullable: true },
        key: { type: 'string', nullable: true },
    },
    required: ['remote'],
};

const createHostValidator = ajv.compile(CreateHostSchema);

export async function GET() {
    let middleware = Middleware([admin()]);
    if (middleware) return middleware;

    const hosts = await prisma.host.findMany();

    return NextResponse.json(hosts, {
        status: StatusCodes.OK,
    });
}

export async function POST(req: Request) {
    let middleware = Middleware([admin()]);
    if (middleware) return middleware;

    const content = await req.json();

    if (!createHostValidator(content)) {
        return NextResponse.json(
            {
                Error: 'Bad request',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }

    const host = await prisma.host.create({
        data: {
            port: content.port,
            remote: content.remote,
            ip: content.ip,
            ca: content.ca,
            cert: content.cert,
            key: content.key,
        },
    });

    return NextResponse.json(host, {
        status: StatusCodes.CREATED,
    });
}
