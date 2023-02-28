import { Category, Challenge, Difficulty, PrismaClient } from '@prisma/client';
import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { admin, CTFStart, Middleware } from 'lib/Middleware';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const ajv = new Ajv();

interface CreateChallengeRequest {
    name: string;
    description: string;
    files: string[];
    flag: string;
    category: string;
    difficulty: string;
}

const CreateChallengeRequestSchema: JSONSchemaType<CreateChallengeRequest> = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 50 },
        description: { type: 'string', minLength: 1 },
        files: { type: 'array', items: { type: 'string' } },
        flag: { type: 'string', minLength: 4 },
        category: {
            type: 'string',
            enum: ['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC'],
        },
        difficulty: {
            type: 'string',
            enum: ['EASY', 'MEDIUM', 'HARD'],
        },
    },
    required: ['name', 'description', 'files', 'flag'],
};

const createChallengeRequestValidator = ajv.compile(
    CreateChallengeRequestSchema
);

export async function GET() {
    let middleware = Middleware([CTFStart()]);
    if (middleware) return middleware;

    const challenges: Partial<Challenge>[] = await prisma.challenge.findMany();

    challenges.forEach((challenge) => {
        delete challenge.flag;
    });

    return NextResponse.json(challenges);
}

export async function POST(req: Request) {
    let middleware = Middleware([admin()]);
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
            files: content.files,
            flag: content.flag,
            category: content.category as Category,
            difficulty: content.difficulty as Difficulty,
            solved: undefined,
        },
    });

    return NextResponse.json(challenge, {
        status: StatusCodes.CREATED,
    });
}
