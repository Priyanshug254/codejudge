import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, Info, Lightbulb, Shield, Zap, TrendingUp, X } from 'lucide-react';

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
}

const AICodeReview: React.FC<AICodeReviewProps> = ({ code, language, onClose }) => {
    const [issues, setIssues] = useState<ReviewIssue[]>([]);
    const [analyzing, setAnalyzing] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [complexityScore, setComplexityScore] = useState(0);

    useEffect(() => {
        analyzeCode();
    }, [code, language]);

    const analyzeCode = () => {
        setAnalyzing(true);

        // Simulate AI analysis delay
        setTimeout(() => {
            const detectedIssues: ReviewIssue[] = [];
            const lines = code.split('\n');
            let complexity = 0;

            // Code Quality Checks
            if (code.includes('var ') && language === 'javascript') {
                detectedIssues.push({
                    id: 'var-usage',
                    severity: 'warning',
                    category: 'best-practice',
                    title: 'Avoid using var',
                    description: 'Use let or const instead of var for better scoping',
                    suggestion: 'Replace var with let or const'
                });
            }

            // Check for single letter variable names (except i, j, k in loops)
            const singleLetterVars = code.match(/\b[a-hln-z]\s*=/gi);
            if (singleLetterVars && singleLetterVars.length > 0) {
                detectedIssues.push({
                    id: 'naming-convention',
                    severity: 'info',
                    category: 'quality',
                    title: 'Use descriptive variable names',
                    description: 'Single-letter variables make code harder to understand',
                    suggestion: 'Use meaningful names like "count", "index", "result"'
                });
            }

            // Performance: Nested loops detection
            const nestedLoops = (code.match(/for\s*\(/g) || []).length;
            if (nestedLoops >= 2) {
                complexity += 3;
                detectedIssues.push({
                    id: 'nested-loops',
                    severity: 'warning',
                    category: 'performance',
                    title: 'Nested loops detected',
                    description: 'Multiple nested loops can lead to O(n²) or worse complexity',
                    suggestion: 'Consider using hash maps or optimized algorithms'
                });
            }

            // Security: eval usage
            if (code.includes('eval(')) {
                detectedIssues.push({
                    id: 'eval-usage',
                    severity: 'critical',
                    category: 'security',
                    title: 'Dangerous eval() usage',
                    description: 'eval() can execute arbitrary code and is a security risk',
                    suggestion: 'Use safer alternatives like JSON.parse() or Function constructor'
                });
            }

            // Java specific checks
            if (language === 'java') {
                if (!code.includes('public class') && !code.includes('class Solution')) {
                    detectedIssues.push({
                        id: 'missing-class',
                        severity: 'critical',
                        category: 'quality',
                        title: 'Missing class declaration',
                        description: 'Java code should be wrapped in a class',
                        suggestion: 'Add "public class Solution { ... }"'
                    });
                }

                // Check for System.out.println in production code
                if (code.includes('System.out.println')) {
                    detectedIssues.push({
                        id: 'debug-statements',
                        severity: 'info',
                        category: 'quality',
                        title: 'Debug statements found',
                        description: 'Remove System.out.println before submission',
                        suggestion: 'Use a logging framework or remove debug prints'
                    });
                }
            }

            // Python specific checks
            if (language === 'python') {
                if (code.includes('import *')) {
                    detectedIssues.push({
                        id: 'wildcard-import',
                        severity: 'warning',
                        category: 'best-practice',
                        title: 'Avoid wildcard imports',
                        description: 'Wildcard imports can cause namespace pollution',
                        suggestion: 'Import specific functions/classes instead'
                    });
                }

                if (!code.trim().startsWith('def ') && !code.trim().startsWith('class ')) {
                    detectedIssues.push({
                        id: 'no-function',
                        severity: 'info',
                        category: 'quality',
                        title: 'Consider wrapping code in a function',
                        description: 'Functions make code more reusable and testable',
                        suggestion: 'Create a main function or solution class'
                    });
                }
            }

            // C++ specific checks
            if (language === 'cpp') {
                if (!code.includes('#include')) {
                    detectedIssues.push({
                        id: 'missing-includes',
                        severity: 'warning',
                        category: 'quality',
                        title: 'Missing include statements',
                        description: 'C++ code typically needs standard library includes',
                        suggestion: 'Add #include <iostream>, <vector>, etc.'
                    });
                }

                if (code.includes('using namespace std')) {
                    detectedIssues.push({
                        id: 'namespace-pollution',
                        severity: 'info',
                        category: 'best-practice',
                        title: 'Avoid "using namespace std"',
                        description: 'Can cause naming conflicts in larger projects',
                        suggestion: 'Use std:: prefix or specific using declarations'
                    });
                }
            }

            // General: Check for magic numbers
            const magicNumbers = code.match(/\b\d{2,}\b/g);
            if (magicNumbers && magicNumbers.length > 2) {
                detectedIssues.push({
                    id: 'magic-numbers',
                    severity: 'info',
                    category: 'quality',
                    title: 'Magic numbers detected',
                    description: 'Hard-coded numbers should be named constants',
                    suggestion: 'Define constants with meaningful names'
                });
            }

            // Performance: String concatenation in loops
            if ((code.includes('+=') || code.includes('+')) &&
                (code.includes('for') || code.includes('while'))) {
                detectedIssues.push({
                    id: 'string-concat',
                    severity: 'warning',
                    category: 'performance',
                    title: 'String concatenation in loop',
                    description: 'Repeated string concatenation is inefficient',
                    suggestion: 'Use StringBuilder (Java) or join() (Python)'
                });
            }

            // Calculate complexity score
            complexity += lines.length / 10;
            complexity += (code.match(/if\s*\(/g) || []).length;
            complexity += (code.match(/else/g) || []).length * 0.5;
            complexity += (code.match(/while\s*\(/g) || []).length * 1.5;

            setComplexityScore(Math.min(Math.round(complexity), 100));
            setIssues(detectedIssues);
            setAnalyzing(false);
        }, 1500);
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertCircle className="text-red-500" size={18} />;
            case 'warning':
                return <AlertCircle className="text-yellow-500" size={18} />;
            case 'info':
                return <Info className="text-blue-500" size={18} />;
            default:
                return <Info className="text-gray-500" size={18} />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'quality':
                return <CheckCircle size={16} />;
            case 'performance':
                return <Zap size={16} />;
            case 'security':
                return <Shield size={16} />;
            case 'best-practice':
                return <Lightbulb size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    const filteredIssues = selectedCategory === 'all'
        ? issues
        : issues.filter(issue => issue.category === selectedCategory);

    const getComplexityColor = () => {
        if (complexityScore < 30) return 'text-green-500';
        if (complexityScore < 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const categories = [
        { id: 'all', label: 'All Issues', count: issues.length },
        { id: 'quality', label: 'Quality', count: issues.filter(i => i.category === 'quality').length },
        { id: 'performance', label: 'Performance', count: issues.filter(i => i.category === 'performance').length },
        { id: 'security', label: 'Security', count: issues.filter(i => i.category === 'security').length },
        { id: 'best-practice', label: 'Best Practices', count: issues.filter(i => i.category === 'best-practice').length },
    ];

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Brain className="text-white" size={24} />
                    <div>
                        <h3 className="text-white font-bold text-lg">AI Code Review</h3>
                        <p className="text-purple-100 text-sm">Intelligent code analysis powered by AI</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Analysis Status */}
            {analyzing ? (
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-300 text-lg">Analyzing your code...</p>
                    <p className="text-gray-500 text-sm mt-2">Checking quality, performance, and security</p>
                </div>
            ) : (
                <>
                    {/* Metrics */}
                    <div className="p-4 bg-gray-900 border-b border-gray-700 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingUp className={getComplexityColor()} size={20} />
                                <span className={`text-2xl font-bold ${getComplexityColor()}`}>
                                    {complexityScore}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs">Complexity Score</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{issues.length}</div>
                            <p className="text-gray-400 text-xs">Total Issues</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">
                                {issues.filter(i => i.severity === 'critical').length}
                            </div>
                            <p className="text-gray-400 text-xs">Critical</p>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="p-4 bg-gray-850 border-b border-gray-700 flex gap-2 overflow-x-auto">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {cat.label} {cat.count > 0 && `(${cat.count})`}
                            </button>
                        ))}
                    </div>

                    {/* Issues List */}
                    <div className="p-4 max-h-96 overflow-y-auto">
                        {filteredIssues.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-300 font-medium">No issues found!</p>
                                <p className="text-gray-500 text-sm mt-1">Your code looks great 🎉</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredIssues.map(issue => (
                                    <div
                                        key={issue.id}
                                        className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-white font-semibold">{issue.title}</h4>
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
                                                        {getCategoryIcon(issue.category)}
                                                        <span className="capitalize">{issue.category}</span>
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-2">{issue.description}</p>
                                                {issue.suggestion && (
                                                    <div className="bg-purple-900/30 border border-purple-700/50 rounded p-2 mt-2">
                                                        <div className="flex items-start gap-2">
                                                            <Lightbulb className="text-purple-400 mt-0.5" size={14} />
                                                            <p className="text-purple-300 text-xs flex-1">
                                                                <strong>Suggestion:</strong> {issue.suggestion}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
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

export default AICodeReview;
