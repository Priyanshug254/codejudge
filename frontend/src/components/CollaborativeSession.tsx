import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, Copy, Check, X, Send, Wifi, WifiOff, Crown, LogOut } from 'lucide-react';

interface Participant {
    id: string;
    name: string;
    color: string;
    avatar: string;
    isHost: boolean;
    cursorPosition?: { line: number; column: number };
}

interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: number;
}

interface CollaborativeSessionProps {
    code: string;
    onCodeChange: (code: string) => void;
    language: string;
    problemId: string;
}

const CollaborativeSession: React.FC<CollaborativeSessionProps> = ({
    code,
    onCodeChange,
    language,
    problemId
}) => {
    const [isActive, setIsActive] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Generate random session ID
    const generateSessionId = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // User colors for cursors
    const userColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];

    // Start a new session
    const startSession = () => {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setIsActive(true);
        setIsConnected(true);
        setShowInvite(true);

        // Add current user as host
        const currentUser: Participant = {
            id: 'user-1',
            name: 'You',
            color: userColors[0],
            avatar: '👨‍💻',
            isHost: true
        };
        setParticipants([currentUser]);

        // Simulate other users joining (for demo)
        setTimeout(() => {
            const newUser: Participant = {
                id: 'user-2',
                name: 'Alice',
                color: userColors[1],
                avatar: '👩‍💻',
                isHost: false,
                cursorPosition: { line: 5, column: 10 }
            };
            setParticipants(prev => [...prev, newUser]);
            addSystemMessage('Alice joined the session');
        }, 3000);

        setTimeout(() => {
            const newUser: Participant = {
                id: 'user-3',
                name: 'Bob',
                color: userColors[2],
                avatar: '🧑‍💻',
                isHost: false,
                cursorPosition: { line: 12, column: 5 }
            };
            setParticipants(prev => [...prev, newUser]);
            addSystemMessage('Bob joined the session');
        }, 6000);
    };

    // End session
    const endSession = () => {
        setIsActive(false);
        setIsConnected(false);
        setParticipants([]);
        setMessages([]);
        setSessionId('');
        addSystemMessage('Session ended');
    };

    // Add system message
    const addSystemMessage = (text: string) => {
        const msg: ChatMessage = {
            id: Date.now().toString(),
            userId: 'system',
            userName: 'System',
            message: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, msg]);
    };

    // Send chat message
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            userId: 'user-1',
            userName: 'You',
            message: newMessage,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage('');

        // Simulate responses from other users (for demo)
        if (Math.random() > 0.5) {
            setTimeout(() => {
                const responses = [
                    'Great idea!',
                    'Let me try that approach',
                    'I think we should optimize this part',
                    'Good catch!',
                    'What about edge cases?'
                ];
                const randomUser = participants[Math.floor(Math.random() * (participants.length - 1)) + 1];
                if (randomUser) {
                    const response: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        userId: randomUser.id,
                        userName: randomUser.name,
                        message: responses[Math.floor(Math.random() * responses.length)],
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, response]);
                }
            }, 2000);
        }
    };

    // Copy session link
    const copySessionLink = () => {
        const link = `https://codejudge.dev/session/${sessionId}?problem=${problemId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Simulate code sync (in real app, this would use WebSocket)
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            // Simulate cursor position updates
            setParticipants(prev => prev.map(p => {
                if (p.id === 'user-1') return p;
                return {
                    ...p,
                    cursorPosition: {
                        line: Math.floor(Math.random() * 20) + 1,
                        column: Math.floor(Math.random() * 40) + 1
                    }
                };
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) {
        return (
            <button
                onClick={startSession}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                title="Start Collaborative Session"
            >
                <Users size={16} />
                <span className="text-sm">Go Live</span>
            </button>
        );
    }

    return (
        <>
            {/* Session Controls */}
            <div className="flex items-center gap-2">
                {/* Connection Status */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                    <span>{isConnected ? 'Live' : 'Disconnected'}</span>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-xs font-medium">{participants.length}</span>
                </div>

                {/* Chat Toggle */}
                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-1.5 rounded transition-colors ${showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    title="Toggle Chat"
                >
                    <MessageCircle size={14} />
                </button>

                {/* Invite Button */}
                <button
                    onClick={() => setShowInvite(!showInvite)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                    title="Invite Others"
                >
                    Invite
                </button>

                {/* End Session */}
                <button
                    onClick={endSession}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    title="End Session"
                >
                    <LogOut size={14} />
                </button>
            </div>

            {/* Invite Modal */}
            {showInvite && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-lg">Invite to Session</h3>
                            <button
                                onClick={() => setShowInvite(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Session ID</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={sessionId}
                                        readOnly
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono"
                                    />
                                    <button
                                        onClick={copySessionLink}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Share Link</label>
                                <div className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 break-all">
                                    https://codejudge.dev/session/{sessionId}?problem={problemId}
                                </div>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-700/50 rounded p-3">
                                <p className="text-blue-300 text-sm">
                                    💡 Share this link with others to collaborate in real-time!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Panel */}
            {showChat && (
                <div className="fixed right-4 bottom-4 w-80 h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-40">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={18} className="text-white" />
                            <span className="text-white font-semibold">Live Chat</span>
                        </div>
                        <button
                            onClick={() => setShowChat(false)}
                            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Participants List */}
                    <div className="p-2 bg-gray-900 border-b border-gray-700">
                        <div className="flex gap-2 overflow-x-auto">
                            {participants.map(p => (
                                <div
                                    key={p.id}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded-full whitespace-nowrap"
                                    style={{ borderLeft: `3px solid ${p.color}` }}
                                >
                                    <span className="text-sm">{p.avatar}</span>
                                    <span className="text-xs text-gray-300">{p.name}</span>
                                    {p.isHost && <Crown size={10} className="text-yellow-500" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${msg.userId === 'system'
                                        ? 'text-center text-xs text-gray-500 italic'
                                        : msg.userId === 'user-1'
                                            ? 'ml-auto'
                                            : ''
                                    } max-w-[80%]`}
                            >
                                {msg.userId !== 'system' && (
                                    <div className={`rounded-lg p-2 ${msg.userId === 'user-1'
                                            ? 'bg-blue-600 text-white ml-auto'
                                            : 'bg-gray-700 text-gray-100'
                                        }`}>
                                        {msg.userId !== 'user-1' && (
                                            <div className="text-xs font-semibold mb-1 text-blue-300">
                                                {msg.userName}
                                            </div>
                                        )}
                                        <div className="text-sm">{msg.message}</div>
                                    </div>
                                )}
                                {msg.userId === 'system' && <div>{msg.message}</div>}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cursor Indicators (overlay on editor) */}
            <div className="fixed top-20 right-4 space-y-1 z-30">
                {participants.filter(p => p.id !== 'user-1' && p.cursorPosition).map(p => (
                    <div
                        key={p.id}
                        className="flex items-center gap-2 px-2 py-1 bg-gray-800/90 border rounded text-xs backdrop-blur-sm"
                        style={{ borderColor: p.color }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: p.color }}
                        />
                        <span className="text-white">{p.name}</span>
                        <span className="text-gray-400">
                            L{p.cursorPosition?.line}:C{p.cursorPosition?.column}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CollaborativeSession;
