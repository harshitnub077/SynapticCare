import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Activity, HeartPulse, Droplet, Thermometer, ArrowUpRight, ArrowDownRight, FileText, Calendar } from 'lucide-react';

const MOCK_HEALTH_DATA = [
    { name: 'Mon', vitals: 98, steps: 4000 },
    { name: 'Tue', vitals: 98.6, steps: 3000 },
    { name: 'Wed', vitals: 99.1, steps: 2000 },
    { name: 'Thu', vitals: 98.4, steps: 2780 },
    { name: 'Fri', vitals: 98.2, steps: 1890 },
    { name: 'Sat', vitals: 98.6, steps: 2390 },
    { name: 'Sun', vitals: 98.5, steps: 3490 },
];

export default function Dashboard() {
    const metrics = [
        { title: "Heart Rate", value: "72", unit: "bpm", icon: HeartPulse, change: "+2%", up: true },
        { title: "Blood Oxygen", value: "99", unit: "%", icon: Droplet, change: "+1%", up: true },
        { title: "Body Temp", value: "98.6", unit: "°F", icon: Thermometer, change: "-0.2%", up: false },
        { title: "Health Score", value: "94", unit: "/100", icon: Activity, change: "+5%", up: true },
    ];

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">
            {/* Header */}
            <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div>
                            <p className="text-xs text-zinc-600 font-medium mb-1 uppercase tracking-widest">Welcome back</p>
                            <h1 className="font-display text-4xl font-bold text-white">My Health Dashboard</h1>
                            <p className="text-zinc-500 mt-1.5 text-sm">Your vitals and health analytics at a glance.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl w-fit">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-900 font-bold text-sm">H</div>
                            <div><p className="text-sm font-bold text-white">Harshit</p><p className="text-xs text-zinc-500">Patient Account</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                    {metrics.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -3, borderColor: '#52525b' }}
                            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <m.icon className="w-5 h-5 text-zinc-400" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${m.up ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
                                    {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {m.change}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">{m.title}</p>
                            <p className="text-3xl font-bold text-white font-display">{m.value}<span className="text-sm font-medium text-zinc-600 ml-1">{m.unit}</span></p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-bold text-white">Vitals Timeline</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">Weekly biometric stability</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors">Week</button>
                                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-zinc-900">Month</button>
                            </div>
                        </div>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_HEALTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.12} />
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                                    <RechartsTooltip contentStyle={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', color: '#fff' }} />
                                    <Area type="monotone" dataKey="vitals" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#whiteGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col">
                        <div className="mb-5">
                            <h3 className="text-base font-bold text-white">Activity</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Daily step count</p>
                        </div>
                        <div className="flex-1 min-h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_HEALTH_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                                    <RechartsTooltip cursor={{ fill: '#27272a', radius: 8 }} contentStyle={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', color: '#fff' }} />
                                    <Bar dataKey="steps" fill="#ffffff" radius={[5, 5, 0, 0]} barSize={18} opacity={0.8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-900/60 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-700 flex items-center justify-center shrink-0">
                                <Activity className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Goal Reached!</p>
                                <p className="text-xs text-zinc-500">You met your goal 5/7 days.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                        <Link to="/upload" className="flex items-center justify-between p-6 bg-white rounded-2xl text-zinc-900 hover:bg-zinc-100 transition-all shadow-xl shadow-white/10 hover:-translate-y-0.5 group cursor-pointer">
                            <div>
                                <p className="text-zinc-500 text-sm font-medium mb-1">Quick Action</p>
                                <h3 className="text-xl font-bold font-display">Upload a Report</h3>
                            </div>
                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.60 }}>
                        <Link to="/appointments" className="flex items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-zinc-800 transition-all hover:border-zinc-600 hover:-translate-y-0.5 group cursor-pointer">
                            <div>
                                <p className="text-zinc-500 text-sm font-medium mb-1">Next Step</p>
                                <h3 className="text-xl font-bold font-display text-white">Book Appointment</h3>
                            </div>
                            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                <Calendar className="w-6 h-6 text-zinc-400" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
