'use client';

import { useState } from 'react';
import { Send, ArrowLeft, Phone, MoreVertical, Tag, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { formatPrice } from '@/lib/data';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
    type: 'text' | 'offer' | 'system';
    offerAmount?: number;
}

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState<string>('1');
    const [newMessage, setNewMessage] = useState('');

    const chats = [
        {
            id: '1',
            name: 'Arjun Mehta',
            product: 'Raymond Navy Blue Suit',
            price: 3200,
            lastMessage: 'Is it still available?',
            time: '2h ago',
            unread: 2,
            online: true,
        },
        {
            id: '2',
            name: 'Priya Sharma',
            product: 'Allen Solly Formal Shirt',
            price: 600,
            lastMessage: 'Can you do ₹500?',
            time: '1d ago',
            unread: 0,
            online: false,
        },
        {
            id: '3',
            name: 'Rohan Gupta',
            product: 'Woodland Formal Shoes',
            price: 1200,
            lastMessage: "Sure, let's meet at gate 3",
            time: '3d ago',
            unread: 0,
            online: true,
        },
    ];

    const [messages, setMessages] = useState<Record<string, Message[]>>({
        '1': [
            { id: '1', text: 'Hi! I saw your navy blue suit listing. Is it still available?', sender: 'other', time: '2:30 PM', type: 'text' },
            { id: '2', text: 'Yes, it\'s available! Would you like to see more photos?', sender: 'me', time: '2:32 PM', type: 'text' },
            { id: '3', text: 'That would be great! Also, is the price negotiable?', sender: 'other', time: '2:35 PM', type: 'text' },
            { id: '4', text: '', sender: 'other', time: '2:36 PM', type: 'offer', offerAmount: 2800 },
            { id: '5', text: 'I can do ₹3,000 — that\'s a fair deal. It\'s barely used.', sender: 'me', time: '2:40 PM', type: 'text' },
        ],
        '2': [
            { id: '1', text: 'Hello! Is the white shirt still listed?', sender: 'other', time: '10:00 AM', type: 'text' },
            { id: '2', text: 'Yes it is! Great condition.', sender: 'me', time: '10:15 AM', type: 'text' },
            { id: '3', text: 'Can you do ₹500?', sender: 'other', time: '10:20 AM', type: 'text' },
        ],
        '3': [
            { id: '1', text: 'I\'m interested in the shoes. Size 9, right?', sender: 'other', time: '9:00 AM', type: 'text' },
            { id: '2', text: 'Yes, UK Size 9. Want to meet and try them?', sender: 'me', time: '9:30 AM', type: 'text' },
            { id: '3', text: 'Sure, let\'s meet at gate 3', sender: 'other', time: '9:45 AM', type: 'text' },
        ],
    });

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const msg: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
        };
        setMessages({
            ...messages,
            [activeChat]: [...(messages[activeChat] || []), msg],
        });
        setNewMessage('');
    };

    const currentChat = chats.find((c) => c.id === activeChat);
    const currentMessages = messages[activeChat] || [];

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-20 h-screen flex">
                {/* Chat List Sidebar */}
                <div className="w-80 border-r border-dark-border bg-dark-surface hidden md:flex flex-col">
                    <div className="p-4 border-b border-dark-border">
                        <h2 className="text-lg font-bold text-dark-text">Messages</h2>
                        <p className="text-xs text-dark-text-muted mt-0.5">{chats.length} conversations</p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={`w-full text-left p-4 flex items-start gap-3 transition-all border-b border-dark-border/50 ${activeChat === chat.id ? 'bg-brand-primary/10 border-l-2 border-l-brand-primary' : 'hover:bg-dark-card'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm">
                                        {chat.name.charAt(0)}
                                    </div>
                                    {chat.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-condition-new border-2 border-dark-surface" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-dark-text text-sm truncate">{chat.name}</p>
                                        <span className="text-[10px] text-dark-text-muted">{chat.time}</span>
                                    </div>
                                    <p className="text-[11px] text-brand-primary truncate">{chat.product}</p>
                                    <p className="text-xs text-dark-text-secondary truncate mt-0.5">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1">
                                        {chat.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    {currentChat && (
                        <div className="glass border-b border-dark-border px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/buyer" className="md:hidden p-1">
                                    <ArrowLeft size={20} className="text-dark-text-secondary" />
                                </Link>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm">
                                    {currentChat.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-dark-text text-sm">{currentChat.name}</p>
                                    <p className="text-[11px] text-dark-text-muted">
                                        {currentChat.product} · {formatPrice(currentChat.price)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-xl text-dark-text-muted hover:text-dark-text hover:bg-dark-card transition-all">
                                    <Phone size={18} />
                                </button>
                                <button className="p-2 rounded-xl text-dark-text-muted hover:text-dark-text hover:bg-dark-card transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {currentMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'offer' ? (
                                    <div className="max-w-[280px] glass rounded-2xl p-4 border border-brand-accent/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag size={14} className="text-brand-accent" />
                                            <span className="text-xs font-semibold text-brand-accent uppercase">Offer Made</span>
                                        </div>
                                        <p className="text-2xl font-bold gradient-text">{formatPrice(msg.offerAmount || 0)}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center">Accept</button>
                                            <button className="btn-secondary text-xs py-1.5 px-3 flex-1 justify-center">Counter</button>
                                        </div>
                                        <p className="text-[10px] text-dark-text-muted mt-2 text-right">{msg.time}</p>
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.sender === 'me'
                                                ? 'bg-brand-primary text-white rounded-br-md'
                                                : 'bg-dark-card text-dark-text rounded-bl-md border border-dark-border'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-white/60' : 'text-dark-text-muted'
                                            }`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-dark-border bg-dark-surface">
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-xl text-dark-text-muted hover:text-dark-text hover:bg-dark-card transition-all">
                                <ImageIcon size={20} />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="input-field py-2.5 pr-12"
                                />
                                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-dark-text-muted hover:text-brand-accent hover:bg-dark-card transition-all">
                                    <Tag size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handleSend}
                                className="btn-primary py-2.5 px-4"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
