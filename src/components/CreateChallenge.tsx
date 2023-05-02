'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './Button';
import Modal from './Modal';
import { Category, Challenge, Difficulty } from '@prisma/client';
import { Input } from './Input';
import { Dropdown } from './Dropdown';
import { Textarea } from './Textarea';

interface Props {
    className?: string;
    challenge?: Challenge;
}

const CreateChallenge = ({ className, challenge }: Props) => {
    const [open, setOpen] = useState(false);

    const [data, setData] = useState<Partial<Challenge>>({});

    const router = useRouter();

    function submit() {
        setOpen(false);

        fetch(`/api/challenges`, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            router.refresh();
        });
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <p className="text-white text-4xl mb-6">Challenge</p>
                <form className="w-full grid gap-4">
                    <Input variant={'subtle'} placeholder="Name" onChange={(e) => setData({...data, name: e.target.value})}></Input>
                    <Textarea placeholder="Description" />
                    <Input variant={'subtle'} placeholder="Files"></Input>
                    <Dropdown
                        items={['Web', 'Crypto', 'Rev', 'Pwn', 'Misc']}
                        onChange={(e) => setData({...data, category: e.target.value as Category})}
                    />
                    <Dropdown
                        items={['Easy', 'Medium', 'Hard']}
                        onChange={(e) => setData({...data, difficulty: e.target.value as Difficulty})}
                    />
                    <Input variant={'subtle'} placeholder="Flag"></Input>
                    <Button variant={'outline'}>Submit</Button>
                </form>
            </Modal>
            <Button
                className={className}
                onClick={() => setOpen(true)}
                variant={'subtle'}
            >
                {challenge ? (
                    <code>{challenge?.name}</code>
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
