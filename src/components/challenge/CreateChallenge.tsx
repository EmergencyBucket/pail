'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../Button';
import Modal from '../Modal';
import { Challenge } from '@prisma/client';
import { Input } from '../Input';
import { Dropdown } from '../Dropdown';
import { Textarea } from '../Textarea';
import { createChallenge } from '@/app/api/challenges/actions';

interface Props {
    className?: string;
    challenge?: Challenge;
}

const CreateChallenge = ({ className, challenge }: Props) => {
    const [open, setOpen] = useState(false);

    const [data] = useState<Partial<Challenge>>(challenge ?? {});

    const router = useRouter();

    function submit() {
        setOpen(false);

        if (!challenge) {
            fetch(`/api/challenges`, {
                method: 'POST',
                body: JSON.stringify(data),
            }).then(() => router.refresh());
        } else {
            fetch(`/api/challenges/${challenge.id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }).then(() => router.refresh());
        }
    }

    function deleteChallenge() {
        setOpen(false);

        fetch(`/api/challenges/${challenge!.id}`, { method: 'DELETE' }).then(
            () => router.refresh(),
        );
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl mb-6">Challenge</p>
                <form className="w-full grid gap-4" action={createChallenge}>
                    <Input
                        name="name"
                        variant={'subtle'}
                        placeholder="Name"
                        defaultValue={challenge?.name}
                    ></Input>
                    <Textarea
                        name="description"
                        placeholder="Description"
                        defaultValue={challenge?.description}
                    />
                    <Input
                        name="files"
                        variant={'subtle'}
                        placeholder="Files"
                        defaultValue={challenge?.files}
                    ></Input>
                    <Dropdown
                        name="category"
                        items={['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC']}
                        defaultValue={challenge?.category}
                    />
                    <Dropdown
                        name="difficulty"
                        items={['EASY', 'MEDIUM', 'HARD']}
                        defaultValue={challenge?.difficulty}
                    />
                    <Input
                        name="image"
                        variant={'subtle'}
                        placeholder="Image"
                        defaultValue={challenge?.image ?? ''}
                    ></Input>
                    <Input
                        name="flag"
                        variant={'subtle'}
                        placeholder="Flag"
                        defaultValue={challenge?.flag}
                    ></Input>
                    {challenge ? (
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant={'outline'} onClick={submit}>
                                Save
                            </Button>
                            <Button
                                variant={'destructive'}
                                onClick={deleteChallenge}
                            >
                                Delete
                            </Button>
                        </div>
                    ) : (
                        <Button variant={'outline'}>Submit</Button>
                    )}
                </form>
            </Modal>
            <Button
                className={className + ' block h-full'}
                onClick={() => setOpen(true)}
                variant={'subtle'}
            >
                {challenge ? (
                    <>
                        <code className="text-xl">{challenge.name}</code>
                        <hr />
                        <code className="text-lg">
                            {challenge.category + ' - ' + challenge.difficulty}
                        </code>
                    </>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                )}
            </Button>
        </>
    );
};

export { CreateChallenge };
