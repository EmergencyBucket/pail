import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import ContainerDetails from '@/components/containers/ContainerDetails';

export const metadata = {
    title: 'EBucket | Admin | Containers',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let container = await prisma.container.findMany();

    return (
        <div className="grid sm:grid-cols-4 gap-4 my-4">
            {container.map((cont) => (
                <ContainerDetails key={cont.id} container={cont} />
            ))}
        </div>
    );
}
