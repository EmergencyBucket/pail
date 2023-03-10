import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { admin, Middleware } from '@/lib/Middleware';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id?: string } }
) {
    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    const { id } = params;

    if (!isString(id)) {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }

    let challenge = await prisma.challenge.findFirst({
        where: {
            id: id,
        },
    });

    if (!challenge) {
        return NextResponse.json(
            {
                Error: 'Challenge not found.',
            },
            {
                status: StatusCodes.NOT_FOUND,
            }
        );
    }

    await prisma.challenge.delete({
        where: {
            id: id,
        },
    });

    return NextResponse.json(
        {
            Error: 'Challenge deleted.',
        },
        {
            status: StatusCodes.OK,
        }
    );
}
