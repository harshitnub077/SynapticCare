import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader } from "lucide-react";
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
            if (error.response?.status === 401) {
                // Token expired, will be handled by interceptor
            }
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

        // Add user message optimistically
        const tempUserMsg = {
            role: "user",
            message: userMessage,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const response = await api.post(
                "/chat",
                { message: userMessage }
            );

            // Add AI response
            const aiMessage = {
                role: "assistant",
                message: response.data.aiMessage.message,
                createdAt: response.data.aiMessage.createdAt,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
            // Add error message
            const errorMessage = {
                role: "assistant",
                message: "Sorry, I'm having trouble responding right now. Please try again.",
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    if (loadingHistory) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-slate-900">Chat</h1>
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to clear your chat history?")) {
                                try {
                                    await api.delete("/chat");
                                    setMessages([]);
                                    setSavedHistory([]);
                                    setChatMode("new");
                                } catch (err) {
                                    console.error("Failed to clear history:", err);
                                    alert("Failed to clear chat history.");
                                }
                            }
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Clear History
                    </button>
                </div>
            </div>

            {/* If there is saved history and user has not chosen how to start */}
            {chatMode === "initial" && savedHistory.length > 0 ? (
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center space-y-4">
                        <Bot className="h-10 w-10 text-blue-600 mx-auto" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            How would you like to start?
                        </h2>
                        <p className="text-sm text-slate-600">
                            You have a previous conversation saved. You can continue from where you
                            left off or begin a fresh chat. Your earlier messages stay saved either way.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <button
                                type="button"
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                                onClick={() => {
                                    setMessages(savedHistory);
                                    setChatMode("continue");
                                }}
                            >
                                Continue previous chat
                            </button>
                            <button
                                type="button"
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                onClick={() => {
                                    setMessages([]);
                                    setChatMode("new");
                                }}
                            >
                                Start a new chat
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bot className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                                        Start a conversation
                                    </h3>
                                    <p className="text-slate-600">
                                        Ask me anything about your health reports or general health questions
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start space-x-3 ${msg.role === "user" ? "justify-end" : ""
                                            }`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Bot className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-2xl rounded-lg px-4 py-3 ${msg.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-slate-900 border border-slate-200"
                                                }`}
                                        >
                                            {msg.role === "user" ? (
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            ) : (
                                                <div className="prose prose-sm max-w-none break-words [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>strong]:font-bold">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            a: ({ node, ...props }) => (
                                                                <a
                                                                    className="text-blue-600 hover:underline"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    {...props}
                                                                />
                                                            ),
                                                        }}
                                                    >
                                                        {msg.message}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === "user" && (
                                            <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="bg-white text-slate-900 border border-slate-200 rounded-lg px-4 py-3">
                                        <Loader className="h-5 w-5 animate-spin text-blue-600" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="bg-white border-t border-slate-200 px-4 py-4">
                        <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me about your health..."
                                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                >
                                    <Send className="h-5 w-5" />
                                    <span>Send</span>
                                </button>
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

