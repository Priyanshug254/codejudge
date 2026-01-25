import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

const StreakCounter: React.FC = () => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Mock streak logic - in real app, fetch from backend
        const savedStreak = localStorage.getItem('codejudge_streak');
        const lastVisit = localStorage.getItem('codejudge_last_visit');
        const today = new Date().toDateString();

        if (savedStreak) {
            let currentStreak = parseInt(savedStreak);
            if (lastVisit !== today) {
                // If last visit was yesterday, increment. If older, reset (simplified logic)
                // For demo purposes, we'll just keep it or increment if it feels 'fresh'
                setStreak(currentStreak);
            } else {
                setStreak(currentStreak);
            }
        } else {
            setStreak(1);
            localStorage.setItem('codejudge_streak', '1');
        }
        localStorage.setItem('codejudge_last_visit', today);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20" title={`${streak} Day Streak!`}>
            <Flame size={16} className={streak > 0 ? "fill-orange-500 animate-pulse" : ""} />
            <span className="text-sm font-bold">{streak}</span>
        </div>
    );
};

export default StreakCounter;
