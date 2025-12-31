import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LeaderboardEntry } from '../types/leaderboard';
import { Trophy, Medal, User } from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<LeaderboardEntry[]>('/leaderboard')
            .then(res => setEntries(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="text-yellow-400" size={24} />;
        if (index === 1) return <Medal className="text-gray-300" size={24} />;
        if (index === 2) return <Medal className="text-amber-600" size={24} />;
        return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Trophy className="text-yellow-500" />
                    Leaderboard
                </h1>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-700/50 text-gray-400 uppercase text-sm">
                            <tr>
                                <th className="p-4 w-24 text-center">Rank</th>
                                <th className="p-4">User</th>
                                <th className="p-4 text-center">Solved</th>
                                <th className="p-4 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading rankings...</td></tr>
                            ) : entries.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No submissions yet</td></tr>
                            ) : (
                                entries.map((entry, index) => (
                                    <tr key={entry.userId} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 flex justify-center">{getRankIcon(index)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-700 p-1.5 rounded-full">
                                                    <User size={16} className="text-gray-300" />
                                                </div>
                                                <span className="font-medium text-lg">{entry.username}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center font-mono text-blue-400">{entry.problemsSolved}</td>
                                        <td className="p-4 text-right font-bold text-green-400 text-lg">{entry.totalScore}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
