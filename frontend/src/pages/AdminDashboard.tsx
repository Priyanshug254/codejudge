import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileCode, CheckSquare, BarChart3, Plus, ArrowRight } from 'lucide-react';
import AdminService from '../services/admin.service';

interface Stats {
    totalUsers: number;
    totalProblems: number;
    totalSubmissions: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AdminService.getStats()
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-white text-center p-10">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <BarChart3 className="text-blue-500" size={32} />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">System overview and management</p>
                    </div>
                    <Link
                        to="/problems/create"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        <span>New Problem</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded">TOTAL</span>
                        </div>
                        <h3 className="text-3xl font-bold">{stats?.totalUsers}</h3>
                        <p className="text-gray-400 text-sm mt-1">Registered Users</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                                <FileCode size={24} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded">TOTAL</span>
                        </div>
                        <h3 className="text-3xl font-bold">{stats?.totalProblems}</h3>
                        <p className="text-gray-400 text-sm mt-1">Problems Created</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                <CheckSquare size={24} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded">TOTAL</span>
                        </div>
                        <h3 className="text-3xl font-bold">{stats?.totalSubmissions}</h3>
                        <p className="text-gray-400 text-sm mt-1">Submissions Processed</p>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/problems" className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group">
                            <div className="flex items-center gap-3">
                                <FileCode className="text-gray-400 group-hover:text-blue-400" />
                                <span>Manage Problems</span>
                            </div>
                            <ArrowRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/leaderboard" className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="text-gray-400 group-hover:text-blue-400" />
                                <span>View Leaderboard</span>
                            </div>
                            <ArrowRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
