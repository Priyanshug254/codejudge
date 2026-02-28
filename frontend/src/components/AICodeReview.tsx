import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, Info, Lightbulb, TrendingUp, X } from 'lucide-react';

import axios from 'axios';

interface ReviewIssue {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    category: 'quality' | 'performance' | 'security' | 'best-practice';
    title: string;
    description: string;
    line?: number;
    suggestion?: string;
}

interface AICodeReviewProps {
    code: string;
    language: string;
    onClose: () => void;
    problemDescription?: string;
}

const AICodeReview: React.FC<AICodeReviewProps> = ({ code, language, onClose, problemDescription }) => {
    const [issues, setIssues] = useState<ReviewIssue[]>([]);
    const [analyzing, setAnalyzing] = useState(true);
    const [complexityScore, setComplexityScore] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        const analyze = async () => {
            setAnalyzing(true);
            try {
                const response = await axios.post('http://localhost:8080/api/ai/analyze', {
                    code,
                    language,
                    problemDescription
                });
                setIssues(response.data.issues || []);
                setComplexityScore(response.data.complexityScore || 0);
            } catch (err) {
                console.error("Analysis failed", err);
            } finally {
                setAnalyzing(false);
            }
        };
        analyze();
    }, [code, language, problemDescription]);

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'border-red-500/50 bg-red-500/5';
            case 'warning': return 'border-yellow-500/50 bg-yellow-500/5';
            case 'info': return 'border-blue-500/50 bg-blue-500/5';
            default: return 'border-gray-700 bg-gray-900';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertCircle className="text-red-500" size={18} />;
            case 'warning': return <AlertCircle className="text-yellow-500" size={18} />;
            case 'info': return <Info className="text-blue-500" size={18} />;
            default: return null;
        }
    };

    const filteredIssues = selectedCategory === 'all'
        ? issues
        : issues.filter(i => i.category === selectedCategory);

    return (
        <div className="bg-gray-800 border-t border-gray-700 h-full flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Brain className="text-purple-400" size={18} />
                    <span className="text-sm font-bold text-white">Intelligent Code Review</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>

            {analyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 opacity-60">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                    <span className="text-xs text-purple-300 uppercase tracking-widest font-bold">LLM Reviewing Architecture...</span>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Summary Bar */}
                    <div className="px-4 py-2 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="text-purple-400" size={14} />
                                <span className="text-gray-400">Complexity:</span>
                                <span className={complexityScore > 70 ? 'text-red-400' : 'text-green-400'}>{complexityScore}/100</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                                <AlertCircle className="text-red-400" size={14} />
                                <span className="text-gray-400">Issues:</span>
                                <span className="text-white">{issues.length}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {['all', 'quality', 'performance', 'security'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2 py-0.5 rounded transition-colors ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredIssues.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <CheckCircle className="text-green-400 mb-2" size={32} />
                                <p className="text-sm">No critical issues detected in this fragment.</p>
                            </div>
                        ) : (
                            filteredIssues.map((issue) => (
                                <div key={issue.id} className={`p-3 rounded-lg border flex gap-3 transition-all hover:scale-[1.01] ${getSeverityStyles(issue.severity)}`}>
                                    <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-900/50 rounded border border-white/5 text-gray-500 uppercase tracking-tighter">
                                                {issue.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">{issue.description}</p>
                                        {issue.suggestion && (
                                            <div className="flex items-start gap-2 pt-1">
                                                <Lightbulb className="text-yellow-400 flex-shrink-0" size={12} />
                                                <p className="text-[11px] text-purple-200">
                                                    <span className="font-bold">Suggestion:</span> {issue.suggestion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICodeReview;
