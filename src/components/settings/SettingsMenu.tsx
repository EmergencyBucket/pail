import { Input } from '../Input';
import prisma from '@/lib/prismadb';

export const SettingsMenu = () => {
    const settings = [
        {
            key: 'CTF_START_TIME',
            name: 'CTF Start Time',
            submit: async (form: FormData) => {
                'use server';

                await prisma.setting.upsert({
                    where: {
                        key: 'CTF_START_TIME',
                    },
                    update: {
                        value: form.get('data')!.toString(),
                    },
                    create: {
                        key: 'CTF_START_TIME',
                        value: form.get('data')!.toString(),
                    },
                });
            },
            datatype: 'datetime-local',
        },
    ];

    /*
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

                    const target = e.target as typeof e.target & {
                        value: { value: string };
                        public: { value: string };
                    };

                    let start = new Date(target.value.value);

                    let pub = target.public.value === 'on';

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

                    const target = e.target as typeof e.target & {
                        value: { value: string };
                        public: { value: string };
                    };

                    let end = new Date(target.value.value);

                    let pub = target.public.value === 'on';

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
            {
                key: 'DISCORD_CHANNEL',
                datatype: 'string',
                defaultValue: await (
                    await fetch(`/api/settings/DISCORD_CHANNEL`)
                ).json(),
                onSubmit: (e) => {
                    e.preventDefault();

                    const target = e.target as typeof e.target & {
                        value: { value: string };
                        public: { value: string };
                    };

                    let val = target.value.value;

                    let pub = target.public.value === 'on';

                    saveSetting('DISCORD_CHANNEL', val, pub);
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

    */

    return (
        <>
            <code className="text-white text-2xl text-center">Settings</code>
            {settings.map((setting) => (
                <form
                    action={setting.submit}
                    key={setting.key}
                    className="p-2 rounded-lg bg-slate-800 grid grid-cols-4 place-items-center"
                >
                    <label htmlFor="public" className="text-white font-mono">
                        {setting.name}
                    </label>
                    <Input
                        name="data"
                        variant={'subtle'}
                        type={setting.datatype}
                    />
                    <div className="grid grid-cols-2">
                        <label
                            htmlFor="public"
                            className="text-white font-mono my-auto"
                        >
                            Public
                        </label>
                        <Input
                            name="public"
                            variant={'subtle'}
                            type="checkbox"
                            className="w-5 h-5 m-auto"
                        />
                    </div>
                    <Input
                        variant={'subtle'}
                        type="submit"
                        className="cursor-pointer w-full"
                    />
                </form>
            ))}
        </>
    );
};
