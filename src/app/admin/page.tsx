import CreateChallenge from '@/components/CreateChallenge';
import EditChallenge from '@/components/EditChallenge';
import HostContainer from '@/components/HostContainer';
import { SettingsMenu } from '@/components/SettingsMenu';
import { admin } from '@/lib/Middleware';
import prisma from '@/lib/prismadb';

export const metadata = {
    title: 'EBucket | Admin',
};

export default async function Home() {
    if (await admin()) {
        return (
            <code className="text-white text-2xl">
                You must be an admin to access this page.
            </code>
        );
    }

    let challenges = await prisma.challenge.findMany();

    let hosts = await prisma.host.findMany();

    return (
        <div className="mt-4 flex flex-wrap">
            <div className="w-1/2 grid gap-4 px-2 h-min">
                <code className="text-white text-2xl text-center">
                    Challenges
                </code>
                {challenges.map((challenge) => (
                    <EditChallenge
                        className="w-full"
                        challenge={challenge}
                        key={Math.random()}
                    />
                ))}
                <CreateChallenge className="w-full" />
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
