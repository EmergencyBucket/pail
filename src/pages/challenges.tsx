import ChallengeContainer from '@/components/ChallengeContainer';
import Page from '@/components/Page';
import { Challenge } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const [error, setError] = useState<undefined | string>();

    async function getChallenges() {
        let req = await fetch(`/api/challenges`);

        let res = await req.json();

        if (req.status != 200) {
            setError(res.Error);
        }

        setChallenges(res as Challenge[]);
    }

    useEffect(() => {
        getChallenges();
    }, []);

    if (error) {
        return (
            <Page title="Challenges">
                <code className="text-2xl text-red-600">{error}</code>
            </Page>
        );
    }

    return (
        <>
            <Page title="Challenges">
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {challenges &&
                        challenges.map((challenge) => (
                            <ChallengeContainer
                                challenge={challenge}
                                key={Math.random()}
                            />
                        ))}
                </div>
            </Page>
        </>
    );
}
