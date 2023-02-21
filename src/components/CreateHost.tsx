import { FormEvent, useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Props {
    className?: string;
}

const CreateHost = ({ className }: Props) => {
    const [open, setOpen] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await fetch(`/api/hosts`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                port: event.target.port.value,
                //@ts-ignore
                remote: event.target.remote.value,
                //@ts-ignore
                ca: event.target.ca.value,
                //@ts-ignore
                cert: event.target.cert.value,
                //@ts-ignore
                key: event.target.key.value,
            }),
        });
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">Create a host</p>
                <form onSubmit={submit}>
                    <input
                        type={'number'}
                        placeholder="Port"
                        name="port"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <input
                        type={'text'}
                        placeholder="Remote"
                        name="remote"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="CA"
                        name="ca"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="Cert"
                        name="cert"
                        className={
                            'bg-slate-700 border-2 border-slate-500 my-2 pl-2 w-full'
                        }
                    />
                    <br />
                    <textarea
                        placeholder="Key"
                        name="key"
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

export default CreateHost;
