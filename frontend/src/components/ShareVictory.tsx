import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

const ShareVictory: React.FC<{ problemTitle: string; language: string }> = ({ problemTitle, language }) => {
    const text = `I just solved "${problemTitle}" in ${language} on CodeJudge! 🚀\n\nChallenge yourself at:`;
    const url = 'https://codejudge.app'; // Mock URL for now

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

    return (
        <div className="mt-4 flex gap-3 animate-fade-in-up">
            <span className="text-gray-400 text-sm flex items-center">Share your victory:</span>
            <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-lg transition-colors"
                title="Share on Twitter"
            >
                <Twitter size={20} />
            </a>
            <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5] rounded-lg transition-colors"
                title="Share on LinkedIn"
            >
                <Linkedin size={20} />
            </a>
        </div>
    );
};

export default ShareVictory;
