import { PrismaClient, Session } from "@prisma/client";
import Ajv, { JSONSchemaType } from "ajv";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient()

const ajv = new Ajv()
interface CreateTeamRequest {
    name: string;
}

const CreateTeamRequestSchema: JSONSchemaType<CreateTeamRequest> = {
    type: "object",
    properties: {
        name: {type: "string", maxLength: 50}
    },
    required: ["name"]
}

const createTeamRequestValidator = ajv.compile(CreateTeamRequestSchema);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET': {
            const teams = prisma.team.findMany();
            return res.status(200).json(teams);
        }
        case 'POST': {

            const session: Session | null = await unstable_getServerSession(req, res, authOptions)

            if(createTeamRequestValidator(JSON.parse(req.body))) {
                const { name } = JSON.parse(req.body);

                const user = await prisma.user.findFirst({
                    where: {
                        id: session?.userId
                    }
                });

                if(user?.teamId) {
                    return res.status(403).json({
                        "Error": "Leave your current team first."
                    })
                }

                const currTeam = await prisma.team.findFirst({
                    where: {
                        name: name
                    }
                });

                if(currTeam) {
                    return res.status(403).json({
                        "Error": "This team name is already taken."
                    })
                }

                const team = await prisma.team.create({
                    data: {
                        name: name,
                        members: {
                            connect: {
                                id: user?.id
                            }
                        }
                    }
                })

                return res.status(201).json(team);
            }
            else {
                return res.status(400).json({
                    "Error": "Team name can have a maximum length of 50 characters."
                })
            }
        }
    }
}

