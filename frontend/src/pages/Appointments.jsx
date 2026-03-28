import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Building2, MapPin, ChevronRight, CheckCircle2, Plus } from 'lucide-react';

const mockAppointments = [
    {
        id: 'APT-091', doctor: 'Dr. Ananya Sharma', specialty: 'Neurologist',
        date: '2026-03-24', time: '10:00 AM', type: 'video', status: 'upcoming',
        hospital: 'AIIMS, New Delhi',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
    },
    {
        id: 'APT-092', doctor: 'Dr. Sidharth Menon', specialty: 'Cardiologist',
        date: '2026-03-15', time: '02:30 PM', type: 'in-person', status: 'completed',
        hospital: 'Apollo Hospitals, Chennai',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
    }
];

export default function Appointments() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const filtered = mockAppointments.filter(a => a.status === activeTab);

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">
            {/* Header */}
            <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden py-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-3">Clinical Schedule</p>
                            <h1 className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight">Consultation History</h1>
                            <p className="text-zinc-500 mt-2 text-lg">Manage your upcoming interactions with medical professionals.</p>
                        </div>
                        <button className="btn-primary px-8 shadow-white/5 whitespace-nowrap"><Plus className="w-4 h-4" /> Book New Session</button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-10">
                {/* Tab Switcher */}
                <div className="flex items-center bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-fit mb-10 shadow-xl">
                    {['upcoming', 'completed'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >{t === 'upcoming' ? 'Upcoming' : 'Past Visits'}</button>
                    ))}
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? filtered.map((apt, i) => (
                            <motion.div key={apt.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.08 }}
                                className="bg-zinc-900 rounded-[32px] border border-zinc-800 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 hover:border-zinc-600 transition-all group relative overflow-hidden shadow-2xl"
                            >
                                <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800 rounded-[24px] min-w-[120px] text-center shrink-0 shadow-inner">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                    <p className="text-5xl font-black font-display text-white leading-none my-1">{new Date(apt.date).getDate()}</p>
                                    <p className="text-[10px] font-bold text-zinc-600">{new Date(apt.date).getFullYear()}</p>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-white/10 blur-md rounded-full group-hover:bg-white/20 transition-all"></div>
                                                <img src={apt.image} alt={apt.doctor} className="relative w-14 h-14 rounded-2xl border border-zinc-800 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">{apt.doctor}</h3>
                                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">{apt.specialty}</p>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${apt.status === 'upcoming' ? 'status-info' : 'bg-zinc-950 text-zinc-500 border-zinc-800'}`}>
                                            {apt.status === 'upcoming' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {apt.status === 'upcoming' ? 'Reserved' : 'Archived'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-950/50 rounded-[20px] border border-zinc-800 p-5 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500"><Clock className="w-4 h-4" /></div>
                                            <span className="text-xs font-bold text-zinc-400">{apt.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">{apt.type === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : <Building2 className="w-4 h-4" />}</div>
                                            <span className="text-xs font-bold text-zinc-400 capitalize">{apt.type} Interaction</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500"><MapPin className="w-4 h-4" /></div>
                                            <span className="text-xs font-bold text-zinc-400 truncate">{apt.hospital}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-3 justify-end items-center shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-zinc-800 lg:pl-8">
                                    {apt.status === 'upcoming' && (
                                        <>
                                            {apt.type === 'video' && <button className="btn-primary py-3 text-[10px] uppercase tracking-widest w-full"><Video className="w-4 h-4" />Launch Session</button>}
                                            <button className="px-5 py-3 border border-zinc-800 text-red-900/40 hover:text-red-500 hover:border-red-950 hover:bg-red-950/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-full">Reschedule</button>
                                        </>
                                    )}
                                    {apt.status === 'completed' && (
                                        <button className="px-5 py-3 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 bg-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-2">View Summary <ChevronRight className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-zinc-900 rounded-[32px] border border-zinc-800 border-dashed p-24 text-center"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Calendar className="w-10 h-10 text-zinc-700" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No {activeTab} consultations</h3>
                                <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-base">Your clinical schedule is currently empty for this category.</p>
                                <button className="btn-primary px-10 shadow-white/5">Initiate Booking</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
