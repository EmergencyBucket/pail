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
            <div className="grid gap-4">
                <Button
                    link="admin/challenges"
                    variant={'unstyled'}
                    linkClassName="w-full h-full"
                    className="w-full text-white bg-blue-950 border-2 border-blue-900 hover:border-indigo-900 hover:bg-indigo-950 h-full text-3xl"
                >
                    <code>Challenges</code>
                </Button>
            </div>
            <div className="grid gap-4">
                <Button
                    link="admin/settings"
                    variant={'unstyled'}
                    linkClassName="w-full h-full"
                    className="w-full text-white bg-emerald-950 border-2 border-emerald-900 hover:border-teal-900 hover:bg-teal-950 h-full text-3xl"
                >
                    <code>Settings</code>
                </Button>
            </div>
            <div className="grid gap-4">
                <Button
                    link="admin/hosts"
                    variant={'unstyled'}
                    linkClassName="w-full h-full"
                    className="w-full text-white bg-fuchsia-950 border-2 border-fuchsia-900 hover:border-pink-900 hover:bg-pink-950 h-full text-3xl"
                >
                    <code>Hosts</code>
                </Button>
            </div>
            <div className="w-1/2"></div>
        </div>
    );
}
