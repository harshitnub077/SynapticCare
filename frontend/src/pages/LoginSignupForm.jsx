import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosConfig";
import { Activity, ShieldCheck, Stethoscope, ArrowRight, Lock, BrainCircuit, CheckCircle, Mail, Key, User, Video, Shield, HeartPulse } from "lucide-react";

/* ── Animation Variants ── */
const containerFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemSlide = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const formSlide = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const LoginSignupForm = ({ onLoginSuccess = () => { } }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("patient");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            if (isLogin) {
                const res = await api.post("/auth/login", { email: formData.email, password: formData.password });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userRole", res.data.user?.role || "patient");
                onLoginSuccess();
            } else {
                const res = await api.post("/auth/signup", { name: formData.name, email: formData.email, password: formData.password, role });
                setMessage("success:" + (res.data.message || "Account created! You can now sign in."));
                setIsLogin(true);
            }
        } catch (err) {
            setMessage("error:" + (err.response?.data?.message || "Unable to reach the server."));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await api.post("/auth/google", { token: credentialResponse.credential });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userRole", res.data.user?.role || "patient");
            onLoginSuccess();
        } catch (err) {
            setMessage("error:" + (err.response?.data?.message || "Google Authentication failed."));
        } finally {
            setLoading(false);
        }
    };

    const isSuccess = message.startsWith("success:");
    const displayMsg = message.replace(/^(success:|error:)/, '');

    return (
        <div className="min-h-screen bg-zinc-950 flex font-sans overflow-hidden selection:bg-white/10">
            
            {/* ── Global Background Elements ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
                <motion.div 
                    animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" 
                />
                <motion.div 
                    animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-white/3 blur-[140px] rounded-full" 
                />
            </div>

            {/* ── Left Panel ── */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-950/50 border-r border-zinc-900 justify-center items-center p-16 overflow-hidden">
                <motion.div 
                    variants={containerFade} initial="hidden" animate="visible"
                    className="relative z-10 max-w-lg"
                >
                    {/* Aesthetic Logo */}
                    <motion.div variants={itemSlide} className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-md rounded-full group-hover:bg-white/40 transition-all" />
                            <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                                <Activity className="w-6 h-6 text-zinc-950" />
                            </div>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="font-display font-bold text-2xl tracking-tight text-white leading-tight">SynapticCare</span>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-none">Intelligence • Health</span>
                        </div>
                    </motion.div>

                    <motion.h1 variants={itemSlide} className="font-display text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                        Experience the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Future of Healthcare.</span>
                    </motion.h1>

                    <motion.p variants={itemSlide} className="text-zinc-500 text-lg mb-12 leading-relaxed max-w-sm">
                        Connect with top specialists, analyze medical reports with AI, and manage your health records on a single, secure platform.
                    </motion.p>

                    <div className="space-y-4">
                        {[
                            { icon: BrainCircuit, title: 'Intelligent AI Analysis', desc: 'Clinical-grade report parsing with deep insights.' },
                            { icon: Shield, title: 'Security & Privacy', desc: 'Secure encryption & HIPAA compliant records.' },
                            { icon: Stethoscope, title: 'Verified Specialists', desc: '2,500+ top doctors across Indian institutions.' },
                            { icon: Activity, title: 'Health Tracking', desc: 'Monitor your vitals and trends over time.' }
                        ].map((item, i) => (
                            <motion.div key={i} variants={itemSlide} 
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-[20px] transition-colors cursor-default"
                            >
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                    <item.icon className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                                    <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={itemSlide} className="mt-16 flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full w-fit">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-zinc-400 font-bold">P{i}</div>)}
                        </div>
                        <p className="text-xs font-semibold text-zinc-500">Joined by 50K+ patients across India</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Right Panel ── */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-14 bg-zinc-950/20 relative backdrop-blur-sm">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="text-center mb-10">
                        <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
                             <div className="relative">
                                <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                                <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-zinc-950" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start -gap-1">
                                <span className="font-display font-bold text-xl text-white leading-tight">SynapticCare</span>
                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Intelligence • Health</span>
                            </div>
                        </div>
                        <h2 className="font-display text-4xl font-bold text-white mb-3 tracking-tight">
                            {isLogin ? "Welcome Back" : "Get Started"}
                        </h2>
                        <p className="text-zinc-500 text-sm">
                            {isLogin ? "Join our clinical network again." : "Take the first step towards smarter care."}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-2xl flex mb-8">
                        <button type="button" onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-zinc-950 shadow-xl shadow-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>
                            Log In
                        </button>
                        <button type="button" onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-zinc-950 shadow-xl shadow-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>
                            Register
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={isLogin ? 'login' : 'register'}
                            variants={formSlide} initial="initial" animate="animate" exit="exit"
                        >
                            {/* Social Auth */}
                            <div className="flex flex-col gap-3 mb-8">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess} 
                                    onError={() => setMessage("error:Authentication failed.")}
                                    useOneTap shape="pill" theme="filled_black" size="large" width="100%"
                                />
                                <div className="relative flex items-center gap-4 my-2">
                                    <div className="flex-1 h-px bg-zinc-900" />
                                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">or continue with email</span>
                                    <div className="flex-1 h-px bg-zinc-900" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-5 overflow-hidden">
                                        <div className="grid grid-cols-2 gap-3 pb-1">
                                            {["patient", "doctor"].map(r => (
                                                <label key={r} 
                                                    className={`group relative flex items-center justify-center py-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${role === r ? 'border-white bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'}`}
                                                >
                                                    <input type="radio" name="role" value={r} checked={role === r} onChange={e => setRole(e.target.value)} className="sr-only" />
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className={`text-base transition-colors ${role === r ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
                                                            {r === 'patient' ? '🚑' : '🏥'}
                                                        </span>
                                                        <span className={`font-bold text-[10px] uppercase tracking-widest ${role === r ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                                            {r}
                                                        </span>
                                                    </div>
                                                    {role === r && <motion.div layoutId="roleCheck" className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]"><div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" /></motion.div>}
                                                </label>
                                            ))}
                                        </div>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                            <input type="text" name="name" placeholder="Full Name" className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-all text-sm font-medium" onChange={handleChange} required />
                                        </div>
                                    </motion.div>
                                )}

                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input type="email" name="email" placeholder="Email Address" className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-all text-sm font-medium" onChange={handleChange} required />
                                </div>

                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input type="password" name="password" placeholder="Password" className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-all text-sm font-medium" onChange={handleChange} required />
                                </div>

                                {isLogin && (
                                    <div className="flex justify-end pt-1">
                                        <button type="button" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">Forgot your password?</button>
                                    </div>
                                )}

                                <motion.button 
                                    whileHover={{ scale: 1.01, backgroundColor: '#f4f4f5' }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading}
                                    className="w-full py-4 bg-white text-zinc-950 rounded-2xl font-bold text-sm shadow-2xl shadow-white/10 mt-2 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-950 rounded-full animate-spin" />
                                    ) : (
                                        <>{isLogin ? "Sign In" : "Get Started"} <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                className={`mt-8 py-4 px-5 rounded-2xl text-[13px] font-medium border flex items-center gap-3 ${isSuccess ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-red-950/40 border-red-900/50 text-red-100'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-900/50 shadow-lg shadow-emerald-900' : 'bg-red-900/50 shadow-lg shadow-red-900'}`}>
                                    {isSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                </div>
                                <span>{displayMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 text-center text-[10px] text-zinc-700 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant · 256-bit AES Encrypted
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginSignupForm;
