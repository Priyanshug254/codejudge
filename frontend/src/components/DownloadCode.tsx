import React from 'react';
import { Download } from 'lucide-react';

interface DownloadCodeProps {
    code: string;
    language: string;
    problemTitle: string;
}

const DownloadCode: React.FC<DownloadCodeProps> = ({ code, language, problemTitle }) => {

    const handleDownload = () => {
        const extensionMap: Record<string, string> = {
            java: 'java',
            python: 'py',
            cpp: 'cpp',
            javascript: 'js'
        };

        const ext = extensionMap[language] || 'txt';
        const filename = `${problemTitle.replace(/\s+/g, '_')}_solution.${ext}`;

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Download Code"
        >
            <Download size={18} />
        </button>
    );
};

export default DownloadCode;
