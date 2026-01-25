import React from 'react';
import { Type, Minus, Plus } from 'lucide-react';

interface FontSizeControlProps {
    fontSize: number;
    onFontSizeChange: (size: number) => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ fontSize, onFontSizeChange }) => {

    const increment = () => {
        if (fontSize < 24) onFontSizeChange(fontSize + 1);
    };

    const decrement = () => {
        if (fontSize > 12) onFontSizeChange(fontSize - 1);
    };

    return (
        <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
                onClick={decrement}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                disabled={fontSize <= 12}
                title="Decrease Font Size"
            >
                <Minus size={14} />
            </button>
            <div className="flex items-center gap-1 px-1 min-w-[3rem] justify-center">
                <Type size={14} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-200">{fontSize}</span>
            </div>
            <button
                onClick={increment}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                disabled={fontSize >= 24}
                title="Increase Font Size"
            >
                <Plus size={14} />
            </button>
        </div>
    );
};

export default FontSizeControl;
