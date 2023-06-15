import { admin } from '@/lib/Middleware';
import { Error } from '@/components/Error';
import prisma from '@/lib/prismadb';
import HostContainer from '@/components/HostContainer';

export const metadata = {
    title: 'EBucket | Admin | Hosts',
};

export default async function Home() {
    if (await admin()) {
        return <Error reason={'You must be an admin to access this page!'} />;
    }

    let hosts = await prisma.host.findMany();

    return (
        <div className="grid sm:grid-cols-4 gap-4 my-4">
            {hosts.map((host) => (
                <HostContainer data={host} key={Math.random()} />
            ))}
            <HostContainer />
        </div>
    );
}
