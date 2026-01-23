import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, X, Clock } from 'lucide-react';

interface Bookmark {
    id: number;
    title: string;
    timestamp: string;
}

const BookmarkedProblems: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        loadBookmarks();
    }, [isOpen]);

    const loadBookmarks = () => {
        const saved = localStorage.getItem('codejudge_bookmarks');
        setBookmarks(saved ? JSON.parse(saved) : []);
    };

    const removeBookmark = (id: number) => {
        const updated = bookmarks.filter(b => b.id !== id);
        localStorage.setItem('codejudge_bookmarks', JSON.stringify(updated));
        setBookmarks(updated);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors border border-yellow-600/50"
            >
                <BookmarkCheck size={20} />
                <span>Bookmarks ({bookmarks.length})</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-[500px] max-h-[600px] shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <BookmarkCheck size={20} />
                        <span>Bookmarked Problems</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {bookmarks.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            No bookmarked problems yet. Start bookmarking your favorites!
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {bookmarks.map((bookmark) => (
                                <div key={bookmark.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-yellow-600/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link
                                            to={`/problems/${bookmark.id}`}
                                            className="text-blue-400 hover:text-blue-300 font-medium flex-1"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {bookmark.title}
                                        </Link>
                                        <button
                                            onClick={() => removeBookmark(bookmark.id)}
                                            className="text-red-400 hover:text-red-300 ml-2"
                                            title="Remove bookmark"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock size={12} />
                                        <span>Saved {new Date(bookmark.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookmarkedProblems;
