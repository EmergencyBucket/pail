'use client';

import { useEffect } from 'react';
import bucket from '../../public/bucket.json';

const Bucket = () => {
    async function load() {
        let c = document.getElementById('canvas');
        //  @ts-ignore
        let ctx = c.getContext('2d');

        for (let x = 0; x < bucket.length; x++) {
            let sl =
                200 /
                bucket[x].filter((b) => {
                    return b[3];
                }).length;
            for (let y = bucket[x].length - 1; y >= 0; y--) {
                setTimeout(() => {
                    ctx.beginPath();
                    if (bucket[x][y][3]) {
                        ctx.strokeStyle = `#1d1f20`;
                        ctx.lineWidth = '0.5';
                        ctx.rect(x * 5 - 0.5, y * 5 - 0.5, 5, 5);
                    }

                    ctx.fillStyle = `rgba(${bucket[x][y][0]}, ${bucket[x][y][1]}, ${bucket[x][y][2]}, ${bucket[x][y][3]})`;
                    ctx.fillRect(x * 5, y * 5, 4.5, 4.5);
                    ctx.stroke();
                }, sl * y);
            }
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <canvas
            id="canvas"
            className="mx-auto"
            style={{ zIndex: 100 }}
            height={320}
            width={320}
        />
    );
};

export default Bucket;
