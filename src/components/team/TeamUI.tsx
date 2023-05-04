'use client';

import { Team } from 'discord.js';
import { User } from 'next-auth';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';

const TeamUI = () => {
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

    return (
        <>
            <form className="grid gap-2" onSubmit={submitJoin}>
                <Input
                    required
                    placeholder="Team Secret"
                    className="w-full"
                    name="secret"
                    type="password"
                    variant={'outline'}
                />
                <Button type="submit" variant={'outline'}>
                    Join Team
                </Button>
            </form>
            <hr className="my-4 border-slate-700" />
            <form
                action="/api/teams"
                className="grid gap-2"
                onSubmit={submitCreate}
            >
                <Input
                    required
                    placeholder="Team Name"
                    className="w-full"
                    name="name"
                    variant={'outline'}
                />
                <Button type="submit" variant={'outline'}>
                    Create Team
                </Button>
            </form>
        </>
    );
};

export { TeamUI };
