import HostContainer from '@/components/HostContainer';
import { SettingsMenu } from '@/components/settings/SettingsMenu';
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
        <div className="mt-4 flex flex-wrap h-full">
            <div className="w-1/2 grid gap-4 px-2 h-1/2">
                <Button
                    link="admin/challenges"
                    variant={'unstyled'}
                    className="text-white bg-blue-950 border-2 border-blue-900 hover:border-indigo-900 hover:bg-indigo-950 h-full"
                >
                    Challenges
                </Button>
            </div>
            <div className="w-1/2 grid gap-4 px-2 h-min">
                <SettingsMenu />
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
