import { useEffect, useState } from 'react';
import Button from './Button';

interface Props {
    visible: boolean;
    children?: React.ReactNode;
    onClose?: () => void;
}

const Modal = ({ visible, children, onClose }: Props) => {
    const [render, setRender] = useState(visible);

    useEffect(() => {
        setRender(visible);
    }, [visible]);

    useEffect(() => {
        if (!render && onClose) {
            onClose();
        }
    }, [render]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setRender(false);
        };

        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, []);

    return (
        <>
            {render ? (
                <div
                    className="fixed z-50 overflow-auto flex w-full inset-0"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                >
                    <div
                        className="bg-slate-800 m-auto p-8 text-white relative w-1/4 h-1/2 flex"
                        style={{
                            maxWidth: '50%',
                            maxHeight: 'calc(100vh - 8rem)',
                        }}
                    >
                        <div className="absolute right-0 top-0 p-4">
                            <Button onClick={() => setRender(false)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </Button>
                        </div>
                        <div className="pt-8 w-full">{children}</div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Modal;
