import { getServerSession } from 'next-auth';
import prisma from './prismadb';

export async function getUser() {
    let session = await getServerSession();

    if (!session) {
        return null;
    }

    return await prisma.user.findFirst({
        where: {
            email: session?.user?.email,
        },
    });
}

export async function getTeam() {
    let session = await getServerSession();

    if (!session) {
        return null;
    }

    return (
        await prisma.user.findFirst({
            where: {
                email: session?.user?.email,
            },
            include: {
                team: true,
            },
        })
    )?.team;
}
