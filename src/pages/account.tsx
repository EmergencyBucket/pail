import Page from '@/components/Page';
import { Team } from '@prisma/client';
import { getSession, useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

export default function Home() {
    const { data: session } = useSession();

    const [team, setTeam] = useState<Team>();

    async function getTeam() {
        const session = await getSession();

        let req = await fetch(`/api/teams/user/${session?.user?.id}`, {
            method: 'GET',
        });

        if (req.status == 404) {
            return;
        }

        let res = await req.json();

        setTeam(res as Team);
    }

    async function leave() {
        let req = await fetch(`/api/teams/user/leave`, {
            method: 'POST',
        });

        let res = await req.json();

        console.log(res);

        setTeam(undefined);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let req = await fetch(`/api/teams`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                name: event.target.name.value,
            }),
        });

        let res = await req.json();

        setTeam(res as Team);

        console.log(res);
    }

    useEffect(() => {
        getTeam();
    }, []);

    return (
        <>
            <Page>
                <div className="mt-8">
                    <p className="text-white">
                        Username: <kbd>{session?.user?.name}</kbd>
                    </p>
                    <p className="text-white">
                        ID: <kbd>{session?.user?.id}</kbd>
                    </p>
                </div>

                {team ? (
                    <>
                        <p className="text-white">
                            Team name: <kbd>{team.name}</kbd>
                        </p>
                        <button
                            onClick={leave}
                            className={
                                'bg-slate-800 cursor-pointer text-white p-2 border-2 border-slate-700 hover:border-slate-500'
                            }
                        >
                            Leave team
                        </button>
                    </>
                ) : (
                    <div>
                        <p className="text-white">Create your own team</p>
                        <form onSubmit={submit}>
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
                    </div>
                )}
            </Page>
        </>
    );
}
