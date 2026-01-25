import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ReadingModeToggleProps {
    isReadingMode: boolean;
    onToggle: () => void;
}

const ReadingModeToggle: React.FC<ReadingModeToggleProps> = ({ isReadingMode, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`p-1.5 rounded transition-colors mb-2 ml-auto block ${isReadingMode
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700'
                }`}
            title={isReadingMode ? "Disable Reading Mode" : "Enable Reading Mode"}
        >
            {isReadingMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
    );
};

export default ReadingModeToggle;
