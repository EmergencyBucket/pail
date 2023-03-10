'use client';

import { Challenge } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Props {
    challenge: Challenge;
    className?: string;
}

const EditChallenge = ({ challenge, className }: Props) => {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await fetch(`/api/challenges`, {
            method: 'PATCH',
            body: JSON.stringify({
                //@ts-ignore
                name: event.target.name.value,
                //@ts-ignore
                description: event.target.description.value,
                //@ts-ignore
                files: event.target.files.value.split(','),
                //@ts-ignore
                flag: event.target.flag.value,
                //@ts-ignore
                category: event.target.category.value,
            }),
        });
    }

    async function deleteChallenge(
        event: React.MouseEvent<Element, MouseEvent>
    ) {
        event.preventDefault();

        setOpen(false);

        await fetch(`/api/challenges/${challenge.id}`, {
            method: 'DELETE',
        });

        router.refresh();
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">Edit challenge</p>
                <form onSubmit={submit}>
                    <input
                        type={'text'}
                        placeholder="Challenge name"
                        name="name"
                        value={challenge.name}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="Challenge description"
                        name="description"
                        value={challenge.description}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <br />
                    <select
                        name="category"
                        value={challenge.category}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    >
                        <option value={'WEB'}>Web</option>
                        <option value={'CRYPTO'}>Crypto</option>
                        <option value={'REV'}>Rev</option>
                        <option value={'PWN'}>Pwn</option>
                        <option value={'MISC'}>Misc</option>
                    </select>
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge files"
                        name="files"
                        value={challenge.files}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge flag"
                        name="flag"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <br />
                    <input
                        type={'submit'}
                        className={
                            'bg-slate-800 cursor-pointer text-white my-2 p border-2 w-full border-slate-700 hover:border-slate-500'
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
            <Button className={className} onClick={() => setOpen(true)}>
                {challenge.name}
            </Button>
        </>
    );
};

export default EditChallenge;
