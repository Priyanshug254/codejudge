import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';

interface VoiceControlProps {
    onRun: () => void;
    onSubmit: () => void;
    onClear: () => void;
    onFormat: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onRun, onSubmit, onClear, onFormat }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript.toLowerCase().trim();
                setTranscript(transcriptText);

                if (event.results[current].isFinal) {
                    processCommand(transcriptText);
                    setTimeout(() => setTranscript(''), 2000);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    recognitionRef.current.start();
                }
            };
        } else {
            console.warn('Speech recognition not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isListening]);

    const processCommand = (command: string) => {
        if (command.includes('run code') || command.includes('execute')) {
            onRun();
        } else if (command.includes('submit solution') || command.includes('submit code')) {
            onSubmit();
        } else if (command.includes('clear editor') || command.includes('reset code')) {
            onClear();
        } else if (command.includes('format code') || command.includes('prettify')) {
            onFormat();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    if (!recognitionRef.current) return null;

    return (
        <div className="relative group">
            <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-400'}`}
                title={isListening ? "Listening... (Say 'Run Code', 'Submit', 'Clear')" : "Enable Voice Commands"}
            >
                {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            {isListening && (
                <div className="absolute top-12 right-0 w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <Command size={12} />
                        <span>Voice Commands</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex justify-between"><span>"Run Code"</span> <span className="text-gray-500">→ Run</span></div>
                        <div className="flex justify-between"><span>"Submit"</span> <span className="text-gray-500">→ Submit</span></div>
                        <div className="flex justify-between"><span>"Clear"</span> <span className="text-gray-500">→ Reset</span></div>
                    </div>
                    {transcript && (
                        <div className="mt-3 pt-2 border-t border-gray-700 text-center">
                            <span className="text-xs italic text-blue-400">"{transcript}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VoiceControl;
