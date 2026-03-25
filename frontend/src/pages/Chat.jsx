import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Activity, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosConfig from '../api/axiosConfig';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello. I am the Synaptic Care AI Clinical Assistant. How can I assist you with your health today?' }
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
                    const formattedHistory = res.data.messages.map(msg => ({
                        id: msg.id,
                        sender: msg.role === 'assistant' ? 'ai' : 'user',
                        text: msg.message
                    }));
                    setMessages(formattedHistory);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };
        fetchHistory();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = { id: Date.now(), sender: 'user', text: inputMessage };
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await axiosConfig.post('/chat', { message: inputMessage });
            const aiMessage = { id: response.data.aiMessage.id || Date.now() + 1, sender: 'ai', text: response.data.aiMessage.message };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "I apologize, but I am experiencing connection issues with my neural network. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    // Auto-resizing textarea
    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex flex-col items-center">
            
            <div className="w-full max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:my-4 border border-slate-100">
                
                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-trust-50 flex items-center justify-center relative">
                            <Bot className="w-6 h-6 text-trust-600" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 leading-tight text-lg">Synaptic Clinical AI</h2>
                            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant Connection
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={async () => {
                            try {
                                setMessages([ { id: 1, sender: 'ai', text: 'History cleared. How can I assist you anew?' } ]);
                                await axiosConfig.delete('/chat');
                            } catch(e) { console.error(e) }
                        }}
                        title="Clear History"
                        className="p-2 text-slate-400 hover:text-trust-600 hover:bg-trust-50 rounded-full transition-colors hidden sm:block"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-slate-50/50" data-lenis-prevent="true">
                    
                    {/* Timestamp Marker */}
                    <div className="text-center text-xs font-semibold text-slate-400 my-4 uppercase tracking-widest">
                        Today
                    </div>

                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                                className={"flex w-full group " + (message.sender === 'user' ? 'justify-end' : 'justify-start')}
                            >
                                <div className={"flex items-end gap-3 max-w-[85%] sm:max-w-[75%] " + (message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                                    
                                    {/* Avatar */}
                                    <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 " + (
                                        message.sender === 'user' 
                                            ? 'bg-slate-800 text-white' 
                                            : 'bg-trust-100 text-trust-600'
                                    )}>
                                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={"relative px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm " + (
                                        message.sender === 'user'
                                            ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-br-sm'
                                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm prose prose-sm max-w-none'
                                    )}>
                                        {message.sender === 'ai' ? (
                                            <ReactMarkdown 
                                                components={{
                                                    strong: ({children}) => <strong className="font-semibold text-trust-700">{children}</strong>,
                                                    a: ({children, href}) => <a href={href} className="text-trust-600 underline underline-offset-2">{children}</a>
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        ) : (
                                            message.text
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-start w-full"
                        >
                            <div className="flex items-end gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-trust-100 flex items-center justify-center text-trust-600 shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-12">
                                    <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:0.6,delay:0}} className="w-2 h-2 rounded-full bg-trust-400"></motion.div>
                                    <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:0.6,delay:0.2}} className="w-2 h-2 rounded-full bg-trust-400"></motion.div>
                                    <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:0.6,delay:0.4}} className="w-2 h-2 rounded-full bg-trust-400"></motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative group">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => {
                                setInputMessage(e.target.value);
                                handleInput(e);
                            }}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Describe your symptoms or ask a medical question..."
                            rows="1"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-[1.5rem] pl-6 pr-16 py-4 focus:outline-none focus:ring-4 focus:ring-trust-500/10 focus:border-trust-400 focus:bg-white transition-all resize-none shadow-sm"
                            style={{ minHeight: '56px', maxHeight: '120px' }}
                            disabled={isTyping}
                        />
                        <button 
                            type="submit" 
                            disabled={!inputMessage.trim() || isTyping}
                            className="absolute right-2 bottom-2 p-3 bg-gradient-to-tr from-trust-600 to-trust-500 hover:from-trust-700 hover:to-trust-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-white rounded-[1.1rem] shadow-sm transition-all flex items-center justify-center group"
                        >
                            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </form>
                    <div className="text-center mt-3 text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> AI can make mistakes. Consider verifying important clinical information.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
