import { Category, Challenge, Difficulty, Solve } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin, CTFStart, Middleware } from '@/lib/Middleware';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

const ajv = new Ajv();

interface CreateChallengeRequest {
    name: string;
    description: string;
    files: string[];
    image?: string;
    flag: string;
    category: string;
    difficulty: string;
    staticPoints?: number;
}

const CreateChallengeRequestSchema: JSONSchemaType<CreateChallengeRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1 },
        files: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', nullable: true },
        flag: { type: 'string', minLength: 4 },
        category: {
            type: 'string',
            enum: ['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC'],
        },
        difficulty: {
            type: 'string',
            enum: ['EASY', 'MEDIUM', 'HARD'],
        },
        staticPoints: { type: 'integer', nullable: true },
    },
    required: ['name', 'description', 'files', 'flag'],
};

const createChallengeRequestValidator = ajv.compile(
    CreateChallengeRequestSchema
);

export async function GET() {
    let middleware = await Middleware([CTFStart()]);
    if (middleware) return middleware;

    const challenges: Partial<
        Challenge & {
            points: number;
            solved: Solve[];
        }
    >[] = await prisma.challenge.findMany({
        include: {
            solved: true,
        },
    });

    challenges.forEach((challenge) => {
        delete challenge.flag;
        challenge.points = 500 - (challenge.solved?.length ?? 0) * 2;
        delete challenge.solved;
    });

    return NextResponse.json(challenges);
}

export async function POST(req: Request) {
    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    const content = await req.json();

    if (!createChallengeRequestValidator(content)) {
        return NextResponse.json(
            {
                Error: 'Bad request',
            },
            {
                status: StatusCodes.FORBIDDEN,
            }
        );
    }

    const challenge = await prisma.challenge.create({
        data: {
            name: content.name,
            description: content.description,
            files: content.files.filter((s) => s.length).length
                ? content.files
                : [],
            image: content.image,
            flag: content.flag,
            category: content.category as Category,
            difficulty: content.difficulty as Difficulty,
            solved: undefined,
            staticPoints: content.staticPoints,
        },
    });

    return NextResponse.json(challenge, {
        status: StatusCodes.CREATED,
    });
}
