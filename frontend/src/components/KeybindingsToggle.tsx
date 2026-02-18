import React, { useState } from 'react';
import { Keyboard, Command, ShieldCheck, Zap } from 'lucide-react';

export type KeybindingMode = 'standard' | 'vim' | 'emacs';

interface KeybindingsToggleProps {
    currentMode: KeybindingMode;
    onModeChange: (mode: KeybindingMode) => void;
}

const KeybindingsToggle: React.FC<KeybindingsToggleProps> = ({ currentMode, onModeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const modes: { id: KeybindingMode; label: string; icon: React.ReactNode; desc: string }[] = [
        {
            id: 'standard',
            label: 'Standard',
            icon: <Keyboard size={14} />,
            desc: 'Default VS Code shortcuts'
        },
        {
            id: 'vim',
            label: 'Vim Mode',
            icon: <Zap size={14} className="text-yellow-400" />,
            desc: 'Vi motions and commands'
        },
        {
            id: 'emacs',
            label: 'Emacs',
            icon: <Command size={14} className="text-blue-400" />,
            desc: 'GNU Emacs keybindings'
        }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all border ${isOpen ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
            >
                <Keyboard size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-gray-200 capitalize">{currentMode} Mode</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-12 left-0 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800 mb-2">
                            Editor Keybindings
                        </div>
                        <div className="space-y-1">
                            {modes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => {
                                        onModeChange(mode.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-start gap-3 p-3 rounded-md transition-colors text-left ${currentMode === mode.id
                                            ? 'bg-blue-600/10 border border-blue-500/30'
                                            : 'hover:bg-gray-800 border border-transparent'
                                        }`}
                                >
                                    <div className={`mt-0.5 p-1.5 rounded bg-gray-800 ${currentMode === mode.id ? 'text-blue-400' : 'text-gray-400'}`}>
                                        {mode.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold ${currentMode === mode.id ? 'text-blue-400' : 'text-gray-200'}`}>
                                                {mode.label}
                                            </span>
                                            {currentMode === mode.id && <ShieldCheck size={14} className="text-blue-400" />}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                                            {mode.desc}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default KeybindingsToggle;
