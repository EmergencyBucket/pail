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

                <link rel="icon" type="image/x-icon" href="/bucket.png"></link>
            </Head>
            <div className="w-screen h-screen bg-gray-900 p-8">
                {children}
            </div>
        </>
    );
};

export default Page;
