import Bucket from '@/components/Bucket';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'EBucket | Home',
};

export default function Home() {
    return (
        <>
            <Bucket />
            <h1 className="text-4xl sm:text-6xl font-bold mx-auto text-center text-white">
                BucketCTF<i>[2023]</i>
            </h1>

            <div className="grid mt-6 gap-2">
                <code className="text-white text-center text-lg mb-2 hidden sm:block">
                    Welcome to Emergency Bucket&apos;s inaugural Capture The
                    Flag competition. Bucket CTF will be an online,
                    jeopardy-style CTF, and we&apos;ll have a plethora of info
                    security challenges. Our challenge categories include web
                    exploitation (web), cryptography (crypto), reverse
                    engineering (rev), binary exploitation (pwn), and
                    miscellaneous other categories (misc). Team sizes are capped
                    at 4 members.
                </code>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 sm:w-1/4 mx-auto">
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://ctftime.org/event/1892'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-red-700 via-pink-700 to-white p-0.5">
                            <div>
                                <Image
                                    src="/ctftime.svg"
                                    alt="CTF Time"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl"
                                />
                            </div>
                        </div>
                    </Link>
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://discord.gg/JFbB4ZAPEu'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-sky-600 via-emerald-500 to-blue-700 p-0.5">
                            <div>
                                <Image
                                    src="/discord.svg"
                                    alt="Our Discord"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl bg-gray-900 p-3"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
                <code className="text-white text-4xl text-center mx-auto">
                    Prizes
                </code>
                <code className="text-white text-xl text-center mx-auto">
                    🥇 - $350 and $1250 in DO Credits
                </code>
                <code className="text-white text-xl text-center mx-auto">
                    🥈 - $200 and $500 in DO Credits
                </code>
                <code className="text-white text-xl text-center mx-auto">
                    🥉 - $150 and $250 in DO Credits
                </code>
                <br />
                <code className="text-white text-3xl text-center mx-auto">
                    Sponsors!
                </code>
                <div className="grid sm:grid-cols-4 sm:w-1/2 gap-4 sm:gap-0 mx-auto mb-6 sm:mb-0">
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://fyrehost.net'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-red-700 via-purple-700 to-blue-700 p-0.5">
                            <div>
                                <Image
                                    src="/sponsors/fyrehost.png"
                                    alt="FyreHost Development"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl"
                                />
                            </div>
                        </div>
                    </Link>
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://www.asteralabs.com/'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-zinc-200 via-cyan-500 to-blue-700 p-0.5">
                            <div>
                                <Image
                                    src="/sponsors/asteralabs.png"
                                    alt="Astera Labs"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl bg-white p-2"
                                />
                            </div>
                        </div>
                    </Link>
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://www.diodes.com/'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-zinc-200 via-cyan-500 to-blue-700 p-0.5">
                            <div>
                                <Image
                                    src="/sponsors/diodes.webp"
                                    alt="Diodes Incorporated"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl bg-white p-2"
                                />
                            </div>
                        </div>
                    </Link>
                    <Link
                        target={'_blank'}
                        className="mx-auto"
                        href={'https://do.co/studenthackathon'}
                    >
                        <div className="shadow-2xl shadow-indigo-500 rounded-2xl bg-gradient-to-r from-zinc-200 via-cyan-500 to-blue-700 p-0.5">
                            <div>
                                <Image
                                    src="/sponsors/digitalocean.png"
                                    alt="DigitalOcean"
                                    width={200}
                                    height={750}
                                    className="rounded-2xl bg-white p-2 py-4"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
