import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Trophy, Clock, CheckCircle, XCircle, Award, Shield } from 'lucide-react';

interface SubmissionSummary {
    id: number;
    problemTitle: string;
    verdict: string;
    score: number;
    language: string;
}

interface UserProfile {
    id: number;
    username: string;
    email: string;
    fullName: string;
    problemsSolved: number;
    badges: string[];
    recentSubmissions: SubmissionSummary[];
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<UserProfile>('/users/me')
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-white text-center p-10">Loading profile...</div>;
    if (!profile) return <div className="text-white text-center p-10">Failed to load profile</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Stats */}
                <div className="bg-gray-800 rounded-xl p-8 mb-8 flex items-center gap-8 border border-gray-700">
                    <div className="bg-blue-600/20 p-6 rounded-full">
                        <User size={64} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{profile.fullName || profile.username}</h1>
                        <div className="flex gap-6 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Mail size={16} /> {profile.email}
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <Trophy size={16} /> {profile.problemsSolved} Problems Solved
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gamification Badges</h2>
                        <Award className="text-yellow-500" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.badges && profile.badges.length > 0 ? (
                            profile.badges.map((badge, idx) => (
                                <div key={idx} className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center border border-gray-600 hover:border-yellow-500 transition-colors">
                                    <Shield className={`mb-2 ${idx % 2 === 0 ? 'text-blue-400' : 'text-purple-400'}`} size={32} />
                                    <span className="font-semibold text-sm">{badge}</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 text-center text-gray-400 py-4">No badges earned yet. Solve problems to unlock!</div>
                        )}
                    </div>
                </div>

                {/* Recent Submissions */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="text-gray-400" />
                    Recent Submissions
                </h2>

                <div className="grid gap-3">
                    {profile.recentSubmissions.length === 0 ? (
                        <div className="text-gray-500 italic">No submissions yet.</div>
                    ) : (
                        profile.recentSubmissions.map(sub => (
                            <Link to={`/submissions/${sub.id}`} key={sub.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                                <div>
                                    <h3 className="font-semibold text-lg">{sub.problemTitle}</h3>
                                    <span className="text-sm text-gray-400 uppercase">{sub.language}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold ${sub.verdict === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                                        {sub.verdict || 'PENDING'}
                                    </span>
                                    {sub.verdict === 'ACCEPTED' ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
