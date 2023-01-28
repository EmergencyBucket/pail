import { Challenge } from "@prisma/client";
import { FormEvent, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import ReactMarkdown from 'react-markdown';

interface Props {
    challenge: Challenge;
}

const Challenge = ({ challenge }: Props) => {

    const [open, setOpen] = useState(false)

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let req = await fetch(`/api/challenges/solve/${challenge.id}`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                flag: event.target.flag.value
            })
        })

        let res = await req.json();
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                {challenge.name}
                <ReactMarkdown>
                    {challenge.description}
                </ReactMarkdown>
                <form onSubmit={submit}>
                    <input type={'text'} placeholder="Flag" name="flag" className={'pl-2 bg-slate-700 border-2 border-slate-500 my-2'} />
                    <br />
                    <input type={'submit'} className={'bg-slate-800 cursor-pointer text-white p border-2 w-full border-slate-700 hover:border-slate-500'} />
                </form>
            </Modal>
            <Button onClick={() => setOpen(true)}>
                {challenge.name}
            </Button>
        </>
    )
}

export default Challenge