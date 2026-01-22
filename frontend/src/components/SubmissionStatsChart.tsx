import React from 'react';
import { PieChart } from 'lucide-react';

interface SubmissionSummary {
    verdict: string;
}

const SubmissionStatsChart: React.FC<{ submissions: SubmissionSummary[] }> = ({ submissions }) => {
    const verdictCounts = submissions.reduce((acc, sub) => {
        acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const total = submissions.length;
    const accepted = verdictCounts['ACCEPTED'] || 0;
    const failed = total - accepted;

    const acceptedPercentage = total > 0 ? (accepted / total) * 100 : 0;
    const failedPercentage = total > 0 ? (failed / total) * 100 : 0;

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submission Statistics</h2>
                <PieChart className="text-blue-500" />
            </div>

            {total === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No submissions yet. Start solving problems!
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Visual Bar Chart */}
                    <div className="flex h-12 rounded-lg overflow-hidden">
                        {accepted > 0 && (
                            <div
                                className="bg-green-500 flex items-center justify-center text-white font-bold text-sm"
                                style={{ width: `${acceptedPercentage}%` }}
                                title={`Accepted: ${accepted}`}
                            >
                                {acceptedPercentage > 15 && `${accepted}`}
                            </div>
                        )}
                        {failed > 0 && (
                            <div
                                className="bg-red-500 flex items-center justify-center text-white font-bold text-sm"
                                style={{ width: `${failedPercentage}%` }}
                                title={`Failed: ${failed}`}
                            >
                                {failedPercentage > 15 && `${failed}`}
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-900 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-blue-400">{total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-green-400">{accepted}</div>
                            <div className="text-xs text-gray-500">Accepted</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-red-400">{failed}</div>
                            <div className="text-xs text-gray-500">Failed</div>
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="bg-gray-900 p-4 rounded">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Success Rate</span>
                            <span className="text-xl font-bold text-green-400">
                                {acceptedPercentage.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionStatsChart;
