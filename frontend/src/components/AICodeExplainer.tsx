import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, ChevronDown, Sparkles, Code2, BookOpen } from 'lucide-react';

interface ExplanationStep {
    lineRange: string;
    description: string;
    logic: string;
}

interface AICodeExplainerProps {
    code: string;
    language: string;
    onClose: () => void;
}

const AICodeExplainer: React.FC<AICodeExplainerProps> = ({ code, language, onClose }) => {
    const [explaining, setExplaining] = useState(true);
    const [explanation, setExplanation] = useState<ExplanationStep[]>([]);
    const [expandedStep, setExpandedStep] = useState<number | null>(0);

    useEffect(() => {
        const analyzeCode = () => {
            setExplaining(true);
            // Simulate AI analysis delay
            setTimeout(() => {
                const steps = generateMockExplanation(code, language);
                setExplanation(steps);
                setExplaining(false);
            }, 1800);
        };

        analyzeCode();
    }, [code, language]);

    const generateMockExplanation = (code: string, _lang: string): ExplanationStep[] => {
        // Simple logic to generate relevant-looking explanations based on code structure
        const steps: ExplanationStep[] = [];

        if (code.includes('for') || code.includes('while')) {
            steps.push({
                lineRange: 'Loops Section',
                description: 'Found iteration logic.',
                logic: 'The algorithm uses loops to traverse the input data. This usually indicates O(n) or O(n²) complexity depending on nesting.'
            });
        }

        if (code.includes('if') || code.includes('else')) {
            steps.push({
                lineRange: 'Conditional Logic',
                description: 'Dynamic branching detected.',
                logic: 'The code branches based on specific conditions, handles edge cases or alternative paths for different inputs.'
            });
        }

        if (code.includes('return')) {
            steps.push({
                lineRange: 'Final Result',
                description: 'Output generation.',
                logic: 'The function returns the calculated result. Ensure the return type matches the problem specification.'
            });
        }

        if (steps.length === 0) {
            steps.push({
                lineRange: 'Overall Structure',
                description: 'Sequential code execution.',
                logic: 'Standard linear execution of statements without complex control flow structures.'
            });
        }

        return steps;
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div className="flex items-center gap-2">
                    <Brain className="text-purple-400" size={18} />
                    <span className="text-sm font-bold text-gray-200">AI Code Explainer</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <Sparkles size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {explaining ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-400 animate-pulse">Analyzing logic patterns...</p>
                    </div>
                ) : (
                    explanation.map((step, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg transition-all ${expandedStep === index ? 'border-purple-500/50 bg-purple-500/5' : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'}`}
                        >
                            <button
                                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                                className="w-full flex items-center justify-between p-3 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded bg-gray-800 ${expandedStep === index ? 'text-purple-400' : 'text-gray-400'}`}>
                                        <Code2 size={14} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{step.lineRange}</div>
                                        <div className="text-sm font-medium text-gray-200">{step.description}</div>
                                    </div>
                                </div>
                                {expandedStep === index ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>

                            {expandedStep === index && (
                                <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2">
                                    <div className="pl-9 space-y-2">
                                        <div className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed italic">
                                            <BookOpen size={14} className="mt-1 flex-shrink-0" />
                                            <p>{step.logic}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {!explaining && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-2 text-xs text-purple-400/80 mb-2 font-semibold">
                        <Sparkles size={12} />
                        <span>AI Suggestion:</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        This explanation is generated based on structural analysis. For deeper insights, try adding comments to your code.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AICodeExplainer;
