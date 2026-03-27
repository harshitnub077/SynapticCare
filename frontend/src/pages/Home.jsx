import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
    ArrowRight, ArrowUpRight, CheckCircle, Clock, Users, Award,
    Zap, Lock, BarChart2, Play, TrendingUp, BrainCircuit,
    Microscope, Pill, Heart, Stethoscope, Activity, FileText,
    ShieldCheck, Star, Video, TriangleAlert, Phone, ChevronRight
} from 'lucide-react';

/* ── Framer variants ── */
const FU = { hidden: { opacity: 0, y: 28 }, show: (d = 0) => ({ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18, delay: d } }) };
const FL = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } } };
const FR = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

/* ── Animated Counter ── */
function Counter({ target, suffix = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const mot = useMotionValue(0);
    const spring = useSpring(mot, { damping: 30, stiffness: 80 });
    const [val, setVal] = useState('0');
    useEffect(() => { if (inView) mot.set(target); }, [inView, target, mot]);
    useEffect(() => spring.on('change', v => {
        setVal(target >= 1000 ? (v / 1000).toFixed(0) + 'K' : v.toFixed(target % 1 !== 0 ? 1 : 0));
    }), [spring, target]);
    return <span ref={ref}>{val}{suffix}</span>;
}

const Sec = ({ children, className = '' }) => (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger} className={className}>
        {children}
    </motion.div>
);

/* ── Data ── */
const STATS = [
    { value: 50000, suffix: '+', label: 'Patients Served', icon: Users },
    { value: 2500, suffix: '+', label: 'Verified Doctors', icon: Stethoscope },
    { value: 98.4, suffix: '%', label: 'AI Accuracy', icon: TrendingUp },
    { value: 1000, suffix: '+', label: 'Partner Hospitals', icon: Award },
];

const SPECIALTIES = [
    { icon: Heart, label: 'Cardiology' },
    { icon: BrainCircuit, label: 'Neurology' },
    { icon: Microscope, label: 'Pathology' },
    { icon: Pill, label: 'Pharmacy' },
    { icon: Activity, label: 'Radiology' },
    { icon: Stethoscope, label: 'General Medicine' },
];

const FEATURES = [
    { icon: BrainCircuit, title: 'AI Report Analysis', desc: 'Upload blood tests, scans, or ECGs. Our GPT-4 clinical AI extracts every biomarker and explains it in plain language.', tag: 'GPT-4' },
    { icon: Stethoscope, title: '2,500+ Expert Doctors', desc: 'Verified specialists from AIIMS, Apollo, and Fortis. Hand-picked, credentials-checked, NABH-approved.', tag: 'NABH' },
    { icon: Video, title: 'HD Video Consults', desc: 'HIPAA-compliant video consultations from your home. No commute, no waiting rooms.', tag: 'HIPAA' },
    { icon: Lock, title: 'Encrypted Health Vault', desc: '256-bit AES encryption. Your records — accessible only when you choose.', tag: 'ISO 27001' },
    { icon: BarChart2, title: 'Health Analytics', desc: 'Track trends over time. AI-driven insights on long-term biomarkers and risk factors.', tag: 'Predictive AI' },
    { icon: Clock, title: '24/7 AI Support', desc: 'Intelligent clinical assistant available at 3am, on weekends, on holidays. Always-on care.', tag: 'Always On' },
];

