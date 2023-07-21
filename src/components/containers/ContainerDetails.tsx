import { Container } from '@prisma/client';
import prisma from '@/lib/prismadb';
import Dockerode from 'dockerode';
import { Button } from '../Button';
import { User } from 'lucide-react';

interface Props {
    container: Container;
}

const ContainerDetails = async ({ container }: Props) => {
    //let stats = await dockerContainer.stats();

    let user = await prisma.user.findUnique({
        where: {
            id: container.userId,
        },
    });

    async function stopAndRemove() {
        'use server';

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

        await dockerContainer.kill();
        await dockerContainer.remove();

        await prisma.container.delete({
            where: {
                id: dockerContainer.id,
            },
        });
    }

    return (
        <div className="p-2 rounded-lg bg-slate-800 grid grid-cols-2 place-items-center">
            <div className="flex">
                <User className="text-white" />
                <code className="text-white">{user!.name}</code>
            </div>
            <form action={stopAndRemove}>
                <Button
                    type="submit"
                    variant={'destructive'}
                    className="font-mono"
                >
                    Stop
                </Button>
            </form>
        </div>
    );
};

export default ContainerDetails;
