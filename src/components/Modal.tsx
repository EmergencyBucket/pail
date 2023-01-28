import { useEffect, useState } from "react";
import Button from "./Button";

interface Props {
    visible: boolean;
    children?: React.ReactNode;
}

const Modal = ({ visible, children }: Props) => {

    const [render, setRender] = useState(visible);

    useEffect(() => setRender(visible), [visible]);

    useEffect(() => {
        console.log(render)
    }, [render])

    return (
        <>
            {render ?
                <div className="fixed z-50 overflow-auto flex w-full inset-0">
                    <div className="bg-slate-800 m-auto p-8 text-white relative flex" style={{ maxWidth: '50%', maxHeight: 'calc(100vh - 8rem)' }}>
                        <div className="absolute right-0 top-0 p-4">
                            <Button onClick={() => setRender(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>

                            </Button>
                        </div>
                        <div className="pt-8">
                            {children}
                        </div>
                    </div>
                </div>
                :
                <>
                </>
            }

        </>
    )
}

export default Modal