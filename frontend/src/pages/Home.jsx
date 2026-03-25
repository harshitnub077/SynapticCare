import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Stethoscope, Video, Network, Sparkles, ArrowRight, Microscope, Users, HeartPulse } from 'lucide-react';

export default function Home() {
  const FADE_UP = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-trust-200 selection:text-trust-900 overflow-hidden relative">
      
      {/* --- CRAZY AESTHETIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Tech Grid */}
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 2 }}
            className="absolute inset-0" 
            style={{ 
                backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`, 
                backgroundSize: '4rem 4rem',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, #000 40%, transparent 100%)'
            }}
        />

        {/* Massive Ambient Orbs */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-trust-200/40 blur-[130px]" 
        />
        <motion.div 
            animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] right-[-15%] w-[900px] h-[900px] rounded-full bg-medical-200/40 blur-[140px]" 
        />
        <motion.div 
            animate={{ scale: [0.8, 1.1, 0.8], rotate: [0, -45, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[20%] w-[600px] h-[600px] rounded-full bg-sky-200/30 blur-[120px]" 
        />

        {/* Floating Glassmorphic Elements */}
        <motion.div 
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] left-[10%] w-24 h-24 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl flex items-center justify-center transform -rotate-12"
        >
            <Microscope className="w-10 h-10 text-trust-600" />
        </motion.div>

        <motion.div 
            animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[35%] right-[12%] w-28 h-28 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center transform rotate-12"
        >
            <ShieldCheck className="w-12 h-12 text-medical-600" />
        </motion.div>

        {/* Glowing Beam Line */}
        <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-trust-400/50 to-transparent">
            <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-[200px] h-full bg-gradient-to-r from-transparent via-trust-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            />
        </div>
      </div>

      <div className="relative z-10 pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 max-w-7xl mx-auto">
        <motion.div 
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
            }}
            className="text-center max-w-4xl mx-auto relative"
        >
            <motion.div variants={FADE_UP} className="mb-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_16px_rgba(0,0,0,0.03)] text-sm font-bold text-slate-700 tracking-wide hover:scale-105 transition-transform cursor-pointer">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Synaptic Intelligence Engine v5.0 Live
                </div>
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
                The Future of <br className="hidden sm:block"/>
                <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-trust-600 via-trust-500 to-medical-500 pb-2">
                        Intelligent Healthcare.
                    </span>
                    <motion.span 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                        className="absolute bottom-0 left-0 w-full h-[6px] bg-trust-200 rounded-full origin-left -z-10"
                    />
                </span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-lg md:text-2xl text-slate-600 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
                Experience ultra-premium diagnostic analysis, instantaneous specialist connections, and military-grade encryption for all your neural medical records.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to="/upload" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-trust-600 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                    Initialize Analysis
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/doctors" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                    Browse Network
                </Link>
            </motion.div>
        </motion.div>

        {/* Dashboard Preview / Bento Grid */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            <div className="md:col-span-2 medical-card p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-trust-50 rounded-full blur-3xl group-hover:bg-trust-100 transition-colors duration-500"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-trust-100 text-trust-600 flex items-center justify-center mb-6 shadow-sm border border-trust-200/50">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Diagnostic Neural Engine</h3>
                    <p className="text-slate-600 max-w-md text-lg leading-relaxed">Upload complex medical imaging or clinical reports. Our multi-modal AI parses, translates, and summarizes with superhuman precision.</p>
                </div>
                <div className="relative z-10 mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-trust-600 decoration-trust-300 decoration-2 underline-offset-4 group-hover:underline cursor-pointer">Explore Capabilities</span>
                    <Sparkles className="w-5 h-5 text-trust-400" />
                </div>
            </div>

            <div className="medical-card p-8 flex flex-col justify-between overflow-hidden relative group">
                 <div className="absolute -left-10 -top-10 w-48 h-48 bg-medical-50 rounded-full blur-2xl group-hover:bg-medical-100 transition-colors duration-500"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-medical-100 text-medical-600 flex items-center justify-center mb-6 shadow-sm border border-medical-200/50">
                        <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Tele-Consultations</h3>
                    <p className="text-slate-600 leading-relaxed">Instant, high-fidelity secure video connections with top-tier verified specialists globally.</p>
                </div>
                <div className="relative z-10 mt-8">
                    <Link to="/doctors" className="inline-flex w-full items-center justify-center py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                        Find a Doctor
                    </Link>
                </div>
            </div>

            <div className="medical-card p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Zero-Trust Vault</h3>
                    <p className="text-slate-600 leading-relaxed">Your data. Your cryptographic keys. End-to-end encrypted medical record storage.</p>
                </div>
            </div>

            <div className="md:col-span-2 medical-card p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-trust-600 to-medical-600 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
                    <div className="flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                            <Network className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Cross-Institution Sync</h3>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-sm">Seamlessly transfer context between hospitals. Generate unified clinical summaries instantly.</p>
                    </div>
                    <div className="w-full md:w-1/2 h-32 md:h-full bg-white/50 border border-slate-200/60 rounded-2xl backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                        {/* Abstract visual of sinking data */}
                        <div className="absolute inset-0 border-[0.5px] border-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)]" style={{ backgroundSize: '24px 24px', backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)' }}></div>
                        <div className="w-16 h-16 bg-white shadow-xl rounded-2xl border border-slate-100 flex items-center justify-center relative z-10">
                            <HeartPulse className="w-8 h-8 text-trust-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Trust Section */}
      <section className="border-t border-slate-200/60 bg-white relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-8">Trusted by Elite Institutions</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="font-display font-bold text-2xl text-slate-800">AIIMS</span>
                <span className="font-display font-bold text-2xl text-slate-800 flex items-center justify-center gap-1"><Stethoscope className="w-6 h-6"/>Apollo</span>
                <span className="font-display font-bold text-2xl text-slate-800">FORTIS</span>
                <span className="font-display font-bold text-2xl text-slate-800">MAX HEALTHCARE</span>
            </div>
        </div>
      </section>
    </div>
  );
}
