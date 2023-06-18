import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

export const metadata = {
    title: 'EBucket | Admin | Teams',
};

export default async function Home({
    params: { id },
}: {
    params: { id: string };
}) {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let team = await prisma.team.findFirst({
        where: {
            id: id,
        },
        include: {
            members: true,
        },
    });

    if (!team) {
        return <Error reason={'Team not found!'} />;
    }

    let solves = await prisma.solve.findMany({
        where: {
            teamId: team?.id,
        },
        include: {
            challenge: true,
        },
    });

    async function removeMember(data: FormData) {
        'use server';

        await prisma.team.update({
            where: {
                id: team!.id,
            },
            data: {
                members: {
                    disconnect: [
                        {
                            id: data.get('id') as string,
                        },
                    ],
                },
            },
        });

        revalidatePath(`/admin/teams/${team!.id}`);
    }

    async function removeSolve(data: FormData) {
        'use server';

        await prisma.solve.delete({
            where: {
                id: data.get('id') as string,
            },
        });

        revalidatePath(`/admin/teams/${team!.id}`);
    }

    return (
        <div className="mx-auto w-1/3 border border-slate-700 rounded-lg p-4">
            <div className="flex">
                <p className="text-white text-7xl font-mono m-auto">
                    {team?.name}
                </p>
            </div>
            <hr className="my-4 border-slate-700" />
            <div className="grid">
                <div className="grid grid-cols-2 mx-auto">
                    <p className="text-white text-mono text-center">Name</p>
                    <code className="text-white">{team?.name}</code>
                </div>
                <div className="grid grid-cols-2 mx-auto">
                    <p className="text-white text-mono text-center">ID</p>
                    <code className="text-white">{team?.id}</code>
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
                                className="text-mono text-white text-center grid grid-cols-2"
                                key={user.id}
                            >
                                {user.name}
                                <form action={removeMember}>
                                    <input
                                        name="id"
                                        type="hidden"
                                        defaultValue={user.id}
                                    />
                                    <button className="text-red-600">
                                        Remove
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <hr className="my-4 border-slate-700" />
            <div className="grid gap-2">
                {solves && (
                    <div className="border border-slate-700 rounded-lg p-2 grid gap-2">
                        <div className="text-mono text-2xl text-white text-center">
                            {team!.name}&apos;s Solves
                        </div>

                        <hr className="border-slate-700" />

                        {solves.map((solve) => (
                            <div
                                className="text-mono text-white text-center grid grid-cols-2"
                                key={solve.id}
                            >
                                {solve.challenge.name}
                                <form action={removeSolve}>
                                    <input
                                        name="id"
                                        type="hidden"
                                        defaultValue={solve.id}
                                    />
                                    <button className="text-red-600">
                                        Remove
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
