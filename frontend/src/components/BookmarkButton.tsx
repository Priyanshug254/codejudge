import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
    problemId: number;
    problemTitle: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ problemId, problemTitle }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const bookmarks = getBookmarks();
        setIsBookmarked(bookmarks.some(b => b.id === problemId));
    }, [problemId]);

    const getBookmarks = (): Array<{ id: number; title: string; timestamp: string }> => {
        const saved = localStorage.getItem('codejudge_bookmarks');
        return saved ? JSON.parse(saved) : [];
    };

    const toggleBookmark = () => {
        const bookmarks = getBookmarks();

        if (isBookmarked) {
            // Remove bookmark
            const updated = bookmarks.filter(b => b.id !== problemId);
            localStorage.setItem('codejudge_bookmarks', JSON.stringify(updated));
            setIsBookmarked(false);
        } else {
            // Add bookmark
            const newBookmark = {
                id: problemId,
                title: problemTitle,
                timestamp: new Date().toISOString()
            };
            const updated = [newBookmark, ...bookmarks];
            localStorage.setItem('codejudge_bookmarks', JSON.stringify(updated));
            setIsBookmarked(true);
        }
    };

    return (
        <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-all ${isBookmarked
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-yellow-400'
                }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this problem'}
        >
            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
    );
};

export default BookmarkButton;
