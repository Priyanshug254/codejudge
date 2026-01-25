import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ZenModeToggleProps {
    isZenMode: boolean;
    onToggle: () => void;
}

const ZenModeToggle: React.FC<ZenModeToggleProps> = ({ isZenMode, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`p-2 rounded transition-colors ${isZenMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
        >
            {isZenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
    );
};

export default ZenModeToggle;
