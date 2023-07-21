import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import { Button } from '@/components/Button';

export const metadata = {
    title: 'EBucket | Admin | Users',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let users = await prisma.user.findMany({
        orderBy: [
            {
                name: 'desc',
            },
        ],
    });

    return (
        <div className="grid sm:grid-cols-4 gap-4 my-4">
            {users.map((user) => (
                <Button
                    className="w-full"
                    variant={'subtle'}
                    link={`users/${user.id}`}
                    key={user.id}
                >
                    <code className="text-lg">{user.name}</code>
                </Button>
            ))}
        </div>
    );
}
