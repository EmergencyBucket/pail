import { Container } from '@prisma/client';
import prisma from '@/lib/prismadb';
import Dockerode from 'dockerode';
import { Button } from '../Button';

interface Props {
    container: Container;
}

const ContainerDetails = async ({ container }: Props) => {
    let host = await prisma.host.findUnique({
        where: {
            id: container.hostId,
        },
    });

    let docker = new Dockerode({
        host: host!.remote,
        port: host!.port ?? 2375,
        ca: host!.ca!,
        cert: host!.cert!,
        key: host!.key!,
    });

    let dockerContainer = docker.getContainer(container.id);

    let stats = await dockerContainer.stats();

    async function stopAndRemove() {
        'use server';

        await dockerContainer.kill();
        await dockerContainer.remove();

        await prisma.container.delete({
            where: {
                id: dockerContainer.id,
            },
        });
    }

    return (
        <div className="rounded-lg bg-slate-700 ring-1 ring-slate-800">
            <code>CPU: {stats.cpu_stats.cpu_usage.percpu_usage}</code>
            <code>RAM: {stats.memory_stats.commitbytes}</code>
            <Button formAction={stopAndRemove}>Stop and Remove</Button>
        </div>
    );
};

export default ContainerDetails;
