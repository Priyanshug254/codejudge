import React, { useState } from 'react';
import { GitCompare, X } from 'lucide-react';

const CodeComparison: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [leftCode, setLeftCode] = useState('// Your first solution\n');
    const [rightCode, setRightCode] = useState('// Your second solution\n');

    const getDifferences = () => {
        const leftLines = leftCode.split('\n');
        const rightLines = rightCode.split('\n');
        const maxLines = Math.max(leftLines.length, rightLines.length);

        const diffs = [];
        for (let i = 0; i < maxLines; i++) {
            const left = leftLines[i] || '';
            const right = rightLines[i] || '';
            diffs.push({
                lineNum: i + 1,
                left,
                right,
                isDifferent: left !== right
            });
        }
        return diffs;
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Compare Code"
            >
                <GitCompare size={18} />
            </button>
        );
    }

    const differences = getDifferences();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                        <GitCompare size={20} />
                        <span>Code Comparison</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col p-4">
                    {/* Input Areas */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Code Version 1</label>
                            <textarea
                                value={leftCode}
                                onChange={(e) => setLeftCode(e.target.value)}
                                className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="Paste your first code version here..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Code Version 2</label>
                            <textarea
                                value={rightCode}
                                onChange={(e) => setRightCode(e.target.value)}
                                className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="Paste your second code version here..."
                            />
                        </div>
                    </div>

                    {/* Comparison View */}
                    <div className="flex-1 overflow-auto bg-gray-900 rounded border border-gray-700">
                        <div className="grid grid-cols-2 divide-x divide-gray-700">
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-gray-400 mb-2">Version 1</h3>
                                {differences.map((diff) => (
                                    <div
                                        key={`left-${diff.lineNum}`}
                                        className={`flex gap-2 font-mono text-sm py-1 ${diff.isDifferent ? 'bg-red-900/20 text-red-300' : 'text-gray-400'
                                            }`}
                                    >
                                        <span className="text-gray-600 w-8 text-right">{diff.lineNum}</span>
                                        <span className="flex-1">{diff.left || ' '}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-gray-400 mb-2">Version 2</h3>
                                {differences.map((diff) => (
                                    <div
                                        key={`right-${diff.lineNum}`}
                                        className={`flex gap-2 font-mono text-sm py-1 ${diff.isDifferent ? 'bg-green-900/20 text-green-300' : 'text-gray-400'
                                            }`}
                                    >
                                        <span className="text-gray-600 w-8 text-right">{diff.lineNum}</span>
                                        <span className="flex-1">{diff.right || ' '}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeComparison;
