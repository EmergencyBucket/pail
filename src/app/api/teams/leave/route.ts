import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function POST() {
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

    const user = await prisma.user.findFirst({
        where: {
            name: session.user?.name,
        },
    });

    let team = await prisma.team.update({
        include: {
            members: true,
        },
        where: {
            id: user!.teamId as string,
        },
        data: {
            members: {
                disconnect: {
                    id: user!.id,
                },
            },
        },
    });

    if (team.members.length === 0) {
        await prisma.team.delete({
            where: {
                id: team.id,
            },
        });
    }

    return NextResponse.json(team, {
        status: StatusCodes.OK,
    });
}
