import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SubmissionSummary {
    verdict: string;
}

const ProblemProgress: React.FC<{ submissions: SubmissionSummary[] }> = ({ submissions }) => {
    // Mock data for progress (in real app, fetch from backend)
    const totalProblems = { easy: 50, medium: 100, hard: 50 };
    const solved = {
        easy: Math.min(submissions.filter(s => s.verdict === 'ACCEPTED').length, 15),
        medium: Math.min(submissions.filter(s => s.verdict === 'ACCEPTED').length, 8),
        hard: Math.min(submissions.filter(s => s.verdict === 'ACCEPTED').length, 3)
    };

    const getProgress = (solved: number, total: number) => {
        return Math.round((solved / total) * 100);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Problem Progress
                </h2>
                <div className="text-sm text-gray-400">
                    Total Solved: <span className="text-white font-bold">{solved.easy + solved.medium + solved.hard}</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Easy Progress */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-green-400 font-medium">Easy</span>
                        <span className="text-sm text-gray-400">
                            {solved.easy} / {totalProblems.easy} ({getProgress(solved.easy, totalProblems.easy)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${getProgress(solved.easy, totalProblems.easy)}%` }}
                        />
                    </div>
                </div>

                {/* Medium Progress */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-400 font-medium">Medium</span>
                        <span className="text-sm text-gray-400">
                            {solved.medium} / {totalProblems.medium} ({getProgress(solved.medium, totalProblems.medium)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${getProgress(solved.medium, totalProblems.medium)}%` }}
                        />
                    </div>
                </div>

                {/* Hard Progress */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-red-400 font-medium">Hard</span>
                        <span className="text-sm text-gray-400">
                            {solved.hard} / {totalProblems.hard} ({getProgress(solved.hard, totalProblems.hard)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${getProgress(solved.hard, totalProblems.hard)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-blue-300 font-medium">Overall Progress</span>
                    <span className="text-lg font-bold text-blue-400">
                        {getProgress(solved.easy + solved.medium + solved.hard, totalProblems.easy + totalProblems.medium + totalProblems.hard)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProblemProgress;
