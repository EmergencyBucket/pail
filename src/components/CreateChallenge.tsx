'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { Challenge } from '@prisma/client';

interface Props {
    className?: string;
    data?: Challenge;
}

const CreateChallenge = ({ className, data }: Props) => {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            name: { value: string };
            description: { value: string };
            files: { value: string };
            image: { value: string };
            flag: { value: string };
            category: { value: string };
            difficulty: { value: string };
            staticPoints: { value: string };
        };

        setOpen(false);

        await fetch(`/api/challenges/${data ? data.id : ''}`, {
            method: data ? 'PATCH' : 'POST',
            body: JSON.stringify({
                name: target.name.value,
                description: target.description.value,
                files: target.files.value.split(','),
                image: target.image.value,
                flag: target.flag.value,
                category: target.category.value,
                difficulty: target.difficulty.value,
                staticPoints: parseInt(target.staticPoints.value),
            }),
        });

        router.refresh();
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">Challenge</p>
                <form onSubmit={submit}>
                    <input
                        type={'text'}
                        placeholder="Challenge name"
                        name="name"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.name}
                    />
                    <br />
                    <textarea
                        placeholder="Challenge description"
                        name="description"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.description}
                    />
                    <br />
                    <select
                        name="category"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.category}
                    >
                        <option value={'WEB'}>Web</option>
                        <option value={'CRYPTO'}>Crypto</option>
                        <option value={'REV'}>Rev</option>
                        <option value={'PWN'}>Pwn</option>
                        <option value={'MISC'}>Misc</option>
                    </select>
                    <br />
                    <select
                        name="difficulty"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.difficulty}
                    >
                        <option value={'EASY'}>Easy</option>
                        <option value={'MEDIUM'}>Medium</option>
                        <option value={'HARD'}>Hard</option>
                    </select>
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge files"
                        name="files"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.files}
                    />
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge Docker Image"
                        name="image"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.image ?? ''}
                    />
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge flag"
                        name="flag"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.flag}
                    />
                    <br />
                    <input
                        type={'number'}
                        placeholder="Points"
                        name="staticPoints"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                        defaultValue={data?.staticPoints ?? undefined}
                    />
                    <br />
                    <input
                        type={'submit'}
                        className={
                            'bg-slate-800 cursor-pointer text-white my-2 p border-2 w-full border-slate-700 hover:border-slate-500'
                        }
                        value={data ? 'Save' : 'Create'}
                    />
                </form>
            </Modal>
            <Button className={className} onClick={() => setOpen(true)}>
                {data ? (
                    <code>{data!.name}</code>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                )}
            </Button>
        </>
    );
};

export default CreateChallenge;
