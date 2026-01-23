import React from 'react';
import { Zap, Clock, HardDrive } from 'lucide-react';

interface SubmissionSummary {
    verdict: string;
}

const PerformanceMetrics: React.FC<{ submissions: SubmissionSummary[] }> = ({ submissions }) => {
    // Mock performance data (in real app, this would come from backend)
    const avgExecutionTime = submissions.length > 0 ? Math.floor(Math.random() * 500) + 100 : 0;
    const avgMemoryUsage = submissions.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0;
    const fastestTime = submissions.length > 0 ? Math.floor(Math.random() * 200) + 50 : 0;
    const lowestMemory = submissions.length > 0 ? Math.floor(Math.random() * 30) + 5 : 0;

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-purple-500" />
                    Performance Metrics
                </h2>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No submissions yet. Solve problems to see your performance metrics!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Average Execution Time */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                            <Clock size={16} />
                            <span className="text-xs font-medium">Avg Time</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{avgExecutionTime}ms</div>
                        <div className="text-xs text-gray-500 mt-1">Execution time</div>
                    </div>

                    {/* Average Memory */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <HardDrive size={16} />
                            <span className="text-xs font-medium">Avg Memory</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{avgMemoryUsage}MB</div>
                        <div className="text-xs text-gray-500 mt-1">Memory usage</div>
                    </div>

                    {/* Fastest Time */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                            <Zap size={16} />
                            <span className="text-xs font-medium">Best Time</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{fastestTime}ms</div>
                        <div className="text-xs text-gray-500 mt-1">Personal best</div>
                    </div>

                    {/* Lowest Memory */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/30">
                        <div className="flex items-center gap-2 text-cyan-400 mb-2">
                            <HardDrive size={16} />
                            <span className="text-xs font-medium">Best Memory</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{lowestMemory}MB</div>
                        <div className="text-xs text-gray-500 mt-1">Most efficient</div>
                    </div>
                </div>
            )}

            {/* Performance Tips */}
            {submissions.length > 0 && (
                <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="text-sm text-purple-300">
                        <span className="font-bold">💡 Tip:</span> Optimize your code to reduce execution time and memory usage for better performance!
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceMetrics;
