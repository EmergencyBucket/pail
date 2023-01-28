import Navbar from "./Navbar";

interface Props {
    children?: React.ReactNode;
}

const Page = ({ children }: Props) => {
    return (
        <div className='w-screen h-screen bg-gray-900 p-8'>
            <Navbar />
            {children}
        </div>
    )
}

export default Page