import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ShieldAlert, Award, Play, Pause, RotateCcw, User } from 'lucide-react';

interface InterviewSimulatorProps {
    isActive: boolean;
    onToggle: (state: boolean) => void;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ isActive, onToggle }) => {
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds
    const [isPaused, setIsPaused] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const timerRef = useRef<any>(null);

    const interviewerPrompts = [
        "Could you explain the time complexity of your current approach?",
        "How would this scale if the input size was 10^9?",
        "Are there any edge cases you've considered? What about null or empty inputs?",
        "Can we optimize the space complexity further?",
        "Think about the trade-offs between this approach and a recursive one.",
        "What happens if there are duplicate values in the input?",
        "Walk me through your logic for this specific conditional block."
    ];

    useEffect(() => {
        if (isActive && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, isPaused, timeLeft]);

    useEffect(() => {
        if (isActive) {
            // New prompt every 5-10 minutes
            const promptInterval = setInterval(() => {
                const randomPrompt = interviewerPrompts[Math.floor(Math.random() * interviewerPrompts.length)];
                setCurrentPrompt(randomPrompt);
            }, 300000); // 5 minutes

            // Initial prompt
            setCurrentPrompt("I'd like to see how you approach this. Start by explaining your strategy.");

            return () => clearInterval(promptInterval);
        }
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetInterview = () => {
        setTimeLeft(2700);
        setIsPaused(false);
        setCurrentPrompt('');
    };

    if (!isActive) return null;

    return (
        <div className="fixed top-20 left-6 w-80 bg-gray-900/90 backdrop-blur-md border border-red-500/30 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] z-40 overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="bg-red-600/10 px-4 py-3 border-b border-red-500/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-red-500 animate-pulse" size={18} />
                    <span className="text-sm font-black text-white uppercase tracking-tighter">Mock Interview</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${timeLeft < 300 ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {timeLeft < 300 ? 'CRITICAL' : 'ACTIVE'}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Timer Display */}
                <div className="text-center py-4 bg-gray-800/50 rounded-lg border border-gray-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-red-500/5 transition-all duration-1000" style={{ width: `${(timeLeft / 2700) * 100}%` }} />
                    <div className="relative">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Time Remaining</div>
                        <div className={`text-4xl font-mono font-black ${timeLeft < 300 ? 'text-red-500' : 'text-white'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                {/* Interviewer Interaction */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <User size={12} className="text-blue-400" />
                        <span>Interviewer Prompt</span>
                    </div>
                    <div className="bg-blue-600/5 border border-blue-500/20 p-3 rounded-lg relative">
                        <div className="absolute -top-1 -left-1">
                            <MessageSquare size={12} className="text-blue-500 fill-blue-500/20" />
                        </div>
                        <p className="text-xs text-gray-300 italic leading-relaxed">
                            "{currentPrompt || "Start by verbalizing your thought process..."}"
                        </p>
                    </div>
                </div>

                {/* Lockout Warning */}
                <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase mb-1">
                        <ShieldAlert size={12} />
                        <span>Restricted Mode</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Hints, AI Review, and logic explanations are disabled to simulate a real interview.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isPaused ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-300'
                            }`}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        onClick={resetInterview}
                        className="p-2 bg-gray-800 text-gray-500 hover:text-white rounded-lg transition-colors border border-transparent hover:border-gray-700"
                        title="Restart Interview"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={() => onToggle(false)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/20"
                    >
                        End
                    </button>
                </div>
            </div>

            {timeLeft === 0 && (
                <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <Award className="text-yellow-500 mb-4" size={48} />
                    <h4 className="text-lg font-black text-white mb-2 uppercase">Time's Up!</h4>
                    <p className="text-sm text-gray-400 mb-6">How did you do? Remember to reflect on your performance in the journal.</p>
                    <button
                        onClick={resetInterview}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default InterviewSimulator;
