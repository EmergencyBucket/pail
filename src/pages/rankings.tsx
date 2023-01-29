import Page from '@/components/Page';
import { Team } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Home() {
    const [ranking, setRanking] = useState<
        (Team & {
            points: number;
        })[]
    >();

    async function getRankings() {
        let req = await fetch(`/api/rankings`);

        setRanking(await req.json());
    }

    useEffect(() => {
        getRankings();
    }, []);

    return (
        <>
            <Page>
                {ranking?.map((team) => (
                    <p key={Math.random()} className="text-white text-lg">
                        {team.name + ' - ' + team.points}
                    </p>
                ))}
            </Page>
        </>
    );
}
