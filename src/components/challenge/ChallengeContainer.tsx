'use client';

import { Challenge, Solve } from '@prisma/client';
import { FormEvent, useState } from 'react';
import { Button } from '../Button';
import Modal from '../Modal';
import { Status, Statuses } from '@/components/Status';
import { useRouter } from 'next/navigation';
import { Input } from '../Input';
import Code from '../Code';
import { DownloadIcon, PowerIcon } from 'lucide-react';
import Markdown from 'marked-react';

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

    const [url, setUrl] = useState('Instance Not Started');

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

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <div className="bg-slate-800 p-2 rounded-sm m-3 text-center overflow-y-scroll h-full">
                    <h1 className="text-2xl font-bold">
                        {challenge.category} / {challenge.name}
                    </h1>
                    <h2 className="text-xl">
                        {challenge.difficulty}&nbsp;
                        <span className="text-sm italic">
                            ({challenge.points}pts / {challenge.solved.length}{' '}
                            solves)
                        </span>
                    </h2>

                    <div className="prose lg:prose-xl prose-invert">
                        <Markdown>{challenge.description}</Markdown>
                    </div>

                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    {challenge.image && (
                        <div className="grid grid-cols-4 gap-2 m-3">
                            <div className="col-span-3">
                                <Code>{url}</Code>
                            </div>
                            <Button
                                onClick={requestContainer}
                                icon={<PowerIcon size={16}></PowerIcon>}
                            >
                                Start
                            </Button>
                        </div>
                    )}
                    <form
                        className="grid grid-cols-4 gap-2 m-3"
                        onSubmit={submit}
                    >
                        <div className="col-span-3">
                            <Input
                                className="w-full"
                                variant={'outline'}
                                name="flag"
                                placeholder="bucket{...}"
                            ></Input>
                        </div>
                        <Status status={status} />
                        <Button variant={'outline'} formAction="submit">
                            Submit Flag
                        </Button>
                    </form>

                    {challenge.files.length > 0 && (
                        <>
                            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                            <h2 className="text-lg font-bold my-2">
                                Attachments
                            </h2>
                        </>
                    )}
                    {challenge.files.map((file) => (
                        <Button
                            key={file}
                            variant="ghost"
                            className="w-full"
                            onClick={() => window.open(file)}
                            icon={<DownloadIcon></DownloadIcon>}
                        >
                            <span className="text-md font-bold">Download</span>
                            &nbsp;
                            <span className="font-mono">
                                {file.substring(file.lastIndexOf('/'))}
                            </span>
                        </Button>
                    ))}
                </div>
            </Modal>
            <Button
                size={'lg'}
                variant={challenge.done ? 'unstyled' : 'subtle'}
                onClick={() => setOpen(true)}
                className={`block h-full py-2 ${
                    challenge.done && 'bg-teal-900 text-slate-100'
                }`}
            >
                <code className="text-xl">{challenge.name}</code>
                <hr />
                <code className="text-lg">
                    {challenge.category +
                        ' - ' +
                        challenge.points +
                        ' - ' +
                        challenge.difficulty +
                        (challenge.done ? ' - ✔️' : '')}
                </code>
            </Button>
        </>
    );
};

export default Challenge;
