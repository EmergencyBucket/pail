'use client';

import { ChartData, ChartOptions } from 'chart.js';
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

interface Props {
    options: any;
    data: ChartData<'bar', number[], string>;
}

export const Graph = ({ options, data }: Props) => {
    return (
        <Bar
            className="mx-auto"
            height={400}
            options={options}
            data={data}
        ></Bar>
    );
};
