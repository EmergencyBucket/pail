'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../Button';
import Modal from '../Modal';
import { Category, Challenge, Difficulty } from '@prisma/client';
import { Input } from '../Input';
import { Dropdown } from '../Dropdown';
import { Textarea } from '../Textarea';

interface Props {
    className?: string;
    challenge?: Challenge;
}

const CreateChallenge = ({ className, challenge }: Props) => {
    const [open, setOpen] = useState(false);

    const [data, setData] = useState<Partial<Challenge>>(challenge ?? {});

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
            () => router.refresh()
        );
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl mb-6">Challenge</p>
                <div className="w-full grid gap-4">
                    <Input
                        variant={'subtle'}
                        placeholder="Name"
                        defaultValue={challenge?.name}
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                    ></Input>
                    <Textarea
                        placeholder="Description"
                        defaultValue={challenge?.description}
                        onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                        }
                    />
                    <Input
                        variant={'subtle'}
                        placeholder="Files"
                        defaultValue={challenge?.files}
                        onChange={(e) =>
                            setData({
                                ...data,
                                files: e.target.value.split(','),
                            })
                        }
                    ></Input>
                    <Dropdown
                        items={['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC']}
                        defaultValue={challenge?.category}
                        onChange={(e) =>
                            setData({
                                ...data,
                                category: e.target.value as Category,
                            })
                        }
                    />
                    <Dropdown
                        items={['Easy', 'Medium', 'Hard']}
                        defaultValue={challenge?.difficulty}
                        onChange={(e) =>
                            setData({
                                ...data,
                                difficulty: e.target.value as Difficulty,
                            })
                        }
                    />
                    <Input
                        variant={'subtle'}
                        placeholder="Flag"
                        defaultValue={challenge?.flag}
                        onChange={(e) =>
                            setData({ ...data, flag: e.target.value })
                        }
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
                        <Button variant={'outline'} onClick={submit}>
                            Submit
                        </Button>
                    )}
                </div>
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
