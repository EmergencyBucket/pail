import prisma from '@/lib/prismadb';
import Dockerode, { AuthConfig } from 'dockerode';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFEnd, CTFStart, Middleware, user } from '@/lib/Middleware';
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';
import { getServerSession } from 'next-auth';

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
        CTFEnd(),
        user(),
        limiter.check(2, session!.user!.email as string),
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

    let availablePorts: number[] = [];

    for (let i = 5000; i < 6000; i++) {
        if (!host.usedPorts.includes(i)) {
            availablePorts.push(i);
        }
    }

    let port =
        availablePorts[Math.floor(Math.random() * availablePorts.length)];

    host.usedPorts.push(port);

    await prisma.host.update({
        where: {
            id: host.id,
        },
        data: {
            usedPorts: host.usedPorts,
        },
    });

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
                '80/tcp': [{ HostPort: port + '' }],
            },
        },
    });

    await container.start();

    setTimeout(async () => {
        await container.kill();
        await container.remove();

        let host = await prisma.host.findFirst();

        let newPorts = host!.usedPorts.filter((x) => {
            x != port;
        });

        await prisma.host.update({
            where: {
                id: host!.id,
            },
            data: {
                usedPorts: newPorts,
            },
        });
    }, 1000 * 300);

    return NextResponse.json(
        {
            url: host.ip + ':' + port,
        },
        {
            status: StatusCodes.OK,
        }
    );
}

/*
export async function DELETE(
    req: Request,
    { params }: { params: { id?: string } }
) {
    let middleware = await Middleware([CTFStart(), CTFEnd()]);
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

    let container = docker.getContainer(id);

    await container.kill();

    await container.remove();

    return NextResponse.json(
        {
            status: StatusCodes.OK,
        }
    );
}
*/
