import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, ChevronDown, Sparkles, Code2, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface AIAnalysis {
    summary: string;
    detailedAnalysis: Record<string, string>;
    suggestion: string;
}

interface AICodeExplainerProps {
    code: string;
    language: string;
    problemDescription?: string;
    onClose: () => void;
}

const AICodeExplainer: React.FC<AICodeExplainerProps> = ({ code, language, problemDescription, onClose }) => {
    const [explaining, setExplaining] = useState(true);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    useEffect(() => {
        const analyzeCode = async () => {
            setExplaining(true);
            setError(null);
            try {
                const response = await axios.post('http://localhost:8080/api/ai/analyze', {
                    code,
                    language,
                    problemDescription: problemDescription || "N/A"
                });
                setAnalysis(response.data);
                if (response.data.detailedAnalysis) {
                    setExpandedKey(Object.keys(response.data.detailedAnalysis)[0]);
                }
            } catch (err) {
                console.error("AI Analysis failed:", err);
                setError("Failed to connect to AI Mentor. Please ensure the backend is running.");
            } finally {
                setExplaining(false);
            }
        };

        analyzeCode();
    }, [code, language, problemDescription]);

    return (
        <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div className="flex items-center gap-2">
                    <Brain className="text-purple-400" size={18} />
                    <span className="text-sm font-bold text-gray-200">AI Code Mentor</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <Sparkles size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {explaining ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-400 animate-pulse">Consulting AI Mentor...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <AlertCircle className="text-red-400 mb-2" size={32} />
                        <p className="text-sm text-gray-400">{error}</p>
                    </div>
                ) : analysis ? (
                    <>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {analysis.summary}
                            </p>
                        </div>

                        {Object.entries(analysis.detailedAnalysis).map(([key, value]) => (
                            <div
                                key={key}
                                className={`border rounded-lg transition-all ${expandedKey === key ? 'border-purple-500/50 bg-purple-500/5' : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'}`}
                            >
                                <button
                                    onClick={() => setExpandedKey(expandedKey === key ? null : key)}
                                    className="w-full flex items-center justify-between p-3 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded bg-gray-800 ${expandedKey === key ? 'text-purple-400' : 'text-gray-400'}`}>
                                            <Code2 size={14} />
                                        </div>
                                        <div className="text-sm font-medium text-gray-200">{key}</div>
                                    </div>
                                    {expandedKey === key ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </button>

                                {expandedKey === key && (
                                    <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2">
                                        <div className="pl-9 text-sm text-gray-400 leading-relaxed">
                                            {value}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                ) : null}
            </div>

            {!explaining && !error && analysis && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-2 text-xs text-purple-400/80 mb-2 font-semibold">
                        <Sparkles size={12} />
                        <span>Tactical Suggestion:</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{analysis.suggestion}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default AICodeExplainer;
