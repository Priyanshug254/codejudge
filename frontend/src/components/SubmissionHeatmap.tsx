import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SubmissionHeatmap: React.FC = () => {
    // Generate last 365 days
    const days = Array.from({ length: 365 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (364 - i));
        return {
            date: date.toISOString().split('T')[0],
            count: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0 // Mock data: 20% chance of activity
        };
    });

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-800 border-gray-700';
        if (count === 1) return 'bg-green-900 border-green-800';
        if (count === 2) return 'bg-green-700 border-green-600';
        if (count === 3) return 'bg-green-500 border-green-400';
        return 'bg-green-400 border-green-300';
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-8 overflow-x-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Submission Activity</h3>
            <div className="flex gap-1 min-w-max">
                {/* Simplified Grid: 7 rows (days of week) x 52 columns (weeks) */}
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-sm border ${getColor(day.count)}`}
                            title={`${day.date}: ${day.count} submissions`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-900 border border-green-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-700 border border-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 border border-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 border border-green-300 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default SubmissionHeatmap;
