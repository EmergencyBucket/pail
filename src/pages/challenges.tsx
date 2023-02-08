import ChallengeContainer from '@/components/ChallengeContainer';
import CreateChallenge from '@/components/CreateChallenge';
import Page from '@/components/Page';
import { Challenge, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';

const challenges: Fetcher<Challenge[]> = (url: string) =>
    fetch(url).then((r) => r.json());

export default function Home() {
    const { data, error } = useSWR(`/api/challenges`, challenges);

    const { data: session } = useSession();

    const [user, setUser] = useState<User>();

    async function getUser() {
        let req = await fetch(`api/users/${session?.user?.id}`);

        let res = await req.json();

        setUser(res);
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Page title="Challenges">
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {data?.map((challenge) => (
                        <ChallengeContainer
                            challenge={challenge}
                            key={Math.random()}
                        />
                    ))}
                    {user?.admin ? <CreateChallenge /> : <></>}
                </div>
            </Page>
        </>
    );
}
