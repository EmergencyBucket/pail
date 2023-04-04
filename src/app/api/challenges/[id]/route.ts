import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { admin, Middleware } from '@/lib/Middleware';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import Ajv, { JSONSchemaType } from 'ajv';
import { Category, Difficulty } from '@prisma/client';

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
        include: {
            solved: true,
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

    await prisma.solve.deleteMany({
        where: {
            challengeId: challenge.id,
        },
    });

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

const ajv = new Ajv();

interface EditChallengeRequest {
    name?: string;
    description?: string;
    files?: string[];
    image?: string;
    flag?: string;
    category?: string;
    difficulty?: string;
    staticPoints?: number;
}

const EditChallengeSchema: JSONSchemaType<EditChallengeRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', nullable: true, minLength: 1, maxLength: 50 },
        description: { type: 'string', nullable: true, minLength: 1 },
        files: { type: 'array', nullable: true, items: { type: 'string' } },
        image: { type: 'string', nullable: true },
        flag: { type: 'string', nullable: true, minLength: 4 },
        category: {
            type: 'string',
            nullable: true,
            enum: ['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC'],
        },
        difficulty: {
            type: 'string',
            nullable: true,
            enum: ['EASY', 'MEDIUM', 'HARD'],
        },
        staticPoints: { type: 'integer', nullable: true },
    },
};

const editChallengeValidator = ajv.compile(EditChallengeSchema);

export async function PATCH(
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

    const content = await req.json();

    if (!editChallengeValidator(content)) {
        return NextResponse.json(
            {
                Error: 'Bad request',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            }
        );
    }

    let challenge = await prisma.challenge.update({
        where: {
            id: id,
        },
        data: {
            name: content.name,
            description: content.description,
            files: content.files
                ? content.files.filter((s) => s.length).length
                    ? content.files
                    : []
                : content.files,
            image: content.image,
            flag: content.flag,
            category: content.category as Category | undefined,
            difficulty: content.difficulty as Difficulty | undefined,
            staticPoints: content.staticPoints,
        },
    });

    return NextResponse.json(challenge, {
        status: StatusCodes.OK,
    });
}
