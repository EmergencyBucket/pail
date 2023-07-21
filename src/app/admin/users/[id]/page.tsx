import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

export const metadata = {
    title: 'EBucket | Admin | Users',
};

export default async function Home({
    params: { id },
}: {
    params: { id: string };
}) {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let user = await prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });

    let team = (
        await prisma.user.findFirst({
            where: {
                email: user.email,
            },
            include: {
                team: {
                    include: {
                        members: true,
                    },
                },
            },
        })
    )?.team;

    async function leaveTeam() {
        'use server';

        let team = await prisma.team.update({
            include: {
                members: true,
            },
            where: {
                id: user.teamId as string,
            },
            data: {
                members: {
                    disconnect: {
                        id: user!.id,
                    },
                },
            },
        });

        if (team.members.length === 0) {
            await prisma.solve.deleteMany({
                where: {
                    teamId: user!.teamId as string,
                },
            });

            await prisma.team.delete({
                where: {
                    id: team.id,
                },
            });
        }

        revalidatePath('/account');
    }

    return (
        <div className="mx-auto w-1/3 border border-slate-700 rounded-lg p-4">
            <div className="flex">
                <Image
                    src={user?.image!}
                    alt={user?.name!}
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-slate-700"
                />
                <p className="text-white text-7xl font-mono m-auto">
                    {user?.name}
                </p>
            </div>
            <hr className="my-4 border-slate-700" />
            <div className="grid">
                <div className="grid grid-cols-2 mx-auto">
                    <p className="text-white text-mono text-center">Email</p>
                    <code className="text-white">{user?.email}</code>
                </div>
                <div className="grid grid-cols-2 mx-auto">
                    <p className="text-white text-mono text-center">ID</p>
                    <code className="text-white">{user?.id}</code>
                </div>
            </div>
            <hr className="my-4 border-slate-700" />
            <div className="grid gap-2">
                {team && (
                    <div className="border border-slate-700 rounded-lg p-2 grid gap-2">
                        <div className="text-mono text-2xl text-white text-center">
                            {team.name}&apos;s members
                        </div>

                        <hr className="border-slate-700" />

                        {team?.members.map((user) => (
                            <div
                                className="text-mono text-white text-center"
                                key={user.id}
                            >
                                {user.name}
                            </div>
                        ))}

                        <hr className="border-slate-700" />

                        <form action={leaveTeam} className="grid">
                            <Button variant={'destructive'}>Leave Team</Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
