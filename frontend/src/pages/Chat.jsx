import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosConfig from '../api/axiosConfig';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I\'m the SynapticCare AI Clinical Assistant. I\'m here to help answer your health questions. How can I assist you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosConfig.get('/chat');
                if (res.data.messages && res.data.messages.length > 0) {
                    setMessages(res.data.messages.map(m => ({ id: m.id, sender: m.role === 'assistant' ? 'ai' : 'user', text: m.message })));
                }
            } catch (e) { console.error("Failed to load chat history:", e); }
        };
        fetchHistory();
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        const userMsg = { id: Date.now(), sender: 'user', text: inputMessage };
        setMessages(p => [...p, userMsg]);
        setInputMessage('');
        setIsTyping(true);
        try {
            const res = await axiosConfig.post('/chat', { message: inputMessage });
            setMessages(p => [...p, { id: res.data.aiMessage.id || Date.now() + 1, sender: 'ai', text: res.data.aiMessage.message }]);
        } catch {
            setMessages(p => [...p, { id: Date.now() + 1, sender: 'ai', text: "I apologize, I'm experiencing a connection issue. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center py-4 px-4">
            <div className="w-full max-w-3xl h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center relative">
                            <Bot className="w-5 h-5 text-white" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">AI Health Assistant</h2>
                            <p className="text-xs text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> HIPAA Compliant · Online</p>
                        </div>
                    </div>
                    <button onClick={async () => { try { setMessages([{ id: 1, sender: 'ai', text: 'History cleared. How can I help?' }]); await axiosConfig.delete('/chat'); } catch(e){} }}
                        title="Clear History" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50" data-lenis-prevent="true">
                    <div className="text-center text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest">Today</div>
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end gap-2.5 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm prose prose-sm max-w-none'}`}>
                                        {msg.sender === 'ai' ? (
                                            <ReactMarkdown components={{ strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>, a: ({children, href}) => <a href={href} className="text-blue-600 underline">{children}</a> }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center"><Bot className="w-4 h-4" /></div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-5 py-3.5 flex gap-1.5 shadow-sm">
                                {[0, 0.2, 0.4].map((d, i) => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d }} className="w-2 h-2 rounded-full bg-slate-400" />)}
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="flex items-end gap-3">
                        <textarea ref={inputRef} value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                            placeholder="Ask a health question or describe symptoms..."
                            rows="1"
                            className="input-medical flex-1 resize-none"
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={!inputMessage.trim() || isTyping}
                            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-sm disabled:opacity-50 transition-all active:scale-95 shrink-0">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center mt-2 text-xs text-slate-400 flex items-center justify-center gap-1"><Activity className="w-3 h-3" /> AI can make mistakes. Verify important medical information.</p>
                </div>
            </div>
        </div>
    );
};

export default Chat;
