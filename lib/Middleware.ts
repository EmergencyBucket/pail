import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

async function Middleware(middlewares: Promise<Response | undefined>[]) {
    return (await Promise.all(middlewares)).find((m) => m);
}

/**
 * Checks if a user can access a route depending on the CTF start time
 * @returns A response if the request does not pass the middleware
 */
async function CTFStart(): Promise<Response | undefined> {
    let start = await prisma.setting.findFirst({
        where: {
            key: 'CTF_START_TIME',
        },
    });

    if (start && parseInt(start.value) > new Date().getTime()) {
        let session = await getServerSession();

        if (session) {
            let user = await prisma.user.findFirst({
                where: {
                    name: session.user?.name,
                },
            });

            if (user?.admin) {
                return undefined;
            }
        }

        return NextResponse.json(
            {
                Error: 'This CTF has not started yet!',
            },
            {
                status: StatusCodes.FORBIDDEN,
            }
        );
    }

    return undefined;
}

/**
 * Checks if a user can access a route depending on the CTF end time
 * @returns True if the user does not pass and false otherwise
 */
async function CTFEnd(): Promise<Response | undefined> {
    let end = await prisma.setting.findFirst({
        where: {
            key: 'CTF_END_TIME',
        },
    });

    if (end && parseInt(end.value) < new Date().getTime()) {
        let session = await getServerSession();

        if (session) {
            let user = await prisma.user.findFirst({
                where: {
                    name: session.user?.name,
                },
            });

            if (user?.admin) {
                return undefined;
            }
        }

        return NextResponse.json(
            {
                Error: 'This CTF has ended!',
            },
            {
                status: StatusCodes.FORBIDDEN,
            }
        );
    }

    return undefined;
}

/**
 * Checks if a user is an admin
 * @returns True if the user does not pass and false otherwise
 */
async function admin(): Promise<Response | undefined> {
    let session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            {
                Error: 'You must be an admin to preform this action!',
            },
            {
                status: StatusCodes.FORBIDDEN,
            }
        );
    }

    let user = await prisma.user.findFirst({
        where: {
            name: session.user?.name,
        },
    });

    if (user && user.admin) {
        return undefined;
    }

    return NextResponse.json(
        {
            Error: 'You must be an admin to preform this action!',
        },
        {
            status: StatusCodes.FORBIDDEN,
        }
    );
}

/**
 * Checks if a user is on a team
 * @returns True if the user does not pass and false otherwise
 */
async function teamMember(): Promise<Response | undefined> {
    let session = await getServerSession();

    if (session) {
        let user = await prisma.user.findFirst({
            where: {
                name: session.user?.name,
            },
            include: {
                team: true,
            },
        });

        if (user?.team) {
            return undefined;
        }
    }

    return NextResponse.json(
        {
            Error: 'You must be on a team to preform this action!',
        },
        {
            status: StatusCodes.FORBIDDEN,
        }
    );
}

export { Middleware, CTFStart, CTFEnd, admin, teamMember };
