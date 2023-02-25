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
            <body className="w-screen h-screen bg-gray-900 p-8">
                {/* @ts-expect-error Server Component */}
                <Navbar />
                {children}
            </body>
        </html>
    );
}
