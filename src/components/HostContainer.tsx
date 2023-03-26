'use client';

import { FormEvent, useRef, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { Status, Statuses } from './Status';
import forge from 'node-forge';
import { Host } from '@prisma/client';

let pki = forge.pki;

interface Props {
    className?: string;
    data?: Partial<Host>;
}

const HostContainer = ({ className, data }: Props) => {
    const [open, setOpen] = useState(false);

    const [certStatus, setCertStatus] = useState(Statuses.Loading);

    let ssl = useRef({
        ca: '',
        cert: '',
        key: '',
    });

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await fetch(`/api/hosts`, {
            method: data ? 'PATCH' : 'POST',
            body: JSON.stringify({
                //@ts-ignore
                port: parseInt(event.target.port.value),
                //@ts-ignore
                remote: event.target.remote.value,
                //@ts-ignore
                ip: event.target.remote.ip,
                ca: ssl.current.ca,
                cert: ssl.current.cert,
                key: ssl.current.key,
            }),
        });
    }

    async function validateSSL(event: FormEvent<HTMLFormElement>) {
        //@ts-ignore
        if (!event.target.files) {
            return;
        }

        setCertStatus(Statuses.Loading);

        //@ts-ignore
        let cert = event.target.files[0];

        let reader = new FileReader();

        reader.readAsText(cert);

        reader.onload = (evt) => {
            //@ts-ignore
            switch (event.target.name) {
                case 'ca': {
                    ssl.current.ca = evt.target?.result as string;
                    break;
                }
                case 'cert': {
                    ssl.current.cert = evt.target?.result as string;
                    break;
                }
                case 'key': {
                    ssl.current.key = evt.target?.result as string;
                    break;
                }
            }

            if (!ssl.current.ca) {
                return;
            }

            try {
                pki.createCaStore([ssl.current.ca]);

                if (ssl.current.ca && ssl.current.cert && ssl.current.key) {
                    setCertStatus(Statuses.Correct);
                }
            } catch (e) {
                setCertStatus(Statuses.Incorrect);
            }
        };
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl">Create a host</p>
                <form onSubmit={submit} onChange={validateSSL}>
                    <input
                        type={'number'}
                        placeholder="Port"
                        name="port"
                        value={data ? (data.port as number) : undefined}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <input
                        type={'text'}
                        placeholder="Remote"
                        name="remote"
                        value={data ? (data.remote as string) : undefined}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-2 pl-2 w-full outline-none'
                        }
                    />
                    <input
                        type={'text'}
                        placeholder="IP"
                        name="ip"
                        value={data ? (data.ip as string) : undefined}
                        className={
                            'bg-slate-700 border-2 border-slate-500 focus:border-slate-400 mt-2 pl-2 w-full outline-none'
                        }
                    />
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
                        <label htmlFor="ca" className="m-auto px-2">
                            <code>CA</code>
                        </label>
                        <input name="ca" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
                        <label htmlFor="cert" className="m-auto px-2">
                            <code>Cert</code>
                        </label>
                        <input name="cert" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 border-2 border-slate-500 focus:border-slate-400 my-4 w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
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

export default HostContainer;
