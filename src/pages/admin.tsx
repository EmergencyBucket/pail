import Page from '@/components/Page';
import { Challenge } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
    const { data: session } = useSession();

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
                <div className="flex flex-wrap">
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                </div>
            </Page>
        </>
    );
}
