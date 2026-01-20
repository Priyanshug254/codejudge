import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Copy, X } from 'lucide-react';

interface Snippet {
    id: string;
    name: string;
    code: string;
    language: string;
    createdAt: string;
}

const SnippetLibrary: React.FC<{ onInsert: (code: string) => void; currentLanguage: string }> = ({ onInsert, currentLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSnippetName, setNewSnippetName] = useState('');
    const [newSnippetCode, setNewSnippetCode] = useState('');

    useEffect(() => {
        loadSnippets();
    }, []);

    const loadSnippets = () => {
        const saved = localStorage.getItem('codejudge_snippets');
        if (saved) {
            setSnippets(JSON.parse(saved));
        }
    };

    const saveSnippets = (updatedSnippets: Snippet[]) => {
        localStorage.setItem('codejudge_snippets', JSON.stringify(updatedSnippets));
        setSnippets(updatedSnippets);
    };

    const addSnippet = () => {
        if (!newSnippetName.trim() || !newSnippetCode.trim()) return;

        const snippet: Snippet = {
            id: Date.now().toString(),
            name: newSnippetName,
            code: newSnippetCode,
            language: currentLanguage,
            createdAt: new Date().toISOString()
        };

        saveSnippets([...snippets, snippet]);
        setNewSnippetName('');
        setNewSnippetCode('');
        setShowAddForm(false);
    };

    const deleteSnippet = (id: string) => {
        saveSnippets(snippets.filter(s => s.id !== id));
    };

    const insertSnippet = (code: string) => {
        onInsert(code);
        setIsOpen(false);
    };

    const filteredSnippets = snippets.filter(s => s.language === currentLanguage);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed right-6 bottom-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all z-40 flex items-center gap-2"
                title="Open Snippet Library"
            >
                <BookOpen size={24} />
                <span className="font-medium">Snippets</span>
            </button>
        );
    }

    return (
        <div className="fixed right-6 bottom-6 w-96 max-h-[600px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-40 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <BookOpen size={20} />
                    <span>Code Snippets ({currentLanguage})</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 rounded flex items-center justify-center gap-2 mb-4 transition-all"
                    >
                        <Plus size={16} /> New Snippet
                    </button>
                )}

                {showAddForm && (
                    <div className="mb-4 p-3 bg-gray-900 rounded border border-indigo-500/30">
                        <input
                            type="text"
                            placeholder="Snippet name..."
                            value={newSnippetName}
                            onChange={(e) => setNewSnippetName(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mb-2 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <textarea
                            placeholder="Paste your code here..."
                            value={newSnippetCode}
                            onChange={(e) => setNewSnippetCode(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mb-2 text-sm font-mono focus:outline-none focus:border-indigo-500 h-24 resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={addSnippet}
                                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewSnippetName('');
                                    setNewSnippetCode('');
                                }}
                                className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Snippet List */}
                <div className="space-y-2">
                    {filteredSnippets.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 text-sm">
                            No snippets saved for {currentLanguage} yet.
                        </div>
                    ) : (
                        filteredSnippets.map(snippet => (
                            <div key={snippet.id} className="bg-gray-900 p-3 rounded border border-gray-700 hover:border-indigo-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm text-gray-200">{snippet.name}</h4>
                                    <button
                                        onClick={() => deleteSnippet(snippet.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete snippet"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <pre className="text-xs bg-gray-800 p-2 rounded mb-2 overflow-x-auto text-gray-400 font-mono">
                                    {snippet.code.substring(0, 100)}{snippet.code.length > 100 ? '...' : ''}
                                </pre>
                                <button
                                    onClick={() => insertSnippet(snippet.code)}
                                    className="w-full py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Copy size={14} /> Insert to Editor
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetLibrary;
