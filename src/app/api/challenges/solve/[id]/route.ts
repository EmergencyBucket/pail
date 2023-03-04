import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFEnd, CTFStart, Middleware, teamMember } from '@/lib/Middleware';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

const ajv = new Ajv();
interface SolveChallengeRequest {
    flag: string;
}

const SolveChallengeRequest: JSONSchemaType<SolveChallengeRequest> = {
    type: 'object',
    properties: {
        flag: { type: 'string' },
    },
    required: ['flag'],
};

const solveChallengeRequestValidator = ajv.compile(SolveChallengeRequest);

export async function POST(
    req: Request,
    { params }: { params: { id?: string } }
) {
    let middleware = await Middleware([CTFStart(), CTFEnd(), teamMember()]);
    if (middleware) return middleware;

    const { id } = params;

    const session = await getServerSession();

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

    const user = await prisma.user.findFirst({
        where: {
            name: session!.user?.name,
        },
    });

    const team = await prisma.team.findFirst({
        where: {
            id: user?.teamId as string,
        },
    });

    const challenge = await prisma.challenge.findFirst({
        where: {
            id: id as string,
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

    const data = await req.json();

    if (!solveChallengeRequestValidator(data)) {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }

    if (challenge.flag === data.flag) {
        let solve = await prisma.solve.findFirst({
            where: {
                teamId: team!.id,
                challengeId: challenge.id,
            },
        });

        if (solve) {
            return NextResponse.json(
                {
                    Error: 'Your team has already solved this challenge.',
                },
                {
                    status: StatusCodes.CONFLICT,
                }
            );
        }

        await prisma.solve.create({
            data: {
                challenge: {
                    connect: {
                        id: challenge.id,
                    },
                },
                team: {
                    connect: {
                        id: team?.id,
                    },
                },
                time: new Date(),
            },
        });

        return NextResponse.json(
            {
                Message: 'Correct flag.',
            },
            {
                status: StatusCodes.OK,
            }
        );
    }

    return NextResponse.json(
        {
            Error: 'Wrong flag.',
        },
        {
            status: StatusCodes.BAD_REQUEST,
        }
    );
}
