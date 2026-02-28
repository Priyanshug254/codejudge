import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, X, Download, RotateCcw, Palette, Cloud, CloudOff, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ProblemScratchpadProps {
    onClose: () => void;
    problemId: string;
    username: string;
}

const ProblemScratchpad: React.FC<ProblemScratchpadProps> = ({ onClose, problemId, username }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const [lineWidth, setLineWidth] = useState(2);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.fillStyle = '#111827';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            loadFromCloud();
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

    const loadFromCloud = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/scratchpads/${problemId}/${username}`);
            if (response.data && response.data.canvasData) {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                };
                img.src = response.data.canvasData;
                setLastSaved(new Date());
            }
        } catch (error) {
            console.log("No previous scratchpad found or error loading.");
        } finally {
            setIsLoading(false);
        }
    };

    const saveToCloud = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsSaving(true);
        try {
            const dataUrl = canvas.toDataURL();
            await axios.post('http://localhost:8080/api/scratchpads/save', {
                problemId,
                username,
                canvasData: dataUrl
            });
            setLastSaved(new Date());
        } catch (error) {
            console.error("Save to cloud failed", error);
        } finally {
            setIsSaving(false);
        }
    };

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

            // Auto-save debounce effect (simplified for design)
            setTimeout(saveToCloud, 500);
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
                offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
                offsetY: (e as React.MouseEvent).nativeEvent.offsetY
            };
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveToCloud();
        }
    };

    const downloadDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `scratchpad-${problemId}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                            <Palette className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-tight">Cloud Scratchpad</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {isSaving ? (
                                    <div className="flex items-center gap-1.5">
                                        <Loader2 className="animate-spin text-blue-400" size={10} />
                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Syncing to cloud...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <Cloud className="text-emerald-400" size={10} />
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                                            {lastSaved ? `Synced at ${lastSaved.toLocaleTimeString()}` : 'Cloud Ready'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearCanvas} className="p-2.5 text-gray-400 hover:text-red-400 transition-colors" title="Clear Canvas">
                            <Trash2 size={20} />
                        </button>
                        <button onClick={downloadDrawing} className="p-2.5 text-gray-400 hover:text-blue-400 transition-colors" title="Export PNG">
                            <Download size={20} />
                        </button>
                        <div className="w-px h-6 bg-gray-800 mx-2" />
                        <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Toolbar */}
                    <div className="w-20 bg-gray-950/20 border-r border-gray-800 flex flex-col items-center py-6 gap-6">
                        <div className="flex flex-col gap-2">
                            <button onClick={() => setTool('pen')} className={`p-3 rounded-xl transition-all ${tool === 'pen' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-500 hover:bg-gray-800'}`}>
                                <Pencil size={22} />
                            </button>
                            <button onClick={() => setTool('eraser')} className={`p-3 rounded-xl transition-all ${tool === 'eraser' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                                <Eraser size={22} />
                            </button>
                        </div>

                        <div className="w-10 h-px bg-gray-800" />

                        <div className="flex flex-col gap-3">
                            {['#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => { setColor(c); setTool('pen'); }}
                                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-125 ${color === c && tool === 'pen' ? 'border-white scale-125' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>

                        <div className="w-10 h-px bg-gray-800" />

                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[10px] font-black text-gray-600 uppercase vertical-text">Size</span>
                            <input
                                type="range" min="1" max="25" value={lineWidth}
                                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                                className="w-24 -rotate-90 mt-8 accent-purple-500"
                            />
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative bg-gray-900 cursor-crosshair">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-gray-900 flex items-center justify-center">
                                <Loader2 className="animate-spin text-purple-500" size={40} />
                            </div>
                        )}
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
