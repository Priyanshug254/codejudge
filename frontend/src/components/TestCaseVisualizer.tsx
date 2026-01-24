import React, { useState } from 'react';
import { TestTube, ChevronDown, ChevronUp } from 'lucide-react';

interface TestCase {
    id: number;
    input: string;
    expectedOutput: string;
    description?: string;
}

const mockTestCases: TestCase[] = [
    {
        id: 1,
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '15',
        description: 'Sum of array elements'
    },
    {
        id: 2,
        input: '[10, 20, 30]',
        expectedOutput: '60',
        description: 'Sum of larger numbers'
    },
    {
        id: 3,
        input: '[-1, -2, -3]',
        expectedOutput: '-6',
        description: 'Sum of negative numbers'
    }
];

interface TestCaseVisualizerProps {
    problemId: number;
}

const TestCaseVisualizer: React.FC<TestCaseVisualizerProps> = ({ problemId }) => {
    const [expandedCases, setExpandedCases] = useState<Set<number>>(new Set([1]));

    const toggleCase = (id: number) => {
        const newExpanded = new Set(expandedCases);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCases(newExpanded);
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TestTube className="text-cyan-400" size={20} />
                Test Cases
            </h3>

            <div className="space-y-2">
                {mockTestCases.map((testCase) => {
                    const isExpanded = expandedCases.has(testCase.id);

                    return (
                        <div
                            key={testCase.id}
                            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCase(testCase.id)}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-750 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-sm font-medium">
                                        Case {testCase.id}
                                    </span>
                                    {testCase.description && (
                                        <span className="text-sm text-gray-400">
                                            {testCase.description}
                                        </span>
                                    )}
                                </div>
                                {isExpanded ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="p-4 border-t border-gray-700 space-y-3">
                                    {/* Input */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">
                                            Input:
                                        </label>
                                        <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-sm font-mono text-green-400 overflow-x-auto">
                                            {testCase.input}
                                        </pre>
                                    </div>

                                    {/* Expected Output */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">
                                            Expected Output:
                                        </label>
                                        <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-sm font-mono text-blue-400 overflow-x-auto">
                                            {testCase.expectedOutput}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300">
                    💡 <strong>Tip:</strong> Your code will be tested against these cases plus additional hidden test cases.
                </p>
            </div>
        </div>
    );
};

export default TestCaseVisualizer;
