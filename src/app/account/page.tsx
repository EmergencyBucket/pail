'use client';

import { Status, Statuses } from '@/components/Status';
import { Team, User } from '@prisma/client';
import { FormEvent, useEffect, useState } from 'react';

export default function Home() {
    const [team, setTeam] = useState<
        Team & {
            members: User[];
        }
    >();

    const [user, setUser] = useState<User>();

    async function getTeam() {
        let req = await fetch(`/api/team`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!req.ok) {
            return;
        }

        let res = await req.json();

        setTeam(
            res as Team & {
                members: User[];
            }
        );
    }

    async function getUser() {
        let req = await fetch(`/api/user`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!req.ok) {
            return;
        }

        let res = await req.json();

        setUser(res as User);
    }

    async function leave() {
        await fetch(`/api/teams/leave`, {
            method: 'POST',
        });

        setTeam(undefined);
    }

    async function submitCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            name: { value: string };
        };

        let req = await fetch(`/api/teams`, {
            method: 'POST',
            body: JSON.stringify({
                name: target.name.value,
            }),
        });

        let res = await req.json();

        if (req.ok) {
            setTeam(
                res as Team & {
                    members: User[];
                }
            );
        } else {
            target.name.value = 'Invalid name.';
        }
    }

    async function submitJoin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            secret: { value: string };
        };

        let req = await fetch(`/api/teams/join`, {
            method: 'POST',
            body: JSON.stringify({
                secret: target.secret.value,
            }),
        });

        let res = await req.json();

        if (req.ok) {
            setTeam(
                res as Team & {
                    members: User[];
                }
            );
        } else {
            target.secret.value = 'Bad secret.';
        }
    }

    useEffect(() => {
        getTeam();
        getUser();
    }, []);

    if (!user) {
        return <Status status={Statuses.Loading} />;
    }

    return (
        <>
            <head>
                <title>EBucket | Account</title>
            </head>
            <div className="mt-8">
                <p className="text-white">
                    Username: <kbd>{user.name}</kbd>
                </p>
                <p className="text-white">
                    ID: <kbd>{user.id}</kbd>
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
                    <p className="text-white">
                        Team members:{' '}
                        <kbd>{team.members.map((m) => m.name + ' ')}</kbd>
                    </p>
                    <button
                        onClick={leave}
                        className={
                            'bg-slate-800 cursor-pointer text-white p-2 border-2 mt-2 border-slate-700 hover:border-slate-500'
                        }
                    >
                        Leave team
                    </button>
                </>
            ) : (
                <div className="flex gap-4">
                    <form onSubmit={submitCreate}>
                        <p className="text-white text-center">
                            Create your own team
                        </p>
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
                                'bg-slate-800 cursor-pointer text-white border-2 border-slate-700 hover:border-slate-500 w-full'
                            }
                            type={'submit'}
                        />
                    </form>
                    <form onSubmit={submitJoin}>
                        <p className="text-white text-center">Join a team</p>
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
                                'bg-slate-800 cursor-pointer text-white border-2 border-slate-700 hover:border-slate-500 w-full'
                            }
                            type={'submit'}
                        />
                    </form>
                </div>
            )}
        </>
    );
}
