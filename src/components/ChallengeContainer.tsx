'use client';

import { Challenge, Solve } from '@prisma/client';
import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import ReactMarkdown from 'react-markdown';
import { Status, Statuses } from '@/components/Status';
import { useRouter } from 'next/navigation';

interface Props {
    challenge: Omit<
        Challenge & {
            points: number;
            solved: Solve[];
            done: boolean;
        },
        'flag'
    >;
}

const Challenge = ({ challenge }: Props) => {
    const [open, setOpen] = useState(false);

    const [status, setStatus] = useState(Statuses.Unsubmitted);

    const [url, setUrl] = useState('Start Container');

    const router = useRouter();

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setStatus(Statuses.Loading);

        const target = event.target as typeof event.target & {
            flag: { value: string };
        };

        let req = await fetch(`/api/challenges/solve/${challenge.id}`, {
            method: 'POST',
            body: JSON.stringify({
                flag: target.flag.value,
            }),
        });

        setStatus(req.status == 200 ? Statuses.Correct : Statuses.Incorrect);

        setTimeout(() => {
            router.refresh();
        }, 500);
    }

    async function requestContainer(event: FormEvent) {
        event.preventDefault();

        setUrl('Loading');

        let req = await fetch(`/api/challenges/host/${challenge.id}`, {
            method: 'POST',
        });

        let res = await req.json();

        if (req.ok) {
            setUrl(res.url);
        } else {
            alert('You are on a 60 second cooldown for hosting instances.');
        }
    }

    function getStatus() {
        switch (url) {
            case 'Start Container': {
                return Statuses.Unsubmitted;
            }
            case 'Loading': {
                return Statuses.Loading;
            }
            default: {
                return Statuses.Correct;
            }
        }
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <div className="text-center w-full">
                    <code className="text-white text-4xl">
                        {challenge.name}
                    </code>
                    <div className="flex text-center">
                        <code className="text-white text-2xl w-full">
                            {challenge.category}
                        </code>
                        <p className="text-white text-2xl w-full">
                            {challenge.difficulty}
                        </p>
                        <p className="text-white text-2xl w-full">
                            {challenge.solved.length + ' Solves'}
                        </p>
                    </div>
                    <ReactMarkdown>{challenge.description}</ReactMarkdown>
                    <div>
                        {challenge.files.map((file) => (
                            <a
                                href={file}
                                key={Math.random()}
                                target="_blank"
                                className="flex text-blue-600 text-sm p-2 bg-slate-700 gap my-2"
                                rel="noreferrer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                </svg>
                                {file}
                            </a>
                        ))}
                    </div>
                    {challenge.image && (
                        <>
                            <div className="flex">
                                <button
                                    onClick={
                                        url === 'Start Container'
                                            ? requestContainer
                                            : () => {
                                                  navigator.clipboard.writeText(
                                                      url
                                                  );
                                                  alert('Copied!');
                                              }
                                    }
                                    className="pl-2 bg-slate-700 focus:border-slate-400 focus:outline-none border-2 border-slate-500 my-2 w-full"
                                >
                                    {url}
                                </button>
                                <div className="bg-slate-700 border-2 border-slate-500 my-2 w-8 flex place-items-center">
                                    {<Status status={getStatus()} />}
                                </div>
                            </div>
                        </>
                    )}
                    <form onSubmit={submit}>
                        <div className="flex">
                            <input
                                type={'text'}
                                placeholder="Flag"
                                name="flag"
                                className={
                                    'pl-2 bg-slate-700 focus:border-slate-400 focus:outline-none border-2 border-slate-500 my-2 w-full'
                                }
                            />
                            <div className="bg-slate-700 border-2 border-slate-500 my-2 w-8 flex place-items-center">
                                {<Status status={status} />}
                            </div>
                        </div>
                        <input
                            type={'submit'}
                            className={
                                'bg-slate-800 cursor-pointer text-white p border-2 w-full border-slate-700 hover:border-slate-500'
                            }
                        />
                    </form>
                </div>
            </Modal>
            <Button onClick={() => setOpen(true)}>
                {challenge.category +
                    ' - ' +
                    challenge.name +
                    ' - ' +
                    challenge.points +
                    ' - ' +
                    challenge.difficulty +
                    (challenge.done ? ' - ✔️' : '')}
            </Button>
        </>
    );
};

export default Challenge;
