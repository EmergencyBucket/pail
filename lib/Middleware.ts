import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Checks if a user can access a route depending on the CTF start time
 * @param req The request
 * @param res The response
 * @param db Prisma Database
 * @returns A response if the request does not pass the middleware
 */
async function CTFStart(db: PrismaClient): Promise<Response | undefined> {
    let start = await db.setting.findFirst({
        where: {
            key: 'CTF_START_TIME',
        },
    });

    if (start && parseInt(start.value) > new Date().getTime()) {
        let session = await getServerSession();

        if (session) {
            let user = await db.user.findFirst({
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
 * @param req The request
 * @param res The response
 * @param db Prisma Database
 * @returns True if the user does not pass and false otherwise
 */
async function CTFEnd(db: PrismaClient): Promise<Response | undefined> {
    let end = await db.setting.findFirst({
        where: {
            key: 'CTF_END_TIME',
        },
    });

    if (end && parseInt(end.value) < new Date().getTime()) {
        let session = await getServerSession();

        if (session) {
            let user = await db.user.findFirst({
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
 * @param req The request
 * @param res The response
 * @param db Prisma database
 * @returns True if the user does not pass and false otherwise
 */
async function admin(db: PrismaClient): Promise<Response | undefined> {
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

    let user = await db.user.findFirst({
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
 * @param req The request
 * @param res The response
 * @param db Prisma database
 * @returns True if the user does not pass and false otherwise
 */
async function teamMember(db: PrismaClient): Promise<Response | undefined> {
    let session = await getServerSession();

    if (session) {
        let user = await db.user.findFirst({
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

export { CTFStart, CTFEnd, admin, teamMember };
