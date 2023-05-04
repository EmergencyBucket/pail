import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TeamUI } from '@/components/team/TeamUI';
import { getTeam, getUser } from '@/lib/Utils';

export default async function Home() {
    let user = await getUser();

    let team = (
        await prisma.user.findFirst({
            where: {
                email: user?.email,
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

    return (
        <div className="mx-auto w-1/3 border border-slate-700 rounded-lg p-4">
            <div className="flex">
                <img
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
            <div className="grid">
                {team?.members.map((user) => (
                    <div>{user.name}</div>
                ))}
                {!team && <TeamUI />}
            </div>
        </div>
    );
}
