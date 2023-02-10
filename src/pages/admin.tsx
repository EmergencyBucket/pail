import CreateChallenge from '@/components/CreateChallenge';
import EditChallenge from '@/components/EditChallenge';
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
            <Page title="Admin">
                <div className="mt-4 flex flex-wrap">
                    <div className="w-1/2 grid gap-4">
                        <code className="text-white text-2xl text-center">
                            Challenges
                        </code>
                        {challenges?.map((challenge) => (
                            <EditChallenge
                                className="w-full"
                                challenge={challenge}
                                key={Math.random()}
                            />
                        ))}
                        <CreateChallenge className="w-full" />
                    </div>
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                </div>
            </Page>
        </>
    );
}
