import Ajv, { JSONSchemaType } from 'ajv';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFEnd, CTFStart, Middleware, teamMember } from '@/lib/Middleware';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import {
    Client,
    EmbedBuilder,
    Events,
    GatewayIntentBits,
    TextChannel,
} from 'discord.js';
import { User } from '@prisma/client';

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

    const user: User = (await prisma.user.findFirst({
        where: {
            name: session!.user?.name,
        },
    })) as User;

    const team = await prisma.team.findFirst({
        where: {
            id: user?.teamId as string,
        },
    });

    const challenge = await prisma.challenge.findFirst({
        where: {
            id: id as string,
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

        if (challenge.solved.length == 0) {
            let token = process.env.DISCORD_TOKEN;

            let channel = await prisma.setting.findFirst({
                where: {
                    key: 'DISCORD_CHANNEL',
                },
            });

            const firstBlood = new EmbedBuilder()
                .setColor(0x4361ee)
                .setTitle('First Blood!')
                .setURL('https://ctf.ebucket.dev')
                .setAuthor({
                    name: user.name!,
                    iconURL: user.image!,
                    url: `https://github.com/${user.name}`,
                })
                .setDescription(`${team?.name} has solved ${challenge.name}!`)
                .setTimestamp();

            const client = new Client({ intents: [GatewayIntentBits.Guilds] });

            client.once(Events.ClientReady, (client) => {
                (
                    client.channels.cache.get(
                        channel?.value as string
                    ) as TextChannel
                ).send({ embeds: [firstBlood] });

                client.destroy();
            });

            client.login(token);
        }

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
