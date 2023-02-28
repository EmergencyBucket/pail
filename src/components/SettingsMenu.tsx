'use client';

import { FormEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Status, Statuses } from '@/components/Status';

interface SettingForm {
    key: string;
    defaultValue: {
        value: string;
        public: boolean;
    };
    datatype: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    transformData?: (input: string) => string;
}

export const SettingsMenu = () => {
    const [settings, setSettings] = useState<SettingForm[]>([]);

    async function getSettings() {
        setSettings([
            {
                key: 'CTF_START_TIME',
                datatype: 'datetime-local',
                defaultValue: await (
                    await fetch(`/api/settings/CTF_START_TIME`)
                ).json(),
                onSubmit: (e) => {
                    e.preventDefault();
                    //@ts-ignore
                    let start = new Date(e.target.value.value);
                    //@ts-ignore
                    let pub = e.target.public.value === 'on';

                    saveSetting('CTF_START_TIME', start.getTime() + '', pub);
                },
                transformData: (input) => {
                    if (!input) {
                        return '';
                    }

                    return new Date(parseInt(input))
                        .toISOString()
                        .substring(
                            0,
                            new Date(parseInt(input)).toISOString().length - 1
                        );
                },
            },
            {
                key: 'CTF_END_TIME',
                datatype: 'datetime-local',
                defaultValue: await (
                    await fetch(`/api/settings/CTF_END_TIME`)
                ).json(),
                onSubmit: (e) => {
                    e.preventDefault();
                    //@ts-ignore
                    let end = new Date(e.target.value.value);
                    //@ts-ignore
                    let pub = e.target.public.value === 'on';

                    saveSetting('CTF_END_TIME', end.getTime() + '', pub);
                },
                transformData: (input) => {
                    if (!input) {
                        return '';
                    }

                    return new Date(parseInt(input))
                        .toISOString()
                        .substring(
                            0,
                            new Date(parseInt(input)).toISOString().length - 1
                        );
                },
            },
        ]);
    }

    async function saveSetting(key: string, value: string, pub = false) {
        ReactDOM.render(
            <Status status={Statuses.Loading} />,
            document.getElementById(key)
        );

        let req = await fetch(`/api/settings`, {
            method: 'POST',
            body: JSON.stringify({
                key: key,
                value: value,
                pub: pub,
            }),
        });

        if (req.status == 200 || req.status == 201) {
            ReactDOM.render(
                <Status status={Statuses.Correct} />,
                document.getElementById(key)
            );
        } else {
            ReactDOM.render(
                <Status status={Statuses.Incorrect} />,
                document.getElementById(key)
            );
        }
    }

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <>
            <code className="text-white text-2xl text-center">Settings</code>
            {settings.map((setting) => (
                <form
                    onSubmit={setting.onSubmit}
                    key={setting.key}
                    className="bg-slate-800 text-white p-2 border-4 border-slate-700 flex"
                >
                    <code className="text-white text-lg mx-auto text-center">
                        {setting.key}
                    </code>
                    <label htmlFor="public" className="mr-2 my-auto">
                        <code>Public</code>
                    </label>
                    <input
                        defaultChecked={setting.defaultValue.public}
                        type={'checkbox'}
                        name="public"
                    />
                    <input
                        type={setting.datatype}
                        defaultValue={
                            setting.transformData
                                ? setting.transformData(
                                      setting.defaultValue.value
                                  )
                                : setting.defaultValue.value
                        }
                        name="value"
                        className="bg-slate-700 border-2 border-slate-500 focus:border-slate-400 outline-none mx-auto px-2"
                    />
                    <button
                        id={setting.key}
                        type={'submit'}
                        className={
                            'bg-slate-800 cursor-pointer text-white mx-auto border-2 border-slate-700 hover:border-slate-500 px-6'
                        }
                    >
                        Save
                    </button>
                </form>
            ))}
        </>
    );
};
