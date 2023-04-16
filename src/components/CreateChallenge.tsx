'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { Challenge } from '@prisma/client';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

interface Props {
    className?: string;
    challenge?: Challenge;
}

const CreateChallengeSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1 },
        files: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', nullable: true },
        flag: { type: 'string', minLength: 4 },
        category: {
            type: 'string',
            enum: ['WEB', 'CRYPTO', 'REV', 'PWN', 'MISC'],
        },
        difficulty: {
            type: 'string',
            enum: ['EASY', 'MEDIUM', 'HARD'],
        },
        staticPoints: { type: 'integer', nullable: true },
    },
    required: ['name', 'description', 'files', 'flag'],
};

const CreateChallenge = ({ className, challenge }: Props) => {
    const [data, setData] = useState(challenge);

    const [open, setOpen] = useState(false);

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
                <p className="text-white text-4xl">Challenge</p>

                <JsonForms
                    schema={CreateChallengeSchema}
                    data={data}
                    renderers={materialRenderers}
                    cells={materialCells}
                    onChange={({ data }) => setData(data)}
                />

                <Button onClick={submit}>Submit</Button>
            </Modal>
            <Button className={className} onClick={() => setOpen(true)}>
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

export { CreateChallenge, CreateChallengeSchema };
