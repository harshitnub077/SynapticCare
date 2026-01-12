import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";
import {
    MessageSquare,
    Send,
    Bot,
    User,
    ShieldCheck,
    Activity,
    Clock,
    Plus,
    Trash2,
    ChevronRight,
    Sparkles
} from "lucide-react";

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChats = async () => {
        try {
            const res = await api.get("/chat/history");
            setChats(res.data);
            if (res.data.length > 0 && !currentChatId) {
                loadChat(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadChat = async (id) => {
        try {
            setCurrentChatId(id);
            const res = await api.get(`/chat/history/${id}`);
            setMessages(res.data.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const startNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        setInput("");
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/chat", {
                message: input,
                chatId: currentChatId
            });

            if (!currentChatId) {
                setCurrentChatId(res.data.chatId);
                fetchChats();
            }

            setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: "assistant", content: "System Error: Failed to synchronize with Neural Link." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#F0F4F8] pt-32 pb-8 px-6 mesh-gradient relative flex overflow-hidden">
            <main className="max-w-[1700px] mx-auto w-full flex gap-8 relative z-10">

                {/* Lateral Terminal (Chat History) */}
                <aside className="hidden lg:flex flex-col w-96 nexus-glass-heavy rounded-[2.5rem] p-8 border-white/80">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-nexus-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-sm font-black text-nexus-primary uppercase tracking-widest">Nexus History</h3>
                        </div>
                        <button
                            onClick={startNewChat}
                            className="w-10 h-10 rounded-xl bg-nexus-accent/10 text-nexus-accent hover:bg-nexus-accent hover:text-white transition-all duration-500 flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {chats.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <Clock className="w-12 h-12 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Logs Empty</p>
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => loadChat(chat.id)}
                                    className={`w-full text-left p-5 rounded-3xl transition-all duration-500 border-2 ${currentChatId === chat.id
                                            ? "bg-white border-nexus-accent shadow-xl shadow-nexus-accent/5"
                                            : "bg-white/40 border-transparent hover:border-white hover:bg-white/60"
                                        }`}
                                >
                                    <p className="text-[10px] font-black text-nexus-accent uppercase tracking-widest mb-2">
                                        {new Date(chat.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-nexus-primary font-bold line-clamp-1 text-xs">
                                        {chat.title || "Untitled Transmission"}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Primary Intelligence Interface */}
                <section className="flex-1 flex flex-col h-full nexus-glass-heavy rounded-[3rem] border-white/80 overflow-hidden relative">
                    {/* Interface Header */}
                    <header className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-white/40 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-nexus-accent rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-nexus-accent/20 neural-pulse">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-nexus-primary tracking-tighter uppercase">Synaptic Intelligence</h2>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 neural-pulse" />
                                    <span className="text-[9px] font-black text-nexus-accent uppercase tracking-[0.3em]">Quantum Link Established</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-slate-100 shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </header>

                    {/* Transmission Stream */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center stagger-in">
                                <div className="w-24 h-24 bg-nexus-accent/5 rounded-[2.5rem] flex items-center justify-center mb-10 border-2 border-nexus-accent/10">
                                    <Bot className="w-10 h-10 text-nexus-accent" />
                                </div>
                                <h3 className="text-3xl font-black text-nexus-primary mb-6">Awaiting Signal.</h3>
                                <p className="text-nexus-text-muted max-w-md font-medium text-lg leading-relaxed mb-10">
                                    Initialize clinical analysis. Our neural assistant is synchronized
                                    with your health dossier for high-precision insights.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                                    {[
                                        "Analyze my recent blood work trends.",
                                        "Potential interactions for Ibuprofen?",
                                        "Summarize my diagnostic reports.",
                                        "Cardiovascular health suggestions."
                                    ].map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(prompt)}
                                            className="p-5 bg-white/60 hover:bg-white border-2 border-transparent hover:border-nexus-accent rounded-3xl text-sm font-bold text-nexus-primary text-left transition-all duration-500 shadow-sm"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-6 animate-in slide-in-from-bottom-4 duration-500 ${msg.role === "user" ? "flex-row-reverse" : ""
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === "user"
                                            ? "bg-nexus-primary text-white"
                                            : "bg-nexus-accent text-white"
                                        }`}>
                                        {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                    </div>
                                    <div className={`max-w-[75%] p-8 rounded-[2.5rem] shadow-sm border-2 ${msg.role === "user"
                                            ? "bg-nexus-primary text-white border-nexus-primary rounded-tr-none"
                                            : "bg-white text-nexus-primary border-slate-50 rounded-tl-none"
                                        }`}>
                                        <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-white prose-invert" : "text-nexus-primary"}`}>
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-nexus-accent rounded-2xl flex items-center justify-center shadow-lg neural-pulse">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] rounded-tl-none border-2 border-slate-50 shadow-sm flex items-center gap-3">
                                    <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Terminal */}
                    <footer className="p-8 bg-white/60 backdrop-blur-xl border-t-2 border-slate-50">
                        <form onSubmit={handleSendMessage} className="relative max-w-5xl mx-auto group">
                            <input
                                type="text"
                                placeholder="Quantum query input..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="input-nexus pl-10 pr-20 py-6 text-lg border-white group-hover:border-nexus-accent/30"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-nexus-primary text-white rounded-[1.25rem] flex items-center justify-center hover:bg-nexus-accent transition-all duration-500 disabled:opacity-20 disabled:hover:bg-nexus-primary shadow-xl shadow-nexus-primary/20"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                        <p className="text-center mt-6 text-[9px] font-black text-nexus-text-muted uppercase tracking-[0.4em] opacity-50">
                            Synaptic Intelligence Protocol v4.0.Nexus // Real-time Clinical Analysis Active
                        </p>
                    </footer>
                </section>
            </main>
        </div>
    );
};

export default Chat;
