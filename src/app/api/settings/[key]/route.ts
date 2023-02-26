import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import isString from "is-string";
import { admin } from "lib/Middleware";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");

    if (!isString(key)) {
        return NextResponse.json({
            Error: 'Bad request.',
        }, {
            status: StatusCodes.BAD_REQUEST
        });
    }

    let setting = await prisma.setting.findFirst({
        where: {
            key: key,
        },
    });

    if (!setting) {
        return NextResponse.json({
            Error: 'This setting was not found.',
        }, {
            status: StatusCodes.NOT_FOUND
        });
    }

    if (setting.public) {
        return NextResponse.json(setting, {
            status: StatusCodes.OK
        });
    }

    let temp;
    if ((temp = await admin(prisma))) {
        return temp;
    }

    return NextResponse.json(setting, {
        status: StatusCodes.OK
    });
}