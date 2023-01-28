import Link from "next/link";

interface Props {
    onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
    children?: React.ReactNode;
    link?: string;
}

const Button  = ({onClick, children, link}: Props) => {

    return (
        <>
            { link ?
                <Link href={link} className="bg-slate-800 text-white p-2 border-4 border-slate-700 hover:border-slate-500">
                    {children}
                </Link>
                :
                <button onClick={onClick} className="bg-slate-800 text-white p-2 border-4 border-slate-700 hover:border-slate-500">
                    {children}
                </button>
            }
        </>
    )
}

export default Button