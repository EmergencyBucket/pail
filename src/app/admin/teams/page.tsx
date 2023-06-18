import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { Button } from '@/components/Button';

export const metadata = {
    title: 'EBucket | Admin | Teams',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let teams = await prisma.team.findMany({
        orderBy: [
            {
                name: 'desc',
            },
        ],
    });

    return (
        <div className="grid sm:grid-cols-4 gap-4 my-4">
            {teams.map((team) => (
                <Button
                    className="w-full"
                    variant={'subtle'}
                    link={`teams/${team.id}`}
                    key={team.id}
                >
                    <code className="text-lg">{team.name}</code>
                </Button>
            ))}
        </div>
    );
}
