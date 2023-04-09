import Navbar from '@/components/Navbar';
import '../styles/globals.css';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/x-icon" href="/bucket.png"></link>
            </head>
            <body className="w-full h-full bg-gray-900 p-8">
                <code className="text-white text-3xl text-center">
                    BucketCTF 2023 is OVER. If you are on the top 5 teams create
                    a ticket in our Discord.
                </code>
                {/* @ts-expect-error Server Component */}
                <Navbar />
                {children}
            </body>
        </html>
    );
}
