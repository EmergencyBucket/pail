import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

const ajv = new Ajv();

interface JoinTeamRequest {
    secret: string;
}

const JoinTeamRequestSchema: JSONSchemaType<JoinTeamRequest> = {
    type: 'object',
    properties: {
        secret: {
            type: 'string',
        },
    },
    required: ['secret'],
};

const joinTeamRequestValidator = ajv.compile(JoinTeamRequestSchema);

export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            {
                Error: 'You must be logged in to preform this action.',
            },
            {
                status: StatusCodes.UNAUTHORIZED,
            },
        );
    }

    const data = await req.json();

    if (!joinTeamRequestValidator(data)) {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            },
        );
    }

    const user = await prisma.user.findFirst({
        where: {
            name: session.user?.name!,
        },
    });

    const team = await prisma.team.findFirst({
        where: {
            secret: data.secret,
        },
        include: {
            members: true,
        },
    });

    if (!team) {
        return NextResponse.json(
            {
                Error: 'Bad secret.',
            },
            {
                status: StatusCodes.FORBIDDEN,
            },
        );
    }

    await prisma.team.update({
        where: {
            secret: data.secret,
        },
        data: {
            members: {
                connect: {
                    id: user!.id,
                },
            },
        },
    });

    team!.members.forEach((member) => {
        member.email = '';
    });

    return NextResponse.json(team, {
        status: StatusCodes.OK,
    });
}
