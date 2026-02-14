import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, X, Download, RotateCcw, Palette } from 'lucide-react';

interface ProblemScratchpadProps {
    onClose: () => void;
}

const ProblemScratchpad: React.FC<ProblemScratchpadProps> = ({ onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const [lineWidth, setLineWidth] = useState(2);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.fillStyle = '#111827'; // bg-gray-900
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                saveHistory();
            }
        }

        const handleResize = () => {
            if (canvas && canvas.parentElement) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx?.drawImage(canvas, 0, 0);

                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#111827';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(tempCanvas, 0, 0);
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);

        ctx.strokeStyle = tool === 'eraser' ? '#111827' : color;
        ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            ctx?.closePath();
            saveHistory();
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                offsetX: e.nativeEvent.offsetX,
                offsetY: e.nativeEvent.offsetY
            };
        }
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(imageData);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.putImageData(history[newIndex], 0, 0);
            }
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        }
    };

    const downloadDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'codejudge-scratchpad.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const colors = ['#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-800">
                    <div className="flex items-center gap-2">
                        <Palette className="text-purple-400" size={20} />
                        <h3 className="font-bold text-white">Scratchpad</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Undo"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Clear"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            onClick={downloadDrawing}
                            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                            title="Download"
                        >
                            <Download size={18} />
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-2" />
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar & Canvas Container */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Toolbar */}
                    <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4">
                        <button
                            onClick={() => setTool('pen')}
                            className={`p-3 rounded-lg transition-all ${tool === 'pen' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}
                            title="Pen"
                        >
                            <Pencil size={20} />
                        </button>
                        <button
                            onClick={() => setTool('eraser')}
                            className={`p-3 rounded-lg transition-all ${tool === 'eraser' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}
                            title="Eraser"
                        >
                            <Eraser size={20} />
                        </button>

                        <div className="w-8 h-px bg-gray-700 my-2" />

                        {/* Colors */}
                        <div className="flex flex-col gap-3">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        setColor(c);
                                        setTool('pen');
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === 'pen' ? 'border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>

                        <div className="w-8 h-px bg-gray-700 my-2" />

                        {/* Line Width */}
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(parseInt(e.target.value))}
                            className="w-24 -rotate-90 mt-8 accent-blue-500"
                            title="Brush Size"
                        />
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative bg-gray-900 cursor-crosshair">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="absolute inset-0 block touch-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemScratchpad;
