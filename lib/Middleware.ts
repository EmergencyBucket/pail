import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

/**
 * Checks if a user can access a route depending on the CTF start time
 * @param req The request
 * @param res The response
 * @param db Prisma Database
 * @returns A response if the request does not pass the middleware
 */
async function CTFStart(
    req: NextApiRequest,
    res: NextApiResponse,
    db: PrismaClient
): Promise<boolean> {
    let start = await db.setting.findFirst({
        where: {
            key: 'CTF_START_TIME',
        },
    });

    if (start && parseInt(start.value) > new Date().getTime()) {
        let session = await getSession({ req });

        if (session) {
            let user = await db.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (user?.admin) {
                return false;
            }
        }

        res.status(StatusCodes.FORBIDDEN).json({
            Error: 'This CTF has not started yet!',
        });

        return true;
    }

    return false;
}

/**
 * Checks if a user can access a route depending on the CTF end time
 * @param req The request
 * @param res The response
 * @param db Prisma Database
 * @returns True if the user does not pass and false otherwise
 */
async function CTFEnd(
    req: NextApiRequest,
    res: NextApiResponse,
    db: PrismaClient
): Promise<boolean> {
    let end = await db.setting.findFirst({
        where: {
            key: 'CTF_END_TIME',
        },
    });

    if (end && parseInt(end.value) < new Date().getTime()) {
        let session = await getSession({ req });

        if (session) {
            let user = await db.user.findFirst({
                where: {
                    id: session.user?.id,
                },
            });

            if (user?.admin) {
                return false;
            }
        }

        res.status(StatusCodes.FORBIDDEN).json({
            Error: 'This CTF has ended!',
        });

        return true;
    }

    return false;
}

/**
 * Checks if a user is an admin
 * @param req The request
 * @param res The response
 * @param db Prisma database
 * @returns True if the user does not pass and false otherwise
 */
async function admin(
    req: NextApiRequest,
    res: NextApiResponse,
    db: PrismaClient
): Promise<boolean> {
    let session = await getSession({ req });

    if (!session) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            Error: 'You must be an admin to preform this action!',
        });

        return true;
    }

    let user = await db.user.findFirst({
        where: {
            id: session.user?.id,
        },
    });

    if (user && user.admin) {
        return false;
    }

    res.status(StatusCodes.UNAUTHORIZED).json({
        Error: 'You must be an admin to preform this action!',
    });

    return true;
}

/**
 * Checks if a user is on a team
 * @param req The request
 * @param res The response
 * @param db Prisma database
 * @returns True if the user does not pass and false otherwise
 */
async function teamMember(
    req: NextApiRequest,
    res: NextApiResponse,
    db: PrismaClient
): Promise<boolean> {
    let session = await getSession({ req });

    if (session) {
        let user = await db.user.findFirst({
            where: {
                id: session.user?.id,
            },
            include: {
                team: true,
            },
        });

        if (user?.team) {
            return false;
        }
    }

    res.status(StatusCodes.FORBIDDEN).json({
        Error: 'You must be on a team to preform this action!',
    });

    return true;
}

export { CTFStart, CTFEnd, admin, teamMember };
