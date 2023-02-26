import { PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin } from 'lib/Middleware';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const ajv = new Ajv();

interface SettingRequest {
    key: string;
    value: string;
    pub: boolean;
}

const SettingRequestSchema: JSONSchemaType<SettingRequest> = {
    type: 'object',
    properties: {
        key: { type: 'string' },
        value: { type: 'string' },
        pub: { type: 'boolean' },
    },
    required: ['key', 'value', 'pub'],
};

const settingRequestValidator = ajv.compile(SettingRequestSchema);

export async function GET() {
    let temp;
    if ((temp = await admin(prisma))) {
        return temp;
    }

    let settings = await prisma.setting.findMany();

    return NextResponse.json(settings, {
        status: StatusCodes.OK,
    });
}

export async function POST(req: Request) {
    let temp;
    if ((temp = await admin(prisma))) {
        return temp;
    }

    let reqsetting = await req.json();

    if (settingRequestValidator(reqsetting)) {
        const { key, value, pub } = reqsetting;

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
                    public: pub,
                },
            });

            return NextResponse.json(curr, {
                status: StatusCodes.OK,
            });
        }

        let setting = await prisma.setting.create({
            data: {
                key: key,
                value: value,
                public: pub,
            },
        });

        return NextResponse.json(setting, {
            status: StatusCodes.CREATED,
        });
    } else {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }
}
