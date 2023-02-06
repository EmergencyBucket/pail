import ChallengeContainer from '@/components/ChallengeContainer';
import CreateChallenge from '@/components/CreateChallenge';
import Page from '@/components/Page';
import { Challenge, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>();

    const { data: session } = useSession();

    const [user, setUser] = useState<User>();

    async function getChallenges() {
        let req = await fetch(`/api/challenges`, {
            method: 'GET',
        });

        let res = await req.json();

        setChallenges(res);
    }

    async function getUser() {
        let req = await fetch(`api/users/${session?.user?.id}`);

        let res = await req.json();

        setUser(res);
    }

    useEffect(() => {
        getChallenges();
        getUser();
    }, []);

    return (
        <>
            <Page title="Challenges">
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {challenges?.map((challenge) => (
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
