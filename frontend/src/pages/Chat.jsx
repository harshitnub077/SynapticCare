import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader, Sparkles, AlertCircle, RefreshCcw, HeartPulse } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axiosConfig";
import ErrorBoundary from "../components/ErrorBoundary";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [savedHistory, setSavedHistory] = useState([]);
    const [chatMode, setChatMode] = useState("initial"); // 'initial' | 'new' | 'continue'
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get("/chat");
            const history = response.data.messages || [];
            setSavedHistory(history);
            if (history.length === 0) {
                setChatMode("new");
            } else {
                setChatMode("initial");
            }
        } catch (error) {
            console.error("Failed to load chat history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setLoading(true);

        const tempUserMsg = {
            role: "user",
            message: userMessage,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const response = await api.post("/chat", { message: userMessage });
            const aiMessage = {
                role: "assistant",
                message: response.data.aiMessage.message,
                createdAt: response.data.aiMessage.createdAt,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                role: "assistant",
                message: "Sorry, I'm having trouble responding right now. Please try again.",
                createdAt: new Date().toISOString(),
                isError: true
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    if (loadingHistory) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader className="w-8 h-8 animate-spin text-medical-500" />
                    Initializing AI Assistant...
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 p-4 sm:px-6 flex justify-between items-center z-10 shadow-sm relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-medical-600 to-teal-400 flex items-center justify-center shadow-inner relative overflow-hidden">
                        <HeartPulse className="w-5 h-5 text-white z-10 drop-shadow-sm" />
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 tracking-tight">SynapticCare AI</h1>
                        <p className="text-xs text-medical-600 font-medium flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Online and Ready
                        </p>
                    </div>
                </div>

                {messages.length > 0 && (
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to clear your conversation history?")) {
                                try {
                                    await api.delete("/chat");
                                    setMessages([]);
                                    setSavedHistory([]);
                                    setChatMode("new");
                                } catch (err) {
                                    alert("Failed to clear chat history.");
                                }
                            }
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-slate-200 hover:border-rose-200"
                    >
                        <RefreshCcw className="w-3 h-3" /> Reset Chat
                    </button>
                )}
            </div>

            {chatMode === "initial" && savedHistory.length > 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                    <div className="max-w-md w-full medical-card text-center space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-medical-50 flex items-center justify-center mx-auto text-medical-600 mb-2">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                You have an existing conversation saved. You can pick up safely right where you left off, or start entirely fresh.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                className="btn-medical-primary w-full shadow-md"
                                onClick={() => {
                                    setMessages(savedHistory);
                                    setChatMode("continue");
                                }}
                            >
                                Continue Previous Chat
                            </button>
                            <button
                                type="button"
                                className="btn-medical-secondary w-full"
                                onClick={() => {
                                    setMessages([]);
                                    setChatMode("new");
                                }}
                            >
                                Start New Conversation
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-medical-100 to-teal-50 rounded-full flex items-center justify-center mb-6 border border-medical-200/50">
                                        <Bot className="h-10 w-10 text-medical-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">How can I help you clinically today?</h3>
                                    <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                                        Ask me to interpret a medical term, analyze your uploaded reports, or check symptoms. 
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
                                        <button onClick={() => setInput("Can you summarize my latest blood test?")} className="p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-medical-300 hover:text-medical-700 transition-colors shadow-sm">
                                            "Summarize my latest blood test"
                                        </button>
                                        <button onClick={() => setInput("What does an elevated WBC count mean?")} className="p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-medical-300 hover:text-medical-700 transition-colors shadow-sm">
                                            "What does elevated WBC mean?"
                                        </button>
                                        <button onClick={() => setInput("How to lower my cholesterol naturally?")} className="p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-medical-300 hover:text-medical-700 transition-colors shadow-sm">
                                            "How to lower cholesterol?"
                                        </button>
                                        <button onClick={() => setInput("Explain my MRI results in simple terms.")} className="p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-medical-300 hover:text-medical-700 transition-colors shadow-sm">
                                            "Explain my MRI in simple terms"
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={idx} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${
                                            msg.role === "assistant" 
                                                ? msg.isError ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-medical-600 text-white border-medical-700/50"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                        }`}>
                                            {msg.role === "assistant" ? 
                                                (msg.isError ? <AlertCircle className="w-5 h-5" /> : <Bot className="w-5 h-5" />) : 
                                                <User className="w-5 h-5" />
                                            }
                                        </div>
                                        <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm text-[15px] leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-medical-600 text-white rounded-tr-sm"
                                                : msg.isError 
                                                    ? "bg-rose-50 text-rose-800 border border-rose-100 rounded-tl-sm"
                                                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
                                        }`}>
                                            {msg.role === "user" ? (
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            ) : (
                                                <div className="prose prose-sm prose-slate max-w-none break-words [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-3 last:[&>p]:mb-0">
                                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-medical-50 border border-medical-100 text-medical-500 flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-medical-400 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-medical-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-medical-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>

                    {/* Prompts Input */}
                    <div className="p-4 sm:p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
                        <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative">
                            <div className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-medical-500/20 focus-within:border-medical-500 transition-all shadow-sm">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your health question..."
                                    className="flex-1 max-h-32 min-h-[44px] px-3 py-2.5 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder-slate-400 text-[15px]"
                                    disabled={loading}
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="p-3 bg-medical-600 text-white rounded-xl hover:bg-medical-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 mb-0.5 mr-0.5 shadow-sm"
                                >
                                    <Send className="h-5 w-5 ml-0.5" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <span className="text-xs text-slate-400">SynapticCare AI can make mistakes. Always verify clinical information with your doctor.</span>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

const ChatWithErrorBoundary = () => (
    <ErrorBoundary>
        <Chat />
    </ErrorBoundary>
);

export default ChatWithErrorBoundary;
