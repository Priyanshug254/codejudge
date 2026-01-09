import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Database, Calendar } from 'lucide-react';
import SubmissionService from '../services/submission.service';

interface SubmissionDetail {
    id: number;
    problemId: number;
    problemTitle: string;
    language: string;
    code: string;
    verdict: string;
    score: number;
    executionTimeMs: number;
    memoryUsedKb: number;
    submittedAt: string;
}

const SubmissionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            SubmissionService.getSubmission(id)
                .then(res => setSubmission(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="text-white text-center p-10">Loading submission...</div>;
    if (!submission) return <div className="text-white text-center p-10">Submission not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-5xl mx-auto">
                <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                    <ArrowLeft size={20} /> Back to Profile
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Code Viewer */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg h-[600px] flex flex-col">
                            <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                                <span className="font-mono text-sm text-gray-400">Solution.{submission.language === 'cpp' ? 'cpp' : (submission.language === 'python' ? 'py' : 'java')}</span>
                                <span className="text-xs text-gray-500 uppercase">{submission.language}</span>
                            </div>
                            <div className="flex-1">
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language={submission.language.toLowerCase()}
                                    value={submission.code}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">{submission.problemTitle}</h2>

                            <div className="flex items-center gap-3 mb-6">
                                {submission.verdict === 'ACCEPTED' ? (
                                    <CheckCircle className="text-green-500" size={32} />
                                ) : (
                                    <XCircle className="text-red-500" size={32} />
                                )}
                                <div>
                                    <div className={`text-xl font-bold ${submission.verdict === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                                        {submission.verdict}
                                    </div>
                                    <div className="text-sm text-gray-400">Score: {submission.score}/100</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={18} />
                                        <span>Time</span>
                                    </div>
                                    <span className="font-mono font-medium">{submission.executionTimeMs} ms</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Database size={18} />
                                        <span>Memory</span>
                                    </div>
                                    <span className="font-mono font-medium">{submission.memoryUsedKb} KB</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={18} />
                                        <span>Submitted</span>
                                    </div>
                                    <span className="text-sm">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <Link
                                    to={`/problems/${submission.problemId}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors font-medium"
                                >
                                    Solve Again
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;
