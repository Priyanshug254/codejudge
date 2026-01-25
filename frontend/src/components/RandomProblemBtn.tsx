import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle } from 'lucide-react';

interface RandomProblemBtnProps {
    problemIds: number[];
}

const RandomProblemBtn: React.FC<RandomProblemBtnProps> = ({ problemIds }) => {
    const navigate = useNavigate();

    const handleRandom = () => {
        if (problemIds.length === 0) return;
        const randomIndex = Math.floor(Math.random() * problemIds.length);
        const randomId = problemIds[randomIndex];
        navigate(`/problems/${randomId}`);
    };

    return (
        <button
            onClick={handleRandom}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg transition-all shadow-lg hover:shadow-pink-500/25"
            title="I'm Feeling Lucky"
        >
            <Shuffle size={20} />
            <span>Random</span>
        </button>
    );
};

export default RandomProblemBtn;
