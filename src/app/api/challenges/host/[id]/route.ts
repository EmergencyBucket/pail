import prisma from '@/lib/prismadb';
import Dockerode, { AuthConfig } from 'dockerode';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFStart, Middleware, user } from '@/lib/Middleware';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/Utils';
import { User } from '@prisma/client';

export async function POST(
    req: Request,
    { params }: { params: { id?: string } },
) {
    let middleware = await Middleware([CTFStart(), user()]);
    if (middleware) return middleware;

    let u = (await getUser()) as User;

    const { id } = params;

    if (!isString(id)) {
        return NextResponse.json(
            {
                Error: 'Bad request.',
            },
            {
                status: StatusCodes.BAD_REQUEST,
            },
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
            },
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
            },
        );
    }

    let docker = new Dockerode({
        host: host.remote,
        port: host.port ?? 2375,
        ca: host.ca!,
        cert: host.cert!,
        key: host.key!,
    });

    let cont = await prisma.container.findFirst({
        where: {
            userId: u.id,
            challengeId: challenge!.id,
        },
    });

    // Check if it was created 15 minutes ago
    if (cont && cont.created.getTime() - Date.now() > 900000) {
        await docker.getContainer(cont.id).kill();
        await docker.getContainer(cont.id).remove();
        await prisma.container.delete({
            where: {
                id: cont.id,
            },
        });
    } else if (cont) {
        return NextResponse.json(
            {
                Error: 'You already have a running container for this problem.',
            },
            {
                status: StatusCodes.SERVICE_UNAVAILABLE,
            },
        );
    }

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

    await prisma.container.create({
        data: {
            id: container.id,
            hostId: host.id,
            userId: u.id,
            challengeId: challenge.id,
            created: new Date(),
        },
    });

    await container.start();

    let port = (await container.inspect()).NetworkSettings.Ports['80/tcp'][0]
        .HostPort;

    return NextResponse.json(
        {
            url: host.ip + ':' + port,
        },
        {
            status: StatusCodes.OK,
        },
    );
}
