import { Team } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

const ajv = new Ajv();
interface CreateTeamRequest {
    name: string;
}

const CreateTeamRequestSchema: JSONSchemaType<CreateTeamRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 4, maxLength: 50 },
    },
    required: ['name'],
};

const createTeamRequestValidator = ajv.compile(CreateTeamRequestSchema);

export async function GET() {
    const teams: Partial<Team>[] = await prisma.team.findMany();

    teams.forEach((team) => {
        delete team.secret;
    });

    return NextResponse.json(teams, {
        status: StatusCodes.OK,
    });
}

export async function POST(req: Request) {
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

    let teamreq = await req.json();

    if (createTeamRequestValidator(teamreq)) {
        const { name } = teamreq;

        const user = await prisma.user.findFirst({
            where: {
                name: session?.user?.name,
            },
        });

        if (user?.teamId) {
            return NextResponse.json(
                {
                    Error: 'Leave your current team first.',
                },
                {
                    status: StatusCodes.BAD_REQUEST,
                }
            );
        }

        const currTeam = await prisma.team.findFirst({
            where: {
                name: name,
            },
        });

        if (currTeam) {
            return NextResponse.json(
                {
                    Error: 'This team name is already taken.',
                },
                {
                    status: StatusCodes.BAD_REQUEST,
                }
            );
        }

        const team = await prisma.team.create({
            data: {
                name: name,
                members: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        return NextResponse.json(team, {
            status: StatusCodes.TEMPORARY_REDIRECT,
            headers: {
                Location: '/account',
            },
        });
    } else {
        return NextResponse.json(
            {
                Error: 'Team name can have a maximum length of 50 characters.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }
}
