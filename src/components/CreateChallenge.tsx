import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Props {
    className?: string;
}

const CreateChallenge = ({className}: Props) => {
    const [open, setOpen] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await fetch(`/api/challenges`, {
            method: 'POST',
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
                //@ts-ignore
                difficulty: event.target.difficulty.value,
            }),
        });
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">Create a challenge</p>
                <form onSubmit={submit}>
                    <input
                        type={'text'}
                        placeholder="Challenge name"
                        name="name"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="Challenge description"
                        name="description"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <select
                        name="category"
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
                    <select
                        name="difficulty"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
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
            </Button>
        </>
    );
};

export default CreateChallenge;
