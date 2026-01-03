import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import { Problem } from '../types/problem';
import { Code, Clock, Database, Plus, User as UserIcon } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProblemList: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
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
                    <Link
                        to="/profile"
                        className="ml-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                        <UserIcon size={20} />
                        <span>My Profile</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {problems.map((problem) => (
                            <Link
                                key={problem.id}
                                to={`/problems/${problem.id}`}
                                className="group block bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all"
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
