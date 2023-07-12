'use client';

import React, { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';

// Define an interface for the component's props
interface CodeProps {
    children: React.ReactNode;
}

const Code: React.FC<CodeProps> = ({ children }) => {
    const [copied, setCopied] = useState(false); // Track whether the text has been copied

    // Define a function to handle the click event and copy the content to the clipboard
    const handleCopyToClipboard = useCallback(() => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(String(children)).then(
                () => {
                    console.log('Text successfully copied to clipboard');
                    setCopied(true); // Update the state to indicate that the text has been copied
                    setTimeout(() => {
                        setCopied(false); // Reset the state after 1 second to revert the animation
                    }, 1000);
                },
                (err) => {
                    console.error('Unable to copy text to clipboard', err);
                },
            );
        } else {
            console.error('Clipboard API not supported');
        }
    }, [children]);

    return (
        <div className="relative w-full dark:hover:bg-gray-900 dark:bg-gray-950 light:hover:bg-gray-300 light:bg-gray-200 rounded-md ">
            <div
                className="p-2 rounded-md dark:text-white light:text-gray-900 font-mono "
                onClick={handleCopyToClipboard}
                style={{ cursor: 'pointer' }} // Change the cursor to a pointer when hovering over the element
            >
                {children}
            </div>
            <div className="absolute top-0 right-0 p-2 rounded-md">
                {copied ? (
                    <Check
                        size={24}
                        className="animate-check-icon dark:text-white light:text-gray-900"
                    />
                ) : (
                    <Copy
                        size={24}
                        className="dark:text-white light:text-gray-900 cursor-pointer hover:opacity-80"
                        onClick={handleCopyToClipboard}
                    />
                )}
            </div>
        </div>
    );
};

export default Code;
