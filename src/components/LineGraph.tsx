'use client';

import { ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';

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
    data: ChartData<'line', number[], string>;
}

export const Graph = ({ options, data }: Props) => {
    return (
        <Line
            className="mx-auto"
            height={400}
            options={options}
            data={data}
        ></Line>
    );
};
