import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

const commonTags = ['Array', 'String', 'DP', 'Graph', 'Tree', 'Math', 'Greedy', 'Binary Search', 'Sorting', 'Hash Table'];

const ProblemTags: React.FC<{
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
}> = ({ selectedTags, onTagsChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
                <Tag size={16} />
                <span>Tags {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-2xl z-20 w-80">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm">Filter by Tags</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {commonTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedTags.includes(tag)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {selectedTags.length > 0 && (
                        <button
                            onClick={() => onTagsChange([])}
                            className="w-full py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProblemTags;
