import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, Copy, Check, X, Send, Wifi, WifiOff, Crown, LogOut } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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

    const stompClientRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const userIdRef = useRef(`user-${Math.floor(Math.random() * 1000)}`);
    const userNameRef = useRef(`User-${userIdRef.current.split('-')[1]}`);

    const userColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];

    const connectToSession = (sid: string) => {
        const socket = new SockJS('http://localhost:8080/ws-collab');
        const client = Stomp.over(socket);
        client.debug = () => { }; // Disable debug logging

        client.connect({}, () => {
            setIsConnected(true);
            stompClientRef.current = client;

            // Subscribe to session topic
            client.subscribe(`/topic/session/${sid}`, (message) => {
                const data = JSON.parse(message.body);
                handleIncomingMessage(data);
            });

            // Join the session
            client.send(`/app/collab/${sid}`, {}, JSON.stringify({
                sessionId: sid,
                userId: userIdRef.current,
                userName: userNameRef.current,
                type: 'JOIN',
                content: 'Joined the session'
            }));
        }, (err) => {
            console.error("WebSocket connection error:", err);
            setIsConnected(false);
        });
    };

    const handleIncomingMessage = (data: any) => {
        if (data.userId === userIdRef.current) return; // Skip own messages

        switch (data.type) {
            case 'CODE_UPDATE':
                onCodeChange(data.content);
                break;
            case 'CHAT':
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    userId: data.userId,
                    userName: data.userName,
                    message: data.content,
                    timestamp: Date.now()
                }]);
                break;
            case 'CURSOR_UPDATE':
                setParticipants(prev => {
                    const existing = prev.find(p => p.id === data.userId);
                    if (existing) {
                        return prev.map(p => p.id === data.userId
                            ? { ...p, cursorPosition: data.cursor }
                            : p
                        );
                    }
                    return [...prev, {
                        id: data.userId,
                        name: data.userName,
                        color: userColors[prev.length % userColors.length],
                        avatar: '👤',
                        isHost: false,
                        cursorPosition: data.cursor
                    }];
                });
                break;
            case 'JOIN':
                addSystemMessage(`${data.userName} joined`);
                break;
        }
    };

    const startSession = () => {
        const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setSessionId(newSessionId);
        setIsActive(true);
        connectToSession(newSessionId);
        setShowInvite(true);

        // Add self
        setParticipants([{
            id: userIdRef.current,
            name: 'You',
            color: userColors[0],
            avatar: '👨‍💻',
            isHost: true
        }]);
    };

    const endSession = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }
        setIsActive(false);
        setIsConnected(false);
        setParticipants([]);
        setMessages([]);
        setSessionId('');
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !isConnected) return;

        const msg = {
            sessionId,
            userId: userIdRef.current,
            userName: userNameRef.current,
            type: 'CHAT',
            content: newMessage
        };

        stompClientRef.current.send(`/app/collab/${sessionId}`, {}, JSON.stringify(msg));

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            userId: userIdRef.current,
            userName: 'You',
            message: newMessage,
            timestamp: Date.now()
        }]);
        setNewMessage('');
    };

    // Propagate code shifts
    useEffect(() => {
        if (isActive && isConnected && stompClientRef.current) {
            // In a real app, we'd throttle this or use CRDTs
            const timer = setTimeout(() => {
                stompClientRef.current.send(`/app/collab/${sessionId}`, {}, JSON.stringify({
                    sessionId,
                    userId: userIdRef.current,
                    userName: userNameRef.current,
                    type: 'CODE_UPDATE',
                    content: code
                }));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [code, isActive, isConnected, sessionId]);

    const addSystemMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            userId: 'system',
            userName: 'System',
            message: text,
            timestamp: Date.now()
        }]);
    };

    const copySessionLink = () => {
        const link = `${window.location.origin}/session/${sessionId}?problem=${problemId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                    <span>{isConnected ? 'Live' : 'Disconnected'}</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-xs font-medium">{participants.length}</span>
                </div>

                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-1.5 rounded transition-colors ${showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    <MessageCircle size={14} />
                </button>

                <button
                    onClick={() => setShowInvite(!showInvite)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                    Invite
                </button>

                <button
                    onClick={endSession}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                    <LogOut size={14} />
                </button>
            </div>

            {showInvite && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-lg">Live Collaboration</h3>
                            <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-white">
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
                                    <button onClick={copySessionLink} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showChat && (
                <div className="fixed right-4 bottom-4 w-80 h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-40">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between rounded-t-lg">
                        <span className="text-white font-semibold">Session Chat</span>
                        <button onClick={() => setShowChat(false)} className="text-white hover:bg-white/20 p-1 rounded">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {messages.map(msg => (
                            <div key={msg.id} className={`${msg.userId === 'system' ? 'text-center text-xs text-gray-500' : 'max-w-[80%] ' + (msg.userId === userIdRef.current ? 'ml-auto' : '')}`}>
                                {msg.userId !== 'system' && (
                                    <div className={`p-2 rounded-lg ${msg.userId === userIdRef.current ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        <div className="text-xs font-bold mb-1">{msg.userName}</div>
                                        <div className="text-sm">{msg.message}</div>
                                    </div>
                                )}
                                {msg.userId === 'system' && <div className="italic">{msg.message}</div>}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Message..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                            />
                            <button onClick={sendMessage} className="p-2 bg-blue-600 rounded">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CollaborativeSession;
