import React from 'react';
import { Wand2 } from 'lucide-react';

const CodeFormatter: React.FC<{
    code: string;
    language: string;
    onFormat: (formattedCode: string) => void;
}> = ({ code, language, onFormat }) => {

    const formatCode = () => {
        let formatted = code;

        if (language === 'java') {
            // Basic Java formatting
            formatted = formatted
                .replace(/\{/g, ' {\n')
                .replace(/\}/g, '\n}\n')
                .replace(/;/g, ';\n')
                .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
                .split('\n')
                .map(line => line.trim())
                .join('\n');
        } else if (language === 'python') {
            // Basic Python formatting
            formatted = formatted
                .split('\n')
                .map(line => line.trim())
                .join('\n')
                .replace(/\n\s*\n\s*\n/g, '\n\n');
        } else if (language === 'cpp') {
            // Basic C++ formatting
            formatted = formatted
                .replace(/\{/g, ' {\n')
                .replace(/\}/g, '\n}\n')
                .replace(/;/g, ';\n')
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .split('\n')
                .map(line => line.trim())
                .join('\n');
        }

        onFormat(formatted);
    };

    return (
        <button
            onClick={formatCode}
            className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Format Code"
        >
            <Wand2 size={18} />
        </button>
    );
};

export default CodeFormatter;
