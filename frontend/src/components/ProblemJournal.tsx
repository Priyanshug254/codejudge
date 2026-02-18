import React, { useState, useEffect } from 'react';
import { BookMarked, Save, Trash2, Eye, Edit3, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ProblemJournalProps {
    problemId: string;
    onClose: () => void;
}

const ProblemJournal: React.FC<ProblemJournalProps> = ({ problemId, onClose }) => {
    const [notes, setNotes] = useState('');
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        const savedNotes = localStorage.getItem(`journal_${problemId}`);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, [problemId]);

    const saveNotes = () => {
        localStorage.setItem(`journal_${problemId}`, notes);
        setLastSaved(new Date().toLocaleTimeString());
    };

    const clearNotes = () => {
        if (window.confirm('Delete all notes for this problem?')) {
            setNotes('');
            localStorage.removeItem(`journal_${problemId}`);
            setLastSaved(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800 animate-in slide-in-from-right duration-300">
            <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <BookMarked className="text-emerald-400" size={18} />
                    <span className="text-sm font-bold text-gray-200">Problem Journal</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    ✕
                </button>
            </div>

            <div className="flex bg-gray-900/30 p-2 gap-2 border-b border-gray-800">
                <button
                    onClick={() => setMode('edit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'edit' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Edit3 size={14} /> Write
                </button>
                <button
                    onClick={() => setMode('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'preview' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Eye size={14} /> Preview
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {mode === 'edit' ? (
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="# Strategy for this problem...
- Use a hash map for O(1) lookups
- Careful with edge case n=0
- Time Complexity: O(n)"
                        className="w-full h-full bg-transparent p-4 text-sm font-mono text-gray-300 focus:outline-none resize-none placeholder-gray-700"
                    />
                ) : (
                    <div className="w-full h-full p-6 overflow-y-auto prose prose-invert prose-emerald max-w-none prose-sm">
                        {notes ? (
                            <ReactMarkdown>{notes}</ReactMarkdown>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2 opacity-50">
                                <Sparkles size={32} />
                                <p className="text-xs">No notes yet. Start writing logic patterns!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between">
                <div className="text-[10px] text-gray-500">
                    {lastSaved ? `Last auto-saved: ${lastSaved}` : 'Not saved yet'}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={clearNotes}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Clear Notes"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={saveNotes}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition-all shadow-lg"
                    >
                        <Save size={14} /> Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProblemJournal;
