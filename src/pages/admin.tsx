import CreateChallenge from '@/components/CreateChallenge';
import EditChallenge from '@/components/EditChallenge';
import Page from '@/components/Page';
import { Status, Statuses } from '@/components/Status';
import { Challenge } from '@prisma/client';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function Home() {
    const [challenges, setChallenges] = useState<Challenge[]>();

    async function getChallenges() {
        let req = await fetch(`/api/challenges`, {
            method: 'GET',
        });

        let res = await req.json();

        setChallenges(res);
    }

    async function saveSetting(key: string, value: string) {
        ReactDOM.render(
            <Status status={Statuses.Loading} />,
            document.getElementById(key)
        );

        let req = await fetch(`/api/settings`, {
            method: 'POST',
            body: JSON.stringify({
                key: key,
                value: value,
            }),
        });

        if (req.status == 200 || req.status == 201) {
            ReactDOM.render(
                <Status status={Statuses.Correct} />,
                document.getElementById(key)
            );
        } else {
            ReactDOM.render(
                <Status status={Statuses.Incorrect} />,
                document.getElementById(key)
            );
        }
    }

    useEffect(() => {
        getChallenges();
    }, []);

    return (
        <>
            <Page title="Admin">
                <div className="mt-4 flex flex-wrap">
                    <div className="w-1/2 grid gap-4 px-2 h-min">
                        <code className="text-white text-2xl text-center">
                            Challenges
                        </code>
                        {challenges?.map((challenge) => (
                            <EditChallenge
                                className="w-full"
                                challenge={challenge}
                                key={Math.random()}
                            />
                        ))}
                        <CreateChallenge className="w-full" />
                    </div>
                    <div className="w-1/2 grid gap-4 px-2 h-min">
                        <code className="text-white text-2xl text-center">
                            Settings
                        </code>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                //@ts-ignore
                                let start = new Date(e.target.value.value);

                                saveSetting('CTF_START_TIME', start.getTime()+'');
                            }}
                            className="bg-slate-800 text-white p-2 border-4 border-slate-700 flex"
                        >
                            <code className="text-white text-lg mx-auto text-center">
                                CTF_START_TIME
                            </code>
                            <input type={'datetime-local'} name='value' className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 outline-none mx-auto" />
                            <button
                                id={'CTF_START_TIME'}
                                type={'submit'}
                                className={
                                    'bg-slate-800 cursor-pointer text-white mx-auto border-2 border-slate-700 hover:border-slate-500 px-6'
                                }
                            >
                                Save
                            </button>
                        </form>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                //@ts-ignore
                                let end = new Date(e.target.value.value);

                                saveSetting('CTF_END_TIME', end.getTime()+'');
                            }}
                            className="bg-slate-800 text-white p-2 border-4 border-slate-700 flex"
                        >
                            <code className="text-white text-lg mx-auto text-center">
                                CTF_END_TIME
                            </code>
                            <input type={'datetime-local'} name='value' className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 outline-none mx-auto" />
                            <button
                                id={'CTF_END_TIME'}
                                type={'submit'}
                                className={
                                    'bg-slate-800 cursor-pointer text-white mx-auto border-2 border-slate-700 hover:border-slate-500 px-6'
                                }
                            >
                                Save
                            </button>
                        </form>
                    </div>
                    <div className="w-1/2"></div>
                    <div className="w-1/2"></div>
                </div>
            </Page>
        </>
    );
}
