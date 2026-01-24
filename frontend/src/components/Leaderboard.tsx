import React, { useState } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    solved: number;
    avatar: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'CodeMaster', score: 2850, solved: 145, avatar: '🏆' },
    { rank: 2, username: 'AlgoNinja', score: 2720, solved: 138, avatar: '🥈' },
    { rank: 3, username: 'DevPro', score: 2650, solved: 132, avatar: '🥉' },
    { rank: 4, username: 'ByteWizard', score: 2480, solved: 125, avatar: '⭐' },
    { rank: 5, username: 'CodeGenius', score: 2350, solved: 118, avatar: '💎' },
    { rank: 6, username: 'TechSavvy', score: 2220, solved: 112, avatar: '🔥' },
    { rank: 7, username: 'LogicKing', score: 2100, solved: 105, avatar: '⚡' },
    { rank: 8, username: 'DataGuru', score: 1980, solved: 98, avatar: '🎯' },
    { rank: 9, username: 'StackPro', score: 1850, solved: 92, avatar: '🚀' },
    { rank: 10, username: 'BugHunter', score: 1720, solved: 85, avatar: '🎪' },
];

const Leaderboard: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-400" size={24} />;
            case 2:
                return <Medal className="text-gray-400" size={24} />;
            case 3:
                return <Award className="text-orange-600" size={24} />;
            default:
                return <span className="text-gray-500 font-bold">#{rank}</span>;
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors border border-purple-600/50"
            >
                <Trophy size={20} />
                <span>Leaderboard</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <Trophy size={24} />
                        <span className="text-xl">Global Leaderboard</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        {mockLeaderboard.map((entry) => (
                            <div
                                key={entry.rank}
                                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${entry.rank <= 3
                                        ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30'
                                        : 'bg-gray-900 hover:bg-gray-850 border border-gray-700'
                                    }`}
                            >
                                {/* Rank */}
                                <div className="w-12 flex justify-center">
                                    {getRankIcon(entry.rank)}
                                </div>

                                {/* Avatar */}
                                <div className="text-3xl">{entry.avatar}</div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="font-bold text-white">{entry.username}</div>
                                    <div className="text-sm text-gray-400">
                                        {entry.solved} problems solved
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {entry.score}
                                    </div>
                                    <div className="text-xs text-gray-500">points</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                    <div className="text-center text-sm text-gray-400">
                        🎯 Keep solving to climb the ranks!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
