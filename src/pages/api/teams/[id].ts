import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            const { id } = req.query;

            let team = await prisma.team.findFirst({
                where: {
                    id: id as string
                }
            })

            if(team) {
                team.secret=''
            }

            return res.status(200).json(team);
        }
    }
}