import Head from 'next/head';
import Navbar from './Navbar';

interface Props {
    title?: string;
    children?: React.ReactNode;
}

const Page = ({ title, children }: Props) => {
    return (
        <>
            <Head>
                <title>{'EBucket | ' + title}</title>
            </Head>
            <div className="w-screen h-screen bg-gray-900 p-8">
                <Navbar />
                {children}
            </div>
        </>
    );
};

export default Page;
