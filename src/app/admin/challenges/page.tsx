import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { CreateChallenge } from '@/components/challenge/CreateChallenge';

export const metadata = {
    title: 'EBucket | Admin | Challenges',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let challenges = await prisma.challenge.findMany();

    return (
        <div className="grid sm:grid-cols-4 gap-4 my-4">
            {challenges.map((chall) => (
                <CreateChallenge challenge={chall} key={Math.random()} />
            ))}
            <CreateChallenge />
        </div>
    );
}
