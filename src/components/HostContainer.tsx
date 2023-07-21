'use client';

import { FormEvent, useRef, useState } from 'react';
import { Button } from './Button';
import Modal from './Modal';
import { Status, Statuses } from './Status';
import { Host } from '@prisma/client';
import { Input } from './Input';

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

        const target = event.target as typeof event.target & {
            port: { value: string };
            remote: { value: string };
            ip: { value: string };
        };

        await fetch(`/api/hosts`, {
            method: data ? 'PATCH' : 'POST',
            body: JSON.stringify({
                port: parseInt(target.port.value),
                remote: target.remote.value,
                ip: target.ip.value,
                ca: ssl.current.ca,
                cert: ssl.current.cert,
                key: ssl.current.key,
            }),
        });
    }

    async function validateSSL(event: FormEvent<HTMLFormElement>) {
        const target = event.target as typeof event.target & {
            files: File[];
            name: string;
        };

        if (!target.files) {
            return;
        }

        setCertStatus(Statuses.Loading);

        let cert = target.files[0];

        let reader = new FileReader();

        reader.readAsText(cert);

        reader.onload = (evt) => {
            switch (target.name) {
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
                <p className="text-white text-4xl py-2">Create a host</p>
                <form
                    onSubmit={submit}
                    onChange={validateSSL}
                    className="grid w-full gap-4"
                >
                    <Input
                        type={'number'}
                        placeholder="Port"
                        name="port"
                        variant={'subtle'}
                        defaultValue={data ? (data.port as number) : undefined}
                    />
                    <Input
                        type={'text'}
                        placeholder="Remote"
                        name="remote"
                        defaultValue={
                            data ? (data.remote as string) : undefined
                        }
                        variant={'subtle'}
                    />
                    <Input
                        type={'text'}
                        placeholder="IP"
                        name="ip"
                        defaultValue={data ? (data.ip as string) : undefined}
                        variant={'subtle'}
                    />
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 rounded-lg w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
                        <label htmlFor="ca" className="m-auto px-2">
                            <code>CA</code>
                        </label>
                        <input name="ca" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 rounded-lg w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
                        <label htmlFor="cert" className="m-auto px-2">
                            <code>Cert</code>
                        </label>
                        <input name="cert" type={'file'} className={'px-2'} />
                    </div>
                    <div className="mx-auto grid grid-cols-3 bg-slate-700 rounded-lg w-full outline-none">
                        <div className="m-auto">
                            <Status status={certStatus} />
                        </div>
                        <label htmlFor="key" className="m-auto px-2">
                            <code>Key</code>
                        </label>
                        <input name="key" type={'file'} className={'px-2'} />
                    </div>
                    <Input type="submit" variant={'subtle'} />
                </form>
            </Modal>
            <Button
                className={className}
                variant={'subtle'}
                onClick={() => setOpen(true)}
            >
                {data ? (
                    data.ip
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

export default HostContainer;
