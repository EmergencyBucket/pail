import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';

interface Props {
    title?: string;
    children?: React.ReactNode;
}

const Page = ({ title, children }: Props) => {
    async function play() {
        // Initialising the canvas
        let canvas = document.querySelector('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // Setting the width and height of the canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Setting up the letters
        let letters: string | string[] = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
        letters = letters.split('');

        // Setting up the columns
        let fontSize = 10,
            columns = canvas.width / fontSize;

        // Setting up the drops
        let drops: number[] = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Setting up the draw function
        function draw() {
            ctx.fillStyle = 'rgba(17, 24, 39, .1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < drops.length; i++) {
                let text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillStyle = '#0f0';
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                drops[i]++;
                if (drops[i] * fontSize > canvas.height && Math.random() > .999) {
                    drops[i] = 0;
                }
            }
        }

        // Loop the animation
        setInterval(draw, 33);
    }

    useEffect(() => {
        //play();
    }, [])

    return (
        <>
            <Head>
                <title>{'EBucket | ' + title}</title>

                <link rel="icon" type="image/x-icon" href="/bucket.png"></link>
            </Head>
            { //<canvas id='background' className='absolute top-0 left-0 w-screen h-screen -z-10' />
            }
            <div className="w-screen h-screen bg-gray-900 p-8">
                <Navbar />
                {children}
            </div>
        </>
    );
};

export default Page;
