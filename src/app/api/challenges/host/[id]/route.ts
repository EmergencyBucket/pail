import { PrismaClient } from '@prisma/client';
import Dockerode from 'dockerode';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFEnd, CTFStart } from 'lib/Middleware';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    let temp;
    if ((temp = (await CTFStart(prisma)) || (await CTFEnd(prisma))))
        return temp;

    const id = req.nextUrl.searchParams.get('id');

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
        container.kill();
        container.remove();

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