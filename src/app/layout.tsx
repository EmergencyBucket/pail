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
                <Navbar />
                {children}
            </body>
        </html>
    );
}
