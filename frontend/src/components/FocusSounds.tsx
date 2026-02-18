import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, TreePine, Coffee, Wind, Music } from 'lucide-react';

interface Soundscape {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const FocusSounds: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSound, setSelectedSound] = useState<string>('rain');
    const [volume, setVolume] = useState(50);
    const [showControls, setShowControls] = useState(false);

    // For visualizer
    const [bars, setBars] = useState<number[]>(new Array(10).fill(20));

    const soundscapes: Soundscape[] = [
        { id: 'rain', label: 'Rain', icon: <CloudRain size={16} />, color: 'text-blue-400' },
        { id: 'forest', label: 'Forest', icon: <TreePine size={16} />, color: 'text-green-400' },
        { id: 'lofi', label: 'Lo-fi', icon: <Music size={16} />, color: 'text-purple-400' },
        { id: 'cafe', label: 'Cafe', icon: <Coffee size={16} />, color: 'text-orange-400' },
        { id: 'wind', label: 'Wind', icon: <Wind size={16} />, color: 'text-gray-400' },
    ];

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setBars(new Array(10).fill(0).map(() => Math.random() * (volume / 2) + 5));
            }, 150);
        } else {
            setBars(new Array(10).fill(5));
        }
        return () => clearInterval(interval);
    }, [isPlaying, volume]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowControls(!showControls)}
                className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${isPlaying ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-gray-700 hover:bg-gray-600 text-indigo-400'
                    }`}
                title="Focus Soundscapes"
            >
                {isPlaying ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
            </button>

            {showControls && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowControls(false)} />
                    <div className="absolute top-12 right-0 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Focus Sounds</span>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    }`}
                            >
                                {isPlaying ? 'Stop' : 'Play'}
                            </button>
                        </div>

                        {/* Visualizer */}
                        <div className="flex items-end justify-center gap-1 h-8 mb-4">
                            {bars.map((height, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-indigo-500 rounded-full transition-all duration-150"
                                    style={{ height: `${height}px` }}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {soundscapes.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSound(s.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${selectedSound === s.id
                                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-inner'
                                        : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                        }`}
                                    title={s.label}
                                >
                                    <div className={selectedSound === s.id ? s.color : 'text-gray-500'}>
                                        {s.icon}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Volume</span>
                                <span>{volume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                            <p className="text-[10px] text-gray-500 italic">"Stay focused, stay creative."</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FocusSounds;
