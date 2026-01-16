import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, Trash2, RotateCcw } from 'lucide-react';
import ProblemService from '../services/problem.service';
import SubmissionService from '../services/submission.service';
import { Problem } from '../types/problem';
import { AuthContext } from '../context/AuthContext';
import Confetti from '../components/Confetti';

const ProblemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [problem, setProblem] = useState<Problem | null>(null);
    const [code, setCode] = useState<string>('// Write your code here');
    const [language, setLanguage] = useState('java');
    const [output, setOutput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (id) {
            loadProblem(id);
        }
    }, [id]);

    const loadProblem = async (problemId: string) => {
        try {
            const response = await ProblemService.getProblemById(problemId);
            setProblem(response.data);

            // Check local storage for draft
            const savedCode = localStorage.getItem(`codejudge_draft_${problemId}_${language}`);
            if (savedCode) {
                setCode(savedCode);
            } else {
                setCode(getDefaultCode('java'));
            }
        } catch (error) {
            console.error('Error loading problem', error);
        }
    };

    // Save code to local storage whenever it changes
    useEffect(() => {
        if (id && code) {
            localStorage.setItem(`codejudge_draft_${id}_${language}`, code);
        }
    }, [code, id, language]);

    const handleReset = () => {
        if (window.confirm('Reset code to default template? This will lose your current changes.')) {
            const defaultCode = getDefaultCode(language);
            setCode(defaultCode);
            if (id) {
                localStorage.removeItem(`codejudge_draft_${id}_${language}`);
            }
        }
    };

    const getDefaultCode = (lang: string) => {
        if (lang === 'java') return 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}';
        if (lang === 'python') return '# Write your code here\nprint("Hello World")';
        if (lang === 'cpp') return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code\n    return 0;\n}';
        return '';
    };

    const handleRun = async () => {
        setLoading(true);
        try {
            const response = await SubmissionService.runCode({
                code,
                language,
                problemId: Number(id)
            });
            setOutput(response.data.output || response.data.error || 'No output');
        } catch (error) {
            setOutput('Execution failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowConfetti(false); // Reset
        try {
            const response = await SubmissionService.submitCode({
                code,
                language,
                problemId: Number(id)
            });
            const data: any = response.data;

            let display = data.output || '';
            if (data.verdict) {
                display = `Verdict: ${data.verdict}\n\n${display}`;
            }
            setOutput(display);

            if (data.verdict === 'ACCEPTED') {
                setShowConfetti(true);
            }
        } catch (error) {
            setOutput('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            try {
                if (id) {
                    await ProblemService.deleteProblem(Number(id));
                    navigate('/problems');
                }
            } catch (error) {
                console.error("Delete failed", error);
                alert('Failed to delete problem');
            }
        }
    };

    if (!problem) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            <Confetti trigger={showConfetti} />
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">{problem.title}</h1>
                    <div className="flex gap-4 text-sm text-gray-400 mt-1">
                        <span className="text-yellow-500">{problem.difficulty}</span>
                        <span>Time: {problem.timeLimitMs}ms</span>
                        <span>Mem: {problem.memoryLimitMb}MB</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setCode(getDefaultCode(e.target.value));
                        }}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 focus:outline-none"
                    >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                    </select>
                    <button
                        onClick={handleReset}
                        className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        title="Reset Code"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded transition-colors"
                    >
                        <Play size={16} /> Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded transition-colors"
                    >
                        <Send size={16} /> Submit
                    </button>
                    {(user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_EXAMINER')) && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded transition-colors ml-2"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Description */}
                <div className="w-1/3 border-r border-gray-700 p-6 overflow-y-auto bg-gray-900">
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="whitespace-pre-wrap">{problem.description}</p>
                    </div>
                </div>

                {/* Right: Editor & Output */}
                <div className="w-2/3 flex flex-col">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language.toLowerCase()}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 16 }
                            }}
                        />
                    </div>

                    {/* Output Panel */}
                    <div className="h-48 bg-gray-800 border-t border-gray-700 flex flex-col">
                        <div className="px-4 py-2 border-b border-gray-700 text-sm font-medium text-gray-400 uppercase">
                            Output
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                            {loading ? (
                                <div className="text-gray-400 animate-pulse">Running code...</div>
                            ) : (
                                <pre className="whitespace-pre-wrap">{output || 'Run your code to see output'}</pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
