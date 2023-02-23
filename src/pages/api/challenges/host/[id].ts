import { PrismaClient } from '@prisma/client';
import Dockerode from 'dockerode';
import { StatusCodes } from 'http-status-codes';
import isString from 'is-string';
import { CTFEnd, CTFStart } from 'lib/Middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST': {
            if (await CTFStart(req, res, prisma)) return;
            if (await CTFEnd(req, res, prisma)) return;

            const { id } = req.query;

            if (!isString(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    Error: 'Bad request.',
                });
            }

            let challenge = await prisma.challenge.findFirst({
                where: {
                    id: id,
                },
            });

            if (!challenge || !challenge.image) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    Error: 'Challenge not found or does not contain an image.',
                });
            }

            let host = await prisma.host.findFirst();

            if (!host) {
                return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                    Error: 'No host available.',
                });
            }

            let availablePorts: number[] = [];

            for (let i = 5000; i < 6000; i++) {
                if (!host.usedPorts.includes(i)) {
                    availablePorts.push(i);
                }
            }

            let port =
                availablePorts[
                    Math.floor(Math.random() * availablePorts.length)
                ];

            host.usedPorts.push(port);

            await prisma.host.update({
                where: {
                    id: host.id,
                },
                data: {
                    usedPorts: host.usedPorts,
                },
            });

            console.log(host);

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

            return res.status(StatusCodes.OK).json({
                url: host.remote + ':' + port,
            });
        }
    }
}
