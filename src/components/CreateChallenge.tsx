import { FormEvent, useState } from "react";
import Button from "./Button";
import Modal from "./Modal"

const CreateChallenge = () => {

    const [open, setOpen] = useState(false)

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let req = await fetch(`/api/challenges`, {
            method: 'POST',
            body: JSON.stringify({
                //@ts-ignore
                name: event.target.name.value,
                //@ts-ignore
                description: event.target.description.value,
                //@ts-ignore
                files: event.target.files.value.split(","),
                //@ts-ignore
                flag: event.target.flag.value
            })
        })

        let res = await req.json();

        console.log(res)
    }

    return (
        <>
            <Modal visible={open} onClose={() => setOpen(false)}>
                <form onSubmit={submit}>
                    <input type={'text'} placeholder='Challenge name' name='name' className='bg-slate-700 border-2 border-slate-500 my-2' />
                    <br />
                    <input type={'text'} placeholder='Challenge description' name='description' className='bg-slate-700 border-2 border-slate-500 my-2' />
                    <br />
                    <input type={'text'} placeholder='Challenge files' name='files' className='bg-slate-700 border-2 border-slate-500 my-2' />
                    <br />
                    <input type={'text'} placeholder='Challenge flag' name='flag' className='bg-slate-700 border-2 border-slate-500 my-2' />
                    <br />
                    <input className="text-white" type={'submit'} />
                </form>
            </Modal>
            <Button onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Button>
        </>
    )
}

export default CreateChallenge