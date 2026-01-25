import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyCodeButtonProps {
    code: string;
}

const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-2 rounded transition-colors ${copied
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
            title="Copy Code"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
};

export default CopyCodeButton;
