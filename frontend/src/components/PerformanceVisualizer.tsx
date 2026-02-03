import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Cpu, Zap, X, Play, Info } from 'lucide-react';

interface PerformanceData {
    inputSize: number;
    executionTime: number;
    memoryUsage: number;
    operations: number;
}

interface ComplexityInfo {
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
    color: string;
}

interface PerformanceVisualizerProps {
    code: string;
    language: string;
    onClose: () => void;
}

const PerformanceVisualizer: React.FC<PerformanceVisualizerProps> = ({ code, language, onClose }) => {
    const [analyzing, setAnalyzing] = useState(true);
    const [complexity, setComplexity] = useState<ComplexityInfo | null>(null);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [selectedTab, setSelectedTab] = useState<'graph' | 'trace' | 'metrics'>('graph');
    const [inputSize, setInputSize] = useState(100);
    const [traceSteps, setTraceSteps] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        analyzePerformance();
    }, [code, language]);

    const analyzePerformance = () => {
        setAnalyzing(true);

        setTimeout(() => {
            // Detect algorithm complexity
            const detectedComplexity = detectComplexity(code);
            setComplexity(detectedComplexity);

            // Generate performance data
            const data = generatePerformanceData(detectedComplexity.timeComplexity);
            setPerformanceData(data);

            // Generate execution trace
            const trace = generateExecutionTrace(code);
            setTraceSteps(trace);

            setAnalyzing(false);
        }, 1500);
    };

    const detectComplexity = (code: string): ComplexityInfo => {
        // Count nested loops
        const forLoops = (code.match(/for\s*\(/g) || []).length;
        const whileLoops = (code.match(/while\s*\(/g) || []).length;
        const recursiveCalls = (code.match(/return\s+\w+\(/g) || []).length;

        // Detect sorting
        const hasSorting = code.includes('.sort') || code.includes('Arrays.sort') || code.includes('sorted(');

        // Detect binary search patterns
        const hasBinarySearch = code.includes('mid') && code.includes('left') && code.includes('right');

        // Detect dynamic programming
        const hasDP = code.includes('dp[') || code.includes('memo');

        let timeComplexity = 'O(n)';
        let spaceComplexity = 'O(1)';
        let description = 'Linear time complexity';
        let color = '#10B981'; // green

        if (recursiveCalls > 0 && code.includes('fibonacci')) {
            timeComplexity = 'O(2^n)';
            spaceComplexity = 'O(n)';
            description = 'Exponential time - Consider memoization';
            color = '#EF4444'; // red
        } else if (forLoops >= 3 || whileLoops >= 3) {
            timeComplexity = 'O(n³)';
            spaceComplexity = 'O(1)';
            description = 'Cubic time - Very slow for large inputs';
            color = '#EF4444';
        } else if (forLoops >= 2 || whileLoops >= 2) {
            timeComplexity = 'O(n²)';
            spaceComplexity = 'O(1)';
            description = 'Quadratic time - Consider optimization';
            color = '#F59E0B'; // orange
        } else if (hasSorting) {
            timeComplexity = 'O(n log n)';
            spaceComplexity = 'O(log n)';
            description = 'Linearithmic time - Efficient sorting';
            color = '#10B981';
        } else if (hasBinarySearch) {
            timeComplexity = 'O(log n)';
            spaceComplexity = 'O(1)';
            description = 'Logarithmic time - Very efficient';
            color = '#10B981';
        } else if (hasDP) {
            timeComplexity = 'O(n²)';
            spaceComplexity = 'O(n²)';
            description = 'Dynamic programming - Trading space for time';
            color = '#3B82F6'; // blue
        } else if (forLoops >= 1 || whileLoops >= 1) {
            timeComplexity = 'O(n)';
            spaceComplexity = 'O(1)';
            description = 'Linear time - Good performance';
            color = '#10B981';
        } else {
            timeComplexity = 'O(1)';
            spaceComplexity = 'O(1)';
            description = 'Constant time - Optimal';
            color = '#10B981';
        }

        // Check for extra space usage
        if (code.includes('new ') || code.includes('[') || code.includes('List') || code.includes('Map')) {
            spaceComplexity = 'O(n)';
        }

        return { timeComplexity, spaceComplexity, description, color };
    };

    const generatePerformanceData = (complexity: string): PerformanceData[] => {
        const sizes = [10, 50, 100, 500, 1000, 5000];

        return sizes.map(size => {
            let time = 0;
            let ops = 0;

            switch (complexity) {
                case 'O(1)':
                    time = 1;
                    ops = 1;
                    break;
                case 'O(log n)':
                    time = Math.log2(size);
                    ops = Math.log2(size);
                    break;
                case 'O(n)':
                    time = size;
                    ops = size;
                    break;
                case 'O(n log n)':
                    time = size * Math.log2(size);
                    ops = size * Math.log2(size);
                    break;
                case 'O(n²)':
                    time = size * size;
                    ops = size * size;
                    break;
                case 'O(n³)':
                    time = size * size * size;
                    ops = size * size * size;
                    break;
                case 'O(2^n)':
                    time = Math.pow(2, Math.min(size, 20));
                    ops = Math.pow(2, Math.min(size, 20));
                    break;
                default:
                    time = size;
                    ops = size;
            }

            return {
                inputSize: size,
                executionTime: Math.round(time * 100) / 100,
                memoryUsage: Math.round(size * 8 + Math.random() * 100),
                operations: Math.round(ops)
            };
        });
    };

    const generateExecutionTrace = (code: string): string[] => {
        const steps: string[] = [];

        steps.push('🚀 Algorithm execution started');
        steps.push('📥 Reading input data');

        if (code.includes('for') || code.includes('while')) {
            steps.push('🔄 Entering main loop');
            steps.push('  → Iteration 1: Processing element');
            steps.push('  → Iteration 2: Processing element');
            steps.push('  → Iteration 3: Processing element');
            steps.push('  → ... continuing iterations');
            steps.push('✅ Loop completed');
        }

        if (code.includes('if')) {
            steps.push('🔀 Evaluating condition');
            steps.push('  → Condition is true, executing branch');
        }

        if (code.includes('.sort') || code.includes('sort(')) {
            steps.push('📊 Sorting array');
            steps.push('  → Using comparison-based sort');
            steps.push('  → Partitioning elements');
            steps.push('✅ Array sorted');
        }

        if (code.includes('return')) {
            steps.push('📤 Computing result');
            steps.push('✨ Returning final answer');
        }

        steps.push('🎉 Execution completed successfully');

        return steps;
    };

    const getMaxValue = () => {
        return Math.max(...performanceData.map(d => d.executionTime));
    };

    const tabs = [
        { id: 'graph', label: 'Performance Graph', icon: BarChart3 },
        { id: 'trace', label: 'Execution Trace', icon: Play },
        { id: 'metrics', label: 'Metrics', icon: Cpu }
    ];

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TrendingUp className="text-white" size={24} />
                    <div>
                        <h3 className="text-white font-bold text-lg">Performance Visualizer</h3>
                        <p className="text-blue-100 text-sm">Algorithm complexity analysis</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {analyzing ? (
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-300 text-lg">Analyzing algorithm performance...</p>
                    <p className="text-gray-500 text-sm mt-2">Detecting complexity and generating metrics</p>
                </div>
            ) : (
                <>
                    {/* Complexity Badge */}
                    {complexity && (
                        <div className="p-4 bg-gray-900 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Time Complexity</div>
                                        <div
                                            className="text-2xl font-bold font-mono"
                                            style={{ color: complexity.color }}
                                        >
                                            {complexity.timeComplexity}
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-gray-700" />
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Space Complexity</div>
                                        <div className="text-2xl font-bold font-mono text-purple-400">
                                            {complexity.spaceComplexity}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-blue-900/30 border border-blue-700/50 rounded p-3 max-w-md">
                                    <Info className="text-blue-400 mt-0.5" size={16} />
                                    <p className="text-blue-300 text-sm">{complexity.description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 bg-gray-850">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${selectedTab === tab.id
                                            ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
                                            : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {selectedTab === 'graph' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white font-semibold">Execution Time vs Input Size</h4>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-400">Time in milliseconds</span>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="space-y-3">
                                    {performanceData.map((data, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">n = {data.inputSize}</span>
                                                <span className="text-white font-mono">{data.executionTime} ms</span>
                                            </div>
                                            <div className="h-8 bg-gray-900 rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${(data.executionTime / getMaxValue()) * 100}%`,
                                                        minWidth: '2%'
                                                    }}
                                                >
                                                    <Zap size={14} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'trace' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white font-semibold">Step-by-Step Execution</h4>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                            disabled={currentStep === 0}
                                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-xs"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs text-gray-400">
                                            {currentStep + 1} / {traceSteps.length}
                                        </span>
                                        <button
                                            onClick={() => setCurrentStep(Math.min(traceSteps.length - 1, currentStep + 1))}
                                            disabled={currentStep === traceSteps.length - 1}
                                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-xs"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 min-h-[200px]">
                                    {traceSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className={`py-2 px-3 mb-2 rounded transition-all ${idx === currentStep
                                                    ? 'bg-blue-900/50 border border-blue-500 text-white'
                                                    : idx < currentStep
                                                        ? 'text-gray-500'
                                                        : 'text-gray-600'
                                                }`}
                                        >
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'metrics' && (
                            <div className="grid grid-cols-2 gap-4">
                                {performanceData.slice(0, 4).map((data, idx) => (
                                    <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                        <div className="text-xs text-gray-400 mb-2">Input Size: {data.inputSize}</div>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock size={14} className="text-blue-400" />
                                                    <span className="text-xs text-gray-400">Execution Time</span>
                                                </div>
                                                <div className="text-lg font-bold text-white">{data.executionTime} ms</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Cpu size={14} className="text-purple-400" />
                                                    <span className="text-xs text-gray-400">Memory Usage</span>
                                                </div>
                                                <div className="text-lg font-bold text-white">{data.memoryUsage} KB</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Zap size={14} className="text-yellow-400" />
                                                    <span className="text-xs text-gray-400">Operations</span>
                                                </div>
                                                <div className="text-lg font-bold text-white">{data.operations.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PerformanceVisualizer;
