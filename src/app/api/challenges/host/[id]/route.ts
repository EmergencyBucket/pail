import prisma from '@/lib/prismadb';
import Dockerode, { AuthConfig } from 'dockerode';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFStart, Middleware, user } from '@/lib/Middleware';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import rateLimit from '@/lib/rate-limit';
import { logger } from '@/lib/Logger';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(
    req: Request,
    { params }: { params: { id?: string } }
) {
    let session = await getServerSession();

    let middleware = await Middleware([
        CTFStart(),
        user(),
        limiter.check(5, session!.user!.name as string),
    ]);
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

    if (!challenge || !challenge.image) {
        return NextResponse.json(
            {
                Error: 'Challenge not found or does not contain an image.',
            },
            {
                status: StatusCodes.NOT_FOUND,
            }
        );
    }

    let host = await prisma.host.findFirst();

    if (!host) {
        return NextResponse.json(
            {
                Error: 'No host available.',
            },
            {
                status: StatusCodes.SERVICE_UNAVAILABLE,
            }
        );
    }

    let docker = new Dockerode({
        host: host.remote,
        port: host.port ?? 2375,
        ca: host.ca!,
        cert: host.cert!,
        key: host.key!,
    });

    let auth: AuthConfig = {
        username: process.env.DOCKER_USERNAME!,
        password: process.env.DOCKER_PASSWORD!,
        serveraddress: 'https://ghcr.io',
    };

    await docker.pull(challenge.image, { authconfig: auth });

    let container = await docker.createContainer({
        Image: challenge.image,
        ExposedPorts: {
            '80/tcp': {},
        },
        HostConfig: {
            PortBindings: {
                '80/tcp': [{ HostPort: '0' }],
            },
        },
    });

    await container.start();

    let port = (await container.inspect()).NetworkSettings.Ports['80/tcp'][0]
        .HostPort;

    logger.info(session?.user?.name + ' - ' + container.id);

    setTimeout(async () => {
        await container.kill();
        await container.remove();
    }, 1000 * 900);

    return NextResponse.json(
        {
            url: host.ip + ':' + port,
        },
        {
            status: StatusCodes.OK,
        }
    );
}
