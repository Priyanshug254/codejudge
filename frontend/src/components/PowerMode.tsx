import React, { useEffect, useState, useRef } from 'react';
import { Zap, Flame } from 'lucide-react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    size: number;
}

interface PowerModeProps {
    isActive: boolean;
    onClose: () => void;
}

const PowerMode: React.FC<PowerModeProps> = ({ isActive, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const particlesRef = useRef<Particle[]>([]);
    const lastKeyTimeRef = useRef<number>(Date.now());
    const comboTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore non-character keys
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

            spawnParticles();
            incrementCombo();
            shakeScreen();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;

        let animationFrame: number;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const animate = () => {
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Update and draw particles
                particlesRef.current = particlesRef.current.filter(p => p.life > 0);
                particlesRef.current.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= 0.02;
                    p.vy += 0.2; // Gravity

                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, [isActive]);

    // Resize canvas
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const spawnParticles = () => {
        // Approximate cursor position (hard to get exact from Monaco without passing ref)
        // For now, spawn at random location or center for effect
        // In a real integration, we'd use editor.getScrolledVisiblePosition(editor.getPosition())

        // Simulating cursor position for "juice" effect
        // A better approach would be to pass the cursor coordinates from the editor component
        // But for this overlay, we'll spawn near the center-bottom or based on mouse for fun

        // Let's use a random position in the center area for the "explosion"
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
        const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;

        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 5 + Math.min(combo, 10); i++) {
            particlesRef.current.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                color: color,
                life: 1.0,
                size: Math.random() * 4 + 2
            });
        }
    };

    const incrementCombo = () => {
        setCombo(prev => {
            const next = prev + 1;
            if (next > maxCombo) setMaxCombo(next);
            return next;
        });
        lastKeyTimeRef.current = Date.now();

        if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = setTimeout(() => {
            setCombo(0);
        }, 2000); // 2 seconds to keep combo
    };

    const shakeScreen = () => {
        if (combo < 5) return;

        const intensity = Math.min(combo, 20);
        const x = (Math.random() - 0.5) * intensity;
        const y = (Math.random() - 0.5) * intensity;

        document.body.style.transform = `translate(${x}px, ${y}px)`;
        setTimeout(() => {
            document.body.style.transform = 'none';
        }, 50);
    };

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Combo Counter */}
            {combo > 0 && (
                <div className="absolute top-20 right-20 animate-bounce">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-yellow-500 to-red-500 p-4 rounded-xl transform rotate-12 border-4 border-white shadow-2xl">
                            <div className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-2">
                                {combo}x <Flame className="animate-fire" />
                            </div>
                            <div className="text-xs font-bold text-yellow-200 uppercase tracking-widest text-center mt-1">
                                Combo!
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Max Combo Badge */}
            {maxCombo > 10 && (
                <div className="absolute top-24 right-64 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-400">
                    Max Combo: <span className="text-yellow-400 font-bold">{maxCombo}</span>
                </div>
            )}

            {/* Close Button (pointer-events-auto to capture clicks) */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-all text-sm font-bold"
                >
                    <Zap size={16} /> Disable Power Mode
                </button>
            </div>
        </div>
    );
};

export default PowerMode;
