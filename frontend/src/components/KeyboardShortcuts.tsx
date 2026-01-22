import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
    keys: string;
    description: string;
    action: string;
}

const shortcuts: Shortcut[] = [
    { keys: 'Ctrl + Enter', description: 'Run Code', action: 'run' },
    { keys: 'Ctrl + S', description: 'Submit Code', action: 'submit' },
    { keys: 'Ctrl + R', description: 'Reset Code', action: 'reset' },
    { keys: 'Ctrl + /', description: 'Toggle Comment', action: 'comment' },
    { keys: 'Ctrl + K', description: 'Show Shortcuts', action: 'shortcuts' },
    { keys: 'Esc', description: 'Close Panels', action: 'close' },
];

const KeyboardShortcuts: React.FC<{
    onRun: () => void;
    onSubmit: () => void;
    onReset: () => void;
}> = ({ onRun, onSubmit, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + K: Show shortcuts
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }

            // Ctrl + Enter: Run
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                onRun();
            }

            // Ctrl + S: Submit
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                onSubmit();
            }

            // Ctrl + R: Reset
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                onReset();
            }

            // Esc: Close
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onRun, onSubmit, onReset]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Keyboard Shortcuts (Ctrl+K)"
            >
                <Keyboard size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-96 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-blue-400 font-bold">
                                <Keyboard size={20} />
                                <span>Keyboard Shortcuts</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {shortcuts.map((shortcut, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-900 rounded hover:bg-gray-900/70 transition-colors">
                                    <span className="text-gray-300">{shortcut.description}</span>
                                    <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm font-mono text-blue-400">
                                        {shortcut.keys}
                                    </kbd>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-xs text-gray-500 text-center">
                            Press <kbd className="px-2 py-0.5 bg-gray-700 rounded">Esc</kbd> or <kbd className="px-2 py-0.5 bg-gray-700 rounded">Ctrl+K</kbd> to close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KeyboardShortcuts;
