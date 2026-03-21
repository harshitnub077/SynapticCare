import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, HeartPulse, Droplet, Thermometer, ShieldCheck, ArrowUpRight, ArrowDownRight, User } from 'lucide-react';

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
    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-trust-50 to-white -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
                
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 mb-4 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Telemetry Active
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 tracking-tight">
                            Patient <span className="text-trust-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Your clinical metrics and AI health analysis.</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-slate-200 shadow-sm w-fit"
                    >
                        <div className="w-10 h-10 rounded-full bg-trust-100 flex items-center justify-center text-trust-600 font-bold">
                            H
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Harshit</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Standard Patient</p>
                        </div>
                    </motion.div>
                </header>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Heart Rate", value: "72", unit: "bpm", icon: HeartPulse, color: "rose", change: "+2%", up: true },
                        { title: "Blood Oxygen", value: "99", unit: "%", icon: Droplet, color: "sky", change: "+1%", up: true },
                        { title: "Body Temp", value: "98.6", unit: "°F", icon: Thermometer, color: "amber", change: "-0.2%", up: false },
                        { title: "Overall Health", value: "94", unit: "/100", icon: Activity, color: "emerald", change: "+5%", up: true }
                    ].map((metric, i) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="medical-card p-6 border-slate-100 hover:border-slate-200 cursor-default"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={"w-12 h-12 rounded-2xl flex items-center justify-center bg-" + metric.color + "-50"}>
                                        <Icon className={"w-6 h-6 text-" + metric.color + "-500"} />
                                    </div>
                                    <div className={"flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md " + (metric.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                                        {metric.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {metric.change}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-slate-500 font-medium text-sm mb-1">{metric.title}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold font-display text-slate-900 tracking-tight">{metric.value}</span>
                                        <span className="text-sm font-semibold text-slate-400">{metric.unit}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Chart */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 medical-card border-slate-100 p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Vitals Timeline</h3>
                                <p className="text-sm text-slate-500 font-medium">Weekly biometric stability analysis</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Week</button>
                                <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-trust-600 text-white shadow-sm">Month</button>
                            </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_HEALTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVitals" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 600 }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Area type="monotone" dataKey="vitals" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVitals)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Secondary Chart */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="medical-card border-slate-100 p-8 flex flex-col"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Activity Level</h3>
                            <p className="text-sm text-slate-500 font-medium">Daily step count (thousands)</p>
                        </div>
                        
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_HEALTH_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f1f5f9', radius: 8 }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                    />
                                    <Bar dataKey="steps" fill="#0ea5e9" radius={[6, 6, 6, 6]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                <Activity className="w-5 h-5 text-sky-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Target Reached!</p>
                                <p className="text-xs text-slate-500 font-medium">You met your goal 5 days this week.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
