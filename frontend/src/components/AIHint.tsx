import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

const AIHint: React.FC<{ problemId: number }> = ({ problemId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState<string | null>(null);

    const getHint = async () => {
        setLoading(true);
        // Mock AI delay
        setTimeout(() => {
            const hints = [
                "Try using a hash map to store frequencies. This reduces lookup time to O(1).",
                "Consider the edge cases where the input array is empty or has only one element.",
                "You can sort the array first. Sorting often simplifies finding duplicates or pairs.",
                "Think about using two pointers. One starting from the beginning and one from the end.",
                "Dynamic programming might be overkill here. A greedy approach suffices."
            ];
            setHint(hints[Math.floor(Math.random() * hints.length)]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="mt-6 bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Bot size={20} /> AI Assistant
                </div>
                {hint && <button onClick={() => setHint(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>}
            </div>

            {!hint && !loading && (
                <button
                    onClick={getHint}
                    className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/50 rounded flex items-center justify-center gap-2 transition-all"
                >
                    <Sparkles size={16} /> Get AI Hint
                </button>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-gray-400 animate-pulse text-sm">
                    <Bot size={16} /> AI is analyzing your problem...
                </div>
            )}

            {hint && (
                <div className="bg-purple-900/20 p-3 rounded border border-purple-500/20 text-sm text-gray-200">
                    <p className="font-semibold text-purple-300 mb-1">Hint:</p>
                    {hint}
                </div>
            )}
        </div>
    );
};

export default AIHint;
