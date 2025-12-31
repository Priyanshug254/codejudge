import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import { ProblemRequest, TestCaseRequest } from '../types/problem';

const CreateProblem: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProblemRequest>({
        title: '',
        slug: '',
        description: '',
        difficulty: 'MEDIUM',
        timeLimitMs: 1000,
        memoryLimitMb: 256,
        testCases: []
    });

    const [testCase, setTestCase] = useState<TestCaseRequest>({
        input: '',
        expectedOutput: '',
        isHidden: true,
        weightage: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ProblemService.createProblem(formData);
            navigate('/problems');
        } catch (error) {
            console.error('Failed to create problem', error);
            alert('Failed to create problem');
        }
    };

    const addTestCase = () => {
        setFormData({
            ...formData,
            testCases: [...formData.testCases, testCase]
        });
        setTestCase({ input: '', expectedOutput: '', isHidden: true, weightage: 1 });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create New Problem</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input
                                type="text"
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description (Markdown)</label>
                        <textarea
                            className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 h-32"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Difficulty</label>
                            <select
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time Limit (ms)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5"
                                value={formData.timeLimitMs}
                                onChange={e => setFormData({ ...formData, timeLimitMs: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Memory Limit (MB)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5"
                                value={formData.memoryLimitMb}
                                onChange={e => setFormData({ ...formData, memoryLimitMb: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Test Cases ({formData.testCases.length})</h3>

                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Input</label>
                                    <textarea
                                        className="w-full bg-gray-800 border-gray-600 rounded p-2 text-sm"
                                        value={testCase.input}
                                        onChange={e => setTestCase({ ...testCase, input: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Expected Output</label>
                                    <textarea
                                        className="w-full bg-gray-800 border-gray-600 rounded p-2 text-sm"
                                        value={testCase.expectedOutput}
                                        onChange={e => setTestCase({ ...testCase, expectedOutput: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={testCase.isHidden}
                                        onChange={e => setTestCase({ ...testCase, isHidden: e.target.checked })}
                                    />
                                    Hidden
                                </label>
                                <button
                                    type="button"
                                    onClick={addTestCase}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                                >
                                    Add Test Case
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                    >
                        Create Problem
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProblem;
