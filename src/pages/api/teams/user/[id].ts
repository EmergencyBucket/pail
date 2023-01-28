import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    let user = await prisma.user.findFirst({
        where: {
            id: id as string
        }
    })

    if(!user?.teamId) {
        return res.status(404).json({
            "Error": "This user has not joined a team."
        })
    }

    let team = await prisma.team.findFirst({
        where: {
            id: user?.teamId as string
        }
    })

    return res.status(200).json(team);
}