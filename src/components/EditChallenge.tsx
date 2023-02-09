import { Challenge } from '@prisma/client';
import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Props {
    challenge: Challenge;
    className?: string;
}

const EditChallenge = ({ challenge, className }: Props) => {
    const [open, setOpen] = useState(false);

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
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="Challenge description"
                        name="description"
                        value={challenge.description}
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <select
                        name="category"
                        value={challenge.category}
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
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
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <input
                        type={'text'}
                        placeholder="Challenge flag"
                        name="flag"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
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
            </Modal>
            <Button className={className} onClick={() => setOpen(true)}>
                {challenge.name}
            </Button>
        </>
    );
};

export default EditChallenge;
