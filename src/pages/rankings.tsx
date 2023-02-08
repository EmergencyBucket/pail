import Page from '@/components/Page';
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
    ChartData,
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
        {
            label: string;
            id: string;
            data: number[];
        }[]
    >();



    const data: ChartData<'bar', number[], string> = {
        labels: ['points'],
        datasets: ranking ?? [],

    };

    const options = {
        responsive: true,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        scales: {
            y: {
                grid: {
                    color: '#FFFFFF'
                },
                title: {
                    display: true,
                    text: "Points",
                    color: "white",
                    font: {
                        size: 24,
                    }
                }
            }
        }
    }

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
                <div className="flex w-full">
                    <div className="w-1/2">
                        {ranking &&
                            ranking.map((team) => (
                                <div className='bg-slate-700 m-1 rounded-lg text-center'>
                                    <code
                                        key={Math.random()}
                                        className="text-white text-lg"
                                    >
                                        {team.label + ' - ' + team.data[0]}
                                    </code>
                                </div>
                            ))}
                    </div>
                    <div className="w-1/2">
                        <Bar className='mx-auto' height={100} width={200} options={options} data={data}></Bar>
                    </div>
                </div>
            </Page>
        </>
    );
}
