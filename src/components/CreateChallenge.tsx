import { FormEvent } from "react";
import Modal from "./Modal"

const CreateChallenge = () => {

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
        <Modal visible={true}>
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
    )
}

export default CreateChallenge