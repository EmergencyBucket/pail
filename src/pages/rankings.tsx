import Page from '@/components/Page';
import { Team } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Home() {
    const [ranking, setRanking] = useState<
        (Team & {
            points: number;
        })[]
    >();

    const data = {
        labels: ['test'],
        datasets: [
            {
                label: 'testlabel',
                data: [1],
            },
        ],
    };

    async function getRankings() {
        let req = await fetch(`/api/rankings`);

        setRanking(await req.json());
    }

    useEffect(() => {
        getRankings();
    }, []);

    return (
        <>
            <Page title="Rankings">
                {ranking?.map((team) => (
                    <p key={Math.random()} className="text-white text-lg">
                        {team.name + ' - ' + team.points}
                    </p>
                ))}
                <Bar data={data}></Bar>
            </Page>
        </>
    );
}
