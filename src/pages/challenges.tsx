import ChallengeContainer from '@/components/ChallengeContainer';
import CreateChallenge from '@/components/CreateChallenge';
import Page from '@/components/Page';
import { Challenge } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>();

    async function getChallenges() {
        let req = await fetch(`/api/challenges`, {
            method: 'GET',
        });

        let res = await req.json();

        setChallenges(res);
    }

    useEffect(() => {
        getChallenges();
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
                    <CreateChallenge />
                </div>
            </Page>
        </>
    );
}
