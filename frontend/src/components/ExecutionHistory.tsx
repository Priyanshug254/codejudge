import React, { useState, useEffect } from 'react';
import { History, Clock, Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExecutionRecord {
    id: string;
    code: string;
    language: string;
    output: string;
    timestamp: string;
    problemId: string;
}

const ExecutionHistory: React.FC<{
    problemId: string;
    onReplay: (code: string, language: string) => void;
}> = ({ problemId, onReplay }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<ExecutionRecord[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, [problemId]);

    const loadHistory = () => {
        const saved = localStorage.getItem(`codejudge_history_${problemId}`);
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    };

    const addRecord = (code: string, language: string, output: string) => {
        const record: ExecutionRecord = {
            id: Date.now().toString(),
            code,
            language,
            output,
            timestamp: new Date().toLocaleString(),
            problemId
        };
        const updated = [record, ...history].slice(0, 10); // Keep last 10
        localStorage.setItem(`codejudge_history_${problemId}`, JSON.stringify(updated));
        setHistory(updated);
    };

    const clearHistory = () => {
        if (window.confirm('Clear all execution history for this problem?')) {
            localStorage.removeItem(`codejudge_history_${problemId}`);
            setHistory([]);
        }
    };

    // Expose addRecord to parent
    React.useImperativeHandle(React.useRef(), () => ({
        addRecord
    }));

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
                title="View Execution History"
            >
                <History size={16} />
                History ({history.length})
            </button>
        );
    }

    return (
        <div className="absolute top-16 right-6 w-96 max-h-[500px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-30 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <History size={20} />
                    <span>Execution History</span>
                </div>
                <div className="flex gap-2">
                    {history.length > 0 && (
                        <button onClick={clearHistory} className="text-red-400 hover:text-red-300" title="Clear All">
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        No execution history yet. Run your code to start tracking!
                    </div>
                ) : (
                    <div className="space-y-2">
                        {history.map((record) => (
                            <div key={record.id} className="bg-gray-900 rounded border border-gray-700 overflow-hidden">
                                <div
                                    className="p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={14} className="text-gray-500" />
                                            <span className="text-gray-400">{record.timestamp}</span>
                                        </div>
                                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                                            {record.language}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {record.code.substring(0, 50)}...
                                        </span>
                                        {expandedId === record.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {expandedId === record.id && (
                                    <div className="p-3 border-t border-gray-700 bg-gray-950">
                                        <div className="mb-2">
                                            <div className="text-xs text-gray-500 mb-1">Code:</div>
                                            <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto text-gray-300 font-mono max-h-32 overflow-y-auto">
                                                {record.code}
                                            </pre>
                                        </div>
                                        <div className="mb-3">
                                            <div className="text-xs text-gray-500 mb-1">Output:</div>
                                            <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto text-gray-300 font-mono max-h-24 overflow-y-auto">
                                                {record.output}
                                            </pre>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onReplay(record.code, record.language);
                                                setIsOpen(false);
                                            }}
                                            className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Play size={14} /> Replay This Code
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExecutionHistory;
