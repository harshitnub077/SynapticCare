import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, FileText, ArrowRight, HeartPulse, Stethoscope, Clock, Users } from 'lucide-react';

export default function Home() {
    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
    };

    return (
        <div className="w-full relative overflow-hidden bg-white">
            
            {/* Soft Ambient Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-[#f0f7ff] via-white to-[#f0fbf9] -z-10 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-trust-200/40 blur-[100px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-medical-200/40 blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.15, 0.25, 0.15],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[20%] w-[40%] h-[50%] rounded-full bg-emerald-200/40 blur-[100px]"
                />
            </div>

            {/* HERO SECTION */}
            <section className="pt-24 pb-20 md:pt-36 md:pb-32 px-6 max-w-7xl mx-auto relative z-10">
                <motion.div 
                    variants={staggerContainer} 
                    initial="hidden" 
                    animate="show"
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeUp} className="badge-medical bg-white border border-trust-100 text-trust-600 mb-8 shadow-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse"></span>
                            India's Most Advanced AI Medical Interface
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        variants={fadeUp}
                        className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8"
                    >
                        Intelligence that Cares.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-600 to-medical-500">
                            Precision that Heals.
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
                        Experience healthcare reimagined. Upload your reports for instant AI-driven diagnostic analysis, or book consultations with India's most trusted specialists in seconds.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <Link to="/upload" className="w-full sm:w-auto btn-medical-primary text-lg px-8 py-4">
                            Analyze Report <ArrowRight className="w-5 h-5 ml-1" />
                        </Link>
                        <Link to="/doctors" className="w-full sm:w-auto btn-medical-secondary text-lg px-8 py-4">
                            Find a Specialist
                        </Link>
                    </motion.div>
                </motion.div>
                
                {/* Floating Stats Glassmorphism Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 40 }}
                    className="mt-20 mx-auto max-w-5xl bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100"
                >
                    <div className="text-center px-4">
                        <div className="text-3xl font-bold text-trust-600 mb-1">99%</div>
                        <div className="text-sm font-medium text-slate-500">Analysis Accuracy</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-3xl font-bold text-trust-600 mb-1">500+</div>
                        <div className="text-sm font-medium text-slate-500">Verified Doctors</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-3xl font-bold text-trust-600 mb-1">24/7</div>
                        <div className="text-sm font-medium text-slate-500">AI Consultation</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-3xl font-bold text-trust-600 mb-1">3 Mins</div>
                        <div className="text-sm font-medium text-slate-500">Avg. Booking Time</div>
                    </div>
                </motion.div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A Seamless Healthcare Ecosystem</h2>
                        <p className="text-slate-600">Built for precision, engineered for peace of mind. Every tool you need to manage your health in one secure platform.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="medical-card group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-trust-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-trust-100 transition-all duration-300">
                                <FileText className="w-7 h-7 text-trust-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Diagnostic Scanner</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Upload any complex medical report. Our Neural-Net instantly translates clinical jargon into easy-to-understand health insights.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="medical-card group border-trust-200 shadow-md transform -translate-y-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-trust-500/5 to-transparent rounded-2xl pointer-events-none"></div>
                            <div className="w-14 h-14 rounded-2xl bg-medical-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-medical-100 transition-all duration-300 relative z-10">
                                <Stethoscope className="w-7 h-7 text-medical-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">Premium Specialist Network</h3>
                            <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                                Connect with board-certified doctors from top Indian institutions like AIIMS and Apollo. Book in-person or high-res video consults.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="medical-card group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300">
                                <ShieldCheck className="w-7 h-7 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Military-Grade Security</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Your biometric data and medical history are shielded with robust end-to-end encryption. You retain full control of your records.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TRUST SECTION WITH BENTO GRID */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Specialists Available Today</h2>
                            <p className="text-slate-500">Consult with the finest medical minds in the country.</p>
                        </div>
                        <Link to="/doctors" className="hidden md:flex items-center text-trust-600 font-medium hover:text-trust-700 transition-colors">
                            View Directory <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Dr. Ananya Sharma", spec: "Neurologist", loc: "AIIMS, New Delhi", wait: "5 mins", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },
                            { name: "Dr. Sidharth Menon", spec: "Cardiologist", loc: "Apollo Hospitals", wait: "12 mins", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
                            { name: "Dr. Kavita Desai", spec: "Endocrinologist", loc: "Lilavati Hospital", wait: "Available", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" }
                        ].map((doc, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white border border-slate-100 rounded-3xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-all flex items-center gap-4 cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 group-hover:text-trust-600 transition-colors">{doc.name}</h4>
                                    <p className="text-xs font-medium text-trust-500 mb-1">{doc.spec}</p>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Wait: <span className="text-emerald-500 font-medium">{doc.wait}</span>
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-trust-50 group-hover:text-trust-600 transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <Link to="/doctors" className="md:hidden mt-8 flex items-center justify-center text-trust-600 font-medium w-full py-4 border border-trust-100 rounded-2xl">
                        View Complete Directory
                    </Link>
                </div>
            </section>
        </div>
    );
}
