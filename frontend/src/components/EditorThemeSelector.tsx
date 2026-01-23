import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const themes = [
    { id: 'vs-dark', name: 'VS Dark', description: 'Default dark theme' },
    { id: 'hc-black', name: 'High Contrast', description: 'High contrast black' },
    { id: 'monokai', name: 'Monokai', description: 'Popular color scheme' },
    { id: 'github-dark', name: 'GitHub Dark', description: 'GitHub style' },
];

interface EditorThemeSelectorProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

const EditorThemeSelector: React.FC<EditorThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Change Editor Theme"
            >
                <Palette size={18} />
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-20 w-64">
                    <div className="p-3 border-b border-gray-700">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                            <Palette size={16} />
                            <span>Editor Theme</span>
                        </div>
                    </div>
                    <div className="p-2">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    onThemeChange(theme.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded transition-colors ${currentTheme === theme.id
                                        ? 'bg-blue-600/20 border border-blue-500/50'
                                        : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="font-medium text-sm text-gray-200">{theme.name}</div>
                                <div className="text-xs text-gray-500">{theme.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorThemeSelector;
