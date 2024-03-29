import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export const metadata = {
    title: 'EBucket | Admin | Settings',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

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
        {
            key: 'CTF_END_TIME',
            name: 'CTF End Time',
            submit: async (form: FormData) => {
                'use server';

                await prisma.setting.upsert({
                    where: {
                        key: 'CTF_END_TIME',
                    },
                    update: {
                        value: form.get('data')!.toString(),
                    },
                    create: {
                        key: 'CTF_END_TIME',
                        value: form.get('data')!.toString(),
                    },
                });
            },
            datatype: 'datetime-local',
        },
        {
            key: 'DISCORD_TOKEN',
            name: 'Discord Token',
            submit: async (form: FormData) => {
                'use server';

                await prisma.setting.upsert({
                    where: {
                        key: 'DISCORD_TOKEN',
                    },
                    update: {
                        value: form.get('data')!.toString(),
                    },
                    create: {
                        key: 'DISCORD_TOKEN',
                        value: form.get('data')!.toString(),
                    },
                });
            },
            datatype: 'password',
        },
    ];

    return (
        <div className="grid gap-4">
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
                    <Button
                        variant={'subtle'}
                        type="submit"
                        className="cursor-pointer w-full font-mono"
                    >
                        Save
                    </Button>
                </form>
            ))}
        </div>
    );
}
