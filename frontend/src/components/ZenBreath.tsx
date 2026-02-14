import React, { useState, useEffect } from 'react';
import { Wind, X, Pause, Play, RotateCcw } from 'lucide-react';

interface ZenBreathProps {
    onClose: () => void;
}

const ZenBreath: React.FC<ZenBreathProps> = ({ onClose }) => {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [seconds, setSeconds] = useState(4);
    const [isActive, setIsActive] = useState(false);
    const [totalCycles, setTotalCycles] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev === 1) {
                        return handlePhaseTransition();
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, phase]);

    const handlePhaseTransition = () => {
        switch (phase) {
            case 'inhale':
                setPhase('hold');
                return 7;
            case 'hold':
                setPhase('exhale');
                return 8;
            case 'exhale':
                setPhase('inhale');
                setTotalCycles(c => c + 1);
                return 4;
            default:
                return 4;
        }
    };

    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return 'Inhale deeply...';
            case 'hold': return 'Hold your breath...';
            case 'exhale': return 'Exhale slowly...';
        }
    };

    const getCircleScale = () => {
        if (!isActive) return 'scale-100';
        switch (phase) {
            case 'inhale': return 'scale-150 duration-[4000ms]';
            case 'hold': return 'scale-150 duration-[0ms]'; // Stay expanded
            case 'exhale': return 'scale-100 duration-[8000ms]';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale': return 'bg-cyan-400/30 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.4)]';
            case 'hold': return 'bg-purple-400/30 border-purple-400 shadow-[0_0_50px_rgba(192,132,252,0.4)]';
            case 'exhale': return 'bg-blue-400/30 border-blue-400 shadow-[0_0_50px_rgba(96,165,250,0.4)]';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Zen Breath
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Center your mind. Focus your code.</p>
                </div>

                <div className="relative h-64 flex items-center justify-center mb-8">
                    {/* Breathing Circle */}
                    <div
                        className={`w-32 h-32 rounded-full border-4 transition-all ease-in-out flex items-center justify-center ${getPhaseColor()} ${getCircleScale()}`}
                    >
                        <span className="text-4xl font-bold text-white drop-shadow-md">
                            {seconds}
                        </span>
                    </div>

                    {/* Orbiting particles (CSS only for now) */}
                    <div className="absolute inset-0 animate-spin-slow opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full blur-sm"></div>
                    </div>
                </div>

                <div className="h-8 mb-6">
                    <p className={`text-xl font-medium transition-opacity duration-300 ${isActive ? 'opacity-100 text-white' : 'opacity-0'}`}>
                        {getInstruction()}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isActive
                                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            }`}
                    >
                        {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                    </button>

                    <button
                        onClick={() => {
                            setIsActive(false);
                            setPhase('inhale');
                            setSeconds(4);
                            setTotalCycles(0);
                        }}
                        className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                {totalCycles > 0 && (
                    <div className="mt-6 text-sm text-gray-500">
                        Total Cycles: <span className="text-cyan-400 font-bold">{totalCycles}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZenBreath;
