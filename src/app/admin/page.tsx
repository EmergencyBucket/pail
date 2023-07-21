import { Error } from '@/components/Error';
import { admin } from '@/lib/Middleware';
import { Button } from '@/components/Button';

export const metadata = {
    title: 'EBucket | Admin',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    return (
        <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-4 h-full">
            <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-red-700 via-purple-700 to-blue-700 p-0.5">
                <Button
                    link="admin/challenges"
                    variant={'ghost'}
                    linkClassName="w-full h-full"
                    className="rounded-2xl w-full text-white bg-slate-800 h-full text-3xl"
                >
                    <code>Challenges</code>
                </Button>
            </div>
            <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-blue-700 via-cyan-700 to-green-700 p-0.5">
                <Button
                    link="admin/settings"
                    variant={'ghost'}
                    linkClassName="w-full h-full"
                    className="rounded-2xl w-full text-white bg-slate-800 h-full text-3xl"
                >
                    <code>Settings</code>
                </Button>
            </div>
            <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-green-700 via-lime-700 to-amber-700 p-0.5">
                <Button
                    link="admin/hosts"
                    variant={'ghost'}
                    linkClassName="w-full h-full"
                    className="rounded-2xl w-full text-white bg-slate-800 h-full text-3xl"
                >
                    <code>Hosts</code>
                </Button>
            </div>
            <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 p-0.5">
                <Button
                    link="admin/teams"
                    variant={'ghost'}
                    linkClassName="w-full h-full"
                    className="rounded-2xl w-full text-white bg-slate-800 h-full text-3xl"
                >
                    <code>Teams</code>
                </Button>
            </div>
            <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-red-700 via-pink-700 to-purple-700 p-0.5">
                <Button
                    link="admin/containers"
                    variant={'ghost'}
                    linkClassName="w-full h-full"
                    className="rounded-2xl w-full text-white bg-slate-800 h-full text-3xl"
                >
                    <code>Containers</code>
                </Button>
            </div>
        </div>
    );
}
