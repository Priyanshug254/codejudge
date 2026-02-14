import React from 'react';
import { Wand2 } from 'lucide-react';
import { formatCode } from '../utils/codeFormatter';

const CodeFormatter: React.FC<{
    code: string;
    language: string;
    onFormat: (formattedCode: string) => void;
}> = ({ code, language, onFormat }) => {

    const handleFormat = () => {
        const formatted = formatCode(code, language);
        onFormat(formatted);
    };

    return (
        <button
            onClick={handleFormat}
            className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Format Code"
        >
            <Wand2 size={18} />
        </button>
    );
};

export default CodeFormatter;
