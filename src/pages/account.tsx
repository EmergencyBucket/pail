import Page from "@/components/Page";
import { Team } from "@prisma/client";
import { getSession, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {

    const { data: session } = useSession()

    const [ team, setTeam ] = useState<Team>();

    async function getTeam() {
        const session = await getSession();

        let req = await fetch(`/api/teams/user/${session?.user?.id}`, {
            method: 'GET',
        })

        if(req.status==404) {
            return;
        }

        let res = await req.json();

        setTeam(res as Team);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let req = await fetch(`/api/teams`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                name: event.target.name.value
            })
        })

        let res = await req.json();

        console.log(res)
    }

    useEffect(() => {
        getTeam()
    }, [])

    return (
        <>
            <Page>
                <div>
                    <p className="text-white">Username: {session?.user?.name}</p>
                    <p className="text-white">ID: {session?.user?.id}</p>
                </div>

                {team ?
                    <p className="text-white">{team.name}</p>
                :
                    <div>
                        <form onSubmit={submit}>
                            <input type={'text'} placeholder='Team name' name='name' className='bg-slate-700 border-2 border-slate-500' />
                            <input className="text-white" type={'submit'} />
                        </form>
                    </div>
                }
            </Page>
        </>
    )
}