const TESTIMONIALS = [
    { name: 'Ananya Sharma', role: 'Patient, New Delhi', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'SynapticCare explained my blood report in a way no doctor ever had. The AI insights were spot on and I finally understood my own body.', rating: 5 },
    { name: 'Dr. Rajiv Menon', role: 'Cardiologist, Chennai', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'I recommend SynapticCare to all my patients. The AI analysis is impressively accurate and saves everyone significant time.', rating: 5 },
    { name: 'Priya Kapoor', role: 'Patient, Mumbai', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', text: 'Found the perfect specialist for my rare condition within minutes. The video consultation was seamless — totally HIPAA-compliant.', rating: 5 },
    { name: 'Ravi Kumar', role: 'Diabetic Patient, Hyderabad', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', text: 'Tracking HbA1c trends over months changed how I manage my diabetes. The health analytics dashboard is incredible.', rating: 5 },
    { name: 'Dr. Sneha Iyer', role: 'Neurologist, Bangalore', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', text: 'Patient data through SynapticCare is far superior to anything else I have used. Pre-processed, AI-summarised, beautifully organised.', rating: 5 },
    { name: 'Meera Nair', role: 'Patient, Kochi', avatar: 'https://randomuser.me/api/portraits/women/52.jpg', text: 'The emergency triage feature at 2am gave me peace of mind when my father had chest pain. It correctly advised immediate ER care.', rating: 5 },
];

const HERO_IMG = 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80';
const LAB_IMG = 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80';
const CONSULT_IMG = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80';
const RECORDS_IMG = 'https://images.unsplash.com/photo-1666214280391-8ff5bd3d0bf0?w=800&q=80';
const EMERGENCY_IMG = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80';
const DOC1_IMG = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80';
const DOC2_IMG = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80';

export default function Home() {
    return (
        <div className="bg-zinc-950 font-sans overflow-x-hidden selection:bg-white/10 selection:text-white">

            {/* ══ HERO ══ */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />
                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(59,130,246,0.18),transparent)]" />
                <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 9, repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-20">

                        {/* Left */}
                        <motion.div initial="hidden" animate="show" variants={stagger} className="flex-1 text-center lg:text-left">
                            <motion.div variants={FU} custom={0}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-8">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                India's #1 AI-Powered Healthcare Platform
                            </motion.div>

                            <motion.h1 variants={FU} custom={0.1}
                                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.07] mb-7 tracking-tight">
                                Your Complete<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
                                    Healthcare Partner,
                                </span><br />
                                Powered by AI.
                            </motion.h1>

                            <motion.p variants={FU} custom={0.2} className="text-zinc-400 text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
                                Understand medical reports instantly, consult verified specialists, and manage all your health records — privately and securely.
                            </motion.p>

                            <motion.div variants={FU} custom={0.3} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <Link to="/upload" className="group px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold text-base hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                                    Analyze My Reports <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/doctors" className="group px-8 py-4 border border-zinc-700 text-zinc-300 rounded-2xl font-bold text-base hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                                    <Play className="w-4 h-4" /> Find a Specialist
                                </Link>
                            </motion.div>

                            <motion.div variants={FU} custom={0.4} className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                                {['HIPAA Compliant', 'NABH Approved', 'ISO 27001', 'Free Analysis'].map(b => (
                                    <div key={b} className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {b}
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right — image + floating cards */}
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.9, type: 'spring', stiffness: 60 }}
                            className="flex-1 relative w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/80">
                                <img src={HERO_IMG} alt="AI Healthcare" className="w-full h-[480px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                            </div>

                            {/* Float: AI Card */}
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-4 -left-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl max-w-[220px]">
                                <div className="flex items-center gap-2 mb-2.5">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><BrainCircuit className="w-4 h-4 text-white" /></div>
                                    <div><p className="text-xs font-bold text-white">AI Analysis</p><p className="text-xs text-emerald-400 font-medium">✓ Complete</p></div>
                                </div>
                                <div className="space-y-1.5">
                                    {[['Hemoglobin', 'Normal'], ['Blood Glucose', 'Borderline']].map(([k, s]) => (
                                        <div key={k} className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-400">{k}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s === 'Normal' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Float: Doctor */}
                            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                className="absolute -bottom-4 -right-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl max-w-[200px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={DOC1_IMG} className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700" alt="Dr" />
                                    <div>
                                        <p className="text-xs font-bold text-white">Dr. Ananya Sharma</p>
                                        <p className="text-xs text-zinc-500">Neurologist · AIIMS</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-900/60 rounded-xl px-3 py-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-emerald-400">Available Now</span>
                                </div>
                            </motion.div>

                            {/* Float: Rating */}
                            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                                className="absolute top-1/2 -right-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 shadow-xl">
                                <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
                                <p className="text-xs font-bold text-white">4.9 / 5.0</p>
                                <p className="text-xs text-zinc-500">50K+ reviews</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 w-full overflow-hidden h-12">
                    <svg viewBox="0 0 1440 48" fill="none" className="absolute bottom-0 w-full">
                        <path d="M0 48L1440 48L1440 22C1440 22 1200 0 720 0C240 0 0 22 0 22L0 48Z" fill="#09090b" />
                    </svg>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section className="bg-zinc-950 py-20 px-6">
                <Sec className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STATS.map((s, i) => (
                            <motion.div key={s.label} variants={FU} custom={i * 0.1}
                                className="text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:border-white transition-all border border-zinc-700">
                                    <s.icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                                </div>
                                <p className="text-4xl font-bold text-white font-display mb-1">
                                    <Counter target={s.value} />{s.suffix}
                                </p>
                                <p className="text-zinc-500 text-sm">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </Sec>
            </section>

            {/* ══ SPECIALTIES ══ */}
            <section className="py-20 px-6 bg-zinc-900/40">
                <Sec className="max-w-7xl mx-auto">
                    <motion.div variants={FU} className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <p className="section-label mb-2">Medical Specialties</p>
                            <h2 className="font-display text-4xl font-bold text-white">Browse by Specialty</h2>
                        </div>
                        <Link to="/doctors" className="text-zinc-400 font-medium flex items-center gap-1 hover:text-white transition-colors text-sm">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {SPECIALTIES.map((sp, i) => (
                            <motion.div key={sp.label} variants={FU} custom={i * 0.07}
                                whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                                className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                                <sp.icon className="w-7 h-7 text-zinc-300" />
                                <span className="text-sm font-semibold text-zinc-300 text-center">{sp.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </Sec>
            </section>

            {/* ══ HOW IT WORKS ══ */}
            <section className="bg-zinc-950 py-28 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <Sec>
                        <motion.div variants={FU} className="text-center mb-24">
                            <p className="section-label mb-3">Simple Process</p>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">From Report to Recovery</h2>
                            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Three intelligent steps to get you from confused to confident about your health.</p>
                        </motion.div>
                    </Sec>

                    <div className="space-y-28">
                        {[
                            {
                                num: '01', dir: 'left', img: LAB_IMG, imgAlt: 'Lab upload',
                                tag: 'Upload', tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                                title: 'Drag, Drop & Forget The Confusion',
                                desc: 'Upload any PDF or photo of your medical report — blood tests, X-rays, MRIs, ECGs. Encrypted instantly and processed within seconds.',
                                checks: ['Supports PDF, JPG, PNG, DICOM', 'End-to-end encrypted upload', 'Results in under 60 seconds'],
                                floatLabel: 'Upload Successful', floatSub: 'Encrypted · Processing...',
                                FloatIcon: CheckCircle, floatColor: 'text-emerald-400 bg-emerald-950/50'
                            },
                            {
                                num: '02', dir: 'right', img: RECORDS_IMG, imgAlt: 'AI Records',
                                tag: 'AI Analysis', tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                                title: 'Clinical-Grade AI That Reads Between the Lines',
                                desc: 'Our AI, trained on 50M+ medical records, identifies abnormal values, detects risk patterns, and translates jargon into actionable insights.',
                                checks: ['Biomarker extraction', 'Trend analysis over time', 'Risk flag detection', 'Plain-language summary'],
                                floatLabel: 'AI Insight', floatSub: 'Glucose elevated. Dietary review recommended.',
                                FloatIcon: BrainCircuit, floatColor: 'text-blue-400 bg-blue-950/50'
                            },
                            {
                                num: '03', dir: 'left', img: CONSULT_IMG, imgAlt: 'Consultation',
                                tag: 'Consult', tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                                title: 'Expert Doctors, One Click Away',
                                desc: 'Book HD video consultations with India\'s top verified specialists. Share your AI-analyzed report — doctors arrive prepared, you get better care.',
                                checks: ['Verified & NABH-certified doctors', 'Instant booking, no long queues', 'Prescription & follow-up notes'],
                                floatLabel: 'Consultation Live', floatSub: 'HD · Encrypted · HIPAA',
                                FloatIcon: Video, floatColor: 'text-teal-400 bg-teal-950/50'
                            }
                        ].map((s, i) => (
                            <motion.div key={s.num} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                                className={`flex flex-col ${s.dir === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                                <motion.div variants={s.dir === 'left' ? FL : FR} className="flex-1">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 ${s.tagColor}`}>
                                        <span className="w-5 h-5 bg-white text-zinc-900 rounded-full flex items-center justify-center text-xs font-bold">{s.num}</span>
                                        {s.tag}
                                    </div>
                                    <h3 className="font-display text-3xl font-bold text-white mb-4">{s.title}</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">{s.desc}</p>
                                    <div className="space-y-3">
                                        {s.checks.map(c => (
                                            <div key={c} className="flex items-center gap-3 text-zinc-300">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span className="text-sm font-medium">{c}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                                <motion.div variants={s.dir === 'left' ? FR : FL} className="flex-1 relative">
                                    <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/80">
                                        <img src={s.img} alt={s.imgAlt} className="w-full h-72 object-cover" />
                                    </div>
                                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                                        className={`absolute ${i % 2 === 0 ? '-bottom-6 -left-6' : '-top-6 -right-6'} bg-zinc-900 border border-zinc-700 rounded-2xl p-4 flex items-center gap-3`}>
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.floatColor}`}>
                                            <s.FloatIcon className="w-4 h-4" />
                                        </div>
                                        <div><p className="text-xs font-bold text-white">{s.floatLabel}</p><p className="text-xs text-zinc-500 max-w-[160px]">{s.floatSub}</p></div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURES GRID ══ */}
            <section className="bg-zinc-900/40 py-24 px-6">
                <Sec className="max-w-7xl mx-auto">
                    <motion.div variants={FU} className="text-center mb-16">
                        <p className="section-label mb-3">Everything You Need</p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">A Complete Health Ecosystem</h2>
                        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">All tools a patient and a doctor need — built to the highest clinical and security standards.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} variants={FU} custom={i * 0.07}
                                whileHover={{ y: -5, borderColor: '#52525b' }}
                                className="bg-zinc-900 p-7 rounded-2xl border border-zinc-800 group cursor-pointer transition-all">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:bg-white group-hover:border-white transition-all">
                                        <f.icon className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-600 bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">{f.tag}</span>
                                </div>
                                <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-zinc-100">{f.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                                <div className="mt-5 flex items-center gap-1 text-zinc-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all group-hover:text-white">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Sec>
            </section>

            {/* ══ EMERGENCY ══ */}
            <section className="bg-zinc-950 py-16 px-6 border-y border-zinc-800/60">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1">
                        <div className="flex items-center gap-3 mb-5">
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                                <TriangleAlert className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-red-400 font-semibold text-sm uppercase tracking-widest">Emergency Triage</span>
                        </div>
                        <h2 className="font-display text-3xl font-bold text-white mb-4">Not Sure If It's an Emergency?</h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-6">Our AI-powered symptom checker evaluates symptoms in real time and advises whether you need immediate ER care — potentially life-saving guidance, available instantly.</p>
                        <Link to="/chat" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-900/40">
                            <Phone className="w-5 h-5" /> Check Symptoms Now
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex-1">
                        <img src={EMERGENCY_IMG} alt="Emergency healthcare" className="rounded-3xl w-full h-64 object-cover border border-zinc-800 shadow-xl" />
                    </motion.div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ══ */}
            <section className="bg-zinc-900/40 py-24 px-6">
                <Sec className="max-w-7xl mx-auto">
                    <motion.div variants={FU} className="text-center mb-16">
                        <p className="section-label mb-3">Patient Stories</p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Trusted by Thousands</h2>
                        <p className="text-zinc-500 text-lg">Real stories from patients and doctors across India.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={t.name} variants={FU} custom={i * 0.07}
                                whileHover={{ y: -4, borderColor: '#3f3f46' }}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-5">"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                                    <div>
                                        <p className="font-bold text-white text-sm">{t.name}</p>
                                        <p className="text-zinc-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Sec>
            </section>

            {/* ══ SECURITY ══ */}
            <section className="bg-zinc-950 py-20 px-6 border-y border-zinc-800/60">
                <Sec className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div variants={FL} className="flex-1 text-center lg:text-left">
                            <p className="section-label mb-3">Security First</p>
                            <h2 className="font-display text-4xl font-bold text-white mb-4">Your Health Data Is Sacred</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-8">Built around the world's most stringent medical data security standards. Your records are yours — always.</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[['256-bit AES', Lock], ['HIPAA Compliant', ShieldCheck], ['ISO 27001', Award], ['ABDM Ready', CheckCircle]].map(([l, I]) => (
                                    <div key={l} className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
                                        <I className="w-4 h-4 text-zinc-400 shrink-0" />
                                        <span className="text-white text-sm font-medium">{l}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={FR} className="flex-1 grid grid-cols-2 gap-4">
                            {[['0', 'Data Breaches', 'Flawless track record'], ['100%', 'Encrypted At Rest', 'Every byte protected'], ['99.9%', 'System Uptime', 'Always there when needed'], ['∞', 'Storage Included', 'No limit on records']].map(([v, l, d]) => (
                                <div key={l} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center hover:border-zinc-600 transition-colors">
                                    <p className="text-3xl font-bold text-white font-display mb-1">{v}</p>
                                    <p className="text-white/70 text-sm font-semibold mb-1">{l}</p>
                                    <p className="text-zinc-600 text-xs">{d}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </Sec>
            </section>

            {/* ══ FINAL CTA ══ */}
            <section className="relative bg-zinc-950 py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />

                <Sec className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div variants={FU} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-300 text-sm font-medium mb-8">
                        <Activity className="w-4 h-4 text-emerald-400" /> Join 50,000+ patients who trust SynapticCare
                    </motion.div>
                    <motion.h2 variants={FU} custom={0.1} className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Take Control of<br />Your Health — Today.
                    </motion.h2>
                    <motion.p variants={FU} custom={0.2} className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Your first AI report analysis is free. No credit card required. Start understanding your health right now.
                    </motion.p>
                    <motion.div variants={FU} custom={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="group px-10 py-4 bg-white text-zinc-900 rounded-2xl font-bold text-base hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/doctors" className="group px-10 py-4 border border-zinc-700 text-zinc-300 rounded-2xl font-bold text-base hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                            <Stethoscope className="w-5 h-5" /> Find a Doctor
                        </Link>
                    </motion.div>
                    <motion.p variants={FU} custom={0.4} className="text-zinc-600 text-sm mt-8 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> HIPAA Compliant · Free forever plan · No card required
                    </motion.p>
                </Sec>
            </section>
        </div>
    );
}
