import CreateChallenge from '@/components/CreateChallenge';
import CreateHost from '@/components/CreateHost';
import EditChallenge from '@/components/EditChallenge';
import { SettingsMenu } from '@/components/SettingsMenu';
import { PrismaClient } from '@prisma/client';

export const metadata = {
    title: 'EBucket | Admin',
};

const prisma = new PrismaClient();

export default async function Home() {
    let challenges = await prisma.challenge.findMany();

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
                <CreateHost />
            </div>
            <div className="w-1/2"></div>
        </div>
    );
}
