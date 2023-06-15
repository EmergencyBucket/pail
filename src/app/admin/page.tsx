import HostContainer from '@/components/HostContainer';
import { Error } from '@/components/Error';
import { admin } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';
import { Button } from '@/components/Button';

export const metadata = {
    title: 'EBucket | Admin',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let hosts = await prisma.host.findMany();

    return (
        <div className="mt-4 grid grid-cols-2 grid-rows-2 h-full">
            <div className="grid gap-4 pr-2">
                <Button
                    link="admin/challenges"
                    variant={'unstyled'}
                    linkClassName="w-full h-full"
                    className="w-full text-white bg-blue-950 border-2 border-blue-900 hover:border-indigo-900 hover:bg-indigo-950 h-full text-3xl"
                >
                    <code>Challenges</code>
                </Button>
            </div>
            <div className="grid gap-4 px-2">
                <Button
                    link="admin/settings"
                    variant={'unstyled'}
                    linkClassName="w-full h-full"
                    className="w-full text-white bg-emerald-950 border-2 border-emerald-900 hover:border-teal-900 hover:bg-teal-950 h-full text-3xl"
                >
                    <code>Settings</code>
                </Button>
            </div>
            <div className="w-1/2 grid gap-4 px-2 h-min">
                <code className="text-white text-2xl text-center">Hosts</code>
                {hosts.map((host) => (
                    <HostContainer data={host} key={Math.random()} />
                ))}
                <HostContainer />
            </div>
            <div className="w-1/2"></div>
        </div>
    );
}
