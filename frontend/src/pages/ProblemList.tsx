import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import { Problem } from '../types/problem';
import { Code, Clock, Database, Plus, User as UserIcon, Search, BarChart3 } from 'lucide-react';
import ProblemTags from '../components/ProblemTags';
import BookmarkedProblems from '../components/BookmarkedProblems';
import Leaderboard from '../components/Leaderboard';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProblemList: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        loadProblems();
    }, []);

    const loadProblems = async () => {
        try {
            const response = await ProblemService.getAllProblems();
            setProblems(response.data);
        } catch (error) {
            console.error('Error loading problems', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'EASY': return 'text-green-500 bg-green-500/10';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10';
            case 'HARD': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Problems</h1>
                        <p className="text-gray-400 mt-2">Challenge yourself with algorithmic problems</p>
                    </div>
                    {(user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_EXAMINER')) && (
                        <Link
                            to="/problems/create"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                            <span>Create Problem</span>
                        </Link>
                    )}
                    {(user?.roles.includes('ROLE_ADMIN')) && (
                        <Link
                            to="/admin"
                            className="ml-2 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            <BarChart3 size={20} />
                            <span>Dashboard</span>
                        </Link>
                    )}
                    <Link
                        to="/profile"
                        className="ml-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                        <UserIcon size={20} />
                        <span>My Profile</span>
                    </Link>
                    <BookmarkedProblems />
                    <Leaderboard />
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                        <option value="ALL">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                            >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                                    {problem.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{problem.timeLimitMs}ms</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Database size={14} />
                                        <span>{problem.memoryLimitMb}MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Code className="text-blue-500" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
                )}
        </div>
        </div >
    );
};

export default ProblemList;
