import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            {
                Error: 'You must be logged in to preform this action.',
            },
            {
                status: StatusCodes.UNAUTHORIZED,
            }
        );
    }

    let user = await prisma.user.findFirst({
        where: {
            name: session.user?.name,
        },
    });

    if (!user?.teamId) {
        return NextResponse.json(
            {
                Error: 'You are not on a team.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }

    let team = await prisma.team.findFirst({
        where: {
            id: user.teamId,
        },
    });

    return NextResponse.json(team);
}
