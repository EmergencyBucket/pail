import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

export const metadata = {
    title: 'EBucket | Account',
};

const prisma = new PrismaClient();

export default async function Home() {
    const session = await getServerSession();

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user?.id,
        },
    });

    const team = await prisma.team.findFirst({
        where: {
            id: user!.teamId as string,
        },
    });

    return (
        <>
            <div className="mt-8">
                <p className="text-white">
                    Username: <kbd>{user?.name}</kbd>
                </p>
                <p className="text-white">
                    ID: <kbd>{user?.id}</kbd>
                </p>
            </div>

            {team ? (
                <>
                    <p className="text-white">
                        Team name: <kbd>{team.name}</kbd>
                    </p>
                    <p className="text-white">
                        Team secret: <kbd>{team.secret}</kbd>
                    </p>
                    <button
                        //onClick={leave}
                        className={
                            'bg-slate-800 cursor-pointer text-white p-2 border-2 mt-2 border-slate-700 hover:border-slate-500'
                        }
                    >
                        Leave team
                    </button>
                </>
            ) : (
                <div>
                    <p className="text-white">Create your own team</p>
                    <form /* onSubmit={submitCreate} */>
                        <input
                            type={'text'}
                            placeholder="Team name"
                            name="name"
                            className={
                                'pl-2 bg-slate-700 border-2 text-white border-slate-500 my-2'
                            }
                        />
                        <br />
                        <input
                            className={
                                'bg-slate-800 cursor-pointer text-white p-2 border-2 border-slate-700 hover:border-slate-500'
                            }
                            type={'submit'}
                        />
                    </form>
                    <p className="text-white">Join a team</p>
                    <form /* onSubmit={submitJoin} */>
                        <input
                            type={'text'}
                            placeholder="Team secret"
                            name="secret"
                            className={
                                'pl-2 bg-slate-700 border-2 text-white border-slate-500 my-2'
                            }
                        />
                        <br />
                        <input
                            className={
                                'bg-slate-800 cursor-pointer text-white p-2 border-2 border-slate-700 hover:border-slate-500'
                            }
                            type={'submit'}
                        />
                    </form>
                </div>
            )}
        </>
    );
}
