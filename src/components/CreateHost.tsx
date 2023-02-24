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
                port: parseInt(event.target.port.value),
                //@ts-ignore
                remote: event.target.remote.value,
                //@ts-ignore
                ip: event.target.remote.ip,
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
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <input
                        type={'text'}
                        placeholder="Remote"
                        name="remote"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <input
                        type={'text'}
                        placeholder="IP"
                        name="ip"
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 mt-2 pl-2 w-full outline-none'
                        }
                    />
                    <div className="mx-auto grid grid-cols-2 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <label htmlFor="ca" className="m-auto px-2">
                            <code>CA</code>
                        </label>
                        <input name="ca" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-2 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <label htmlFor="cert" className="m-auto px-2">
                            <code>Cert</code>
                        </label>
                        <input name="cert" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-2 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <label htmlFor="key" className="m-auto px-2">
                            <code>Key</code>
                        </label>
                        <input name="key" type={'file'} className={'px-2'} />
                    </div>
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
