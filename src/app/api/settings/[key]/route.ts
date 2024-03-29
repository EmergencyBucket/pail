import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { admin, Middleware } from '@/lib/Middleware';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(
    req: NextRequest,
    { params }: { params: { key?: string } },
) {
    const { key } = params;

    if (!isString(key)) {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            },
        );
    }

    let setting = await prisma.setting.findFirst({
        where: {
            key: key,
        },
    });

    if (!setting) {
        return NextResponse.json(
            {
                Error: 'This setting was not found.',
            },
            {
                status: StatusCodes.NOT_FOUND,
            },
        );
    }

    if (setting.public) {
        return NextResponse.json(setting, {
            status: StatusCodes.OK,
        });
    }

    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    return NextResponse.json(setting, {
        status: StatusCodes.OK,
    });
}
