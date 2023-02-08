import { Challenge } from '@prisma/client';
import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface Props {
    challenge: Challenge;
}

const Challenge = ({ challenge }: Props) => {
    enum Status {
        Unsubmitted,
        Loading,
        Correct,
        Incorrect,
    }

    const [open, setOpen] = useState(false);

    const [status, setStatus] = useState(Status.Unsubmitted);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setStatus(Status.Loading);

        let req = await fetch(`/api/challenges/solve/${challenge.id}`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                flag: event.target.flag.value,
            }),
        });

        setStatus(req.status == 200 ? Status.Correct : Status.Incorrect);
    }

    async function deleteChallenge(
        event: React.MouseEvent<Element, MouseEvent>
    ) {
        event.preventDefault();

        await fetch(`/api/challenges/${challenge.id}`, {
            method: 'DELETE',
        });
    }

    function renderStatus() {
        switch (status) {
            case Status.Unsubmitted: {
                return <></>;
            }
            case Status.Loading: {
                return (
                    <Image
                        src="loading.svg"
                        alt="Loading"
                        className="mx-auto"
                        height={20}
                        width={20}
                    />
                );
            }
            case Status.Correct: {
                return (
                    <Image
                        src="correct.svg"
                        alt="Correct"
                        className="mx-auto"
                        height={20}
                        width={20}
                    />
                );
            }
            case Status.Incorrect: {
                return (
                    <Image
                        src="incorrect.svg"
                        alt="Incorrect"
                        className="mx-auto"
                        height={20}
                        width={20}
                    />
                );
            }
        }
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">{challenge.name}</p>
                <p className="text-white text-2xl">{challenge.category}</p>
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
                <div>
                    {challenge.firstBlood
                        ? 'Solved at: ' + challenge.firstBlood
                        : 'Unsolved'}
                </div>
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
                            {renderStatus()}
                        </div>
                    </div>

                    <br />
                    <input
                        type={'submit'}
                        className={
                            'bg-slate-800 cursor-pointer text-white p border-2 w-full border-slate-700 hover:border-slate-500'
                        }
                    />
                </form>
                <button
                    onClick={deleteChallenge}
                    className="bg-slate-800 cursor-pointer text-red-500 mt-2 border-2 w-full border-slate-700 hover:border-slate-500"
                >
                    Delete
                </button>
            </Modal>
            <Button onClick={() => setOpen(true)}>{challenge.name}</Button>
        </>
    );
};

export default Challenge;
