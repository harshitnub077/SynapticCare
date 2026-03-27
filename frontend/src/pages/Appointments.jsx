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
        <div className="w-full min-h-screen bg-slate-50 pb-16">
            <div className="bg-white border-b border-slate-200 px-6 py-8">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-slate-900">My Appointments</h1>
                        <p className="text-slate-500 mt-1">Manage upcoming consultations and past visits.</p>
                    </div>
                    <button className="btn-medical-primary w-fit shrink-0"><Plus className="w-4 h-4" /> Book New</button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-8">
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit mb-8">
                    {['upcoming', 'completed'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all capitalize ${activeTab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >{t === 'upcoming' ? 'Upcoming' : 'Past Visits'}</button>
                    ))}
                </div>

                <div className="space-y-5">
                    <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? filtered.map((apt, i) => (
                            <motion.div key={apt.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${apt.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>

                                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-xl min-w-[100px] text-center shrink-0">
                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                    <p className="text-4xl font-black font-display text-blue-700 leading-none my-1">{new Date(apt.date).getDate()}</p>
                                    <p className="text-xs font-semibold text-blue-400">{new Date(apt.date).getFullYear()}</p>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img src={apt.image} alt={apt.doctor} className="w-11 h-11 rounded-full border-2 border-slate-200 object-cover" />
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">{apt.doctor}</h3>
                                                <p className="text-sm text-slate-400 font-medium">{apt.specialty}</p>
                                            </div>
                                        </div>
                                        <span className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${apt.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {apt.status === 'upcoming' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                            {apt.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 w-fit">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                                        <span className="flex items-center gap-1.5">{apt.type === 'video' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <Building2 className="w-3.5 h-3.5" />}<span className="capitalize">{apt.type} Consult</span></span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{apt.hospital}</span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3 justify-end items-center shrink-0">
                                    {apt.status === 'upcoming' && (
                                        <>
                                            {apt.type === 'video' && <button className="btn-medical-primary text-sm py-2.5 px-5 whitespace-nowrap"><Video className="w-4 h-4" />Join Call</button>}
                                            <button className="btn-medical-secondary text-sm py-2.5 px-5 text-red-500 hover:text-red-600 whitespace-nowrap">Cancel</button>
                                        </>
                                    )}
                                    {apt.status === 'completed' && (
                                        <button className="btn-medical-secondary text-sm py-2.5 px-5 whitespace-nowrap">Summary <ChevronRight className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
                                    <Calendar className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No {activeTab} appointments</h3>
                                <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm">You don't have any appointments in this category yet.</p>
                                <button className="btn-medical-primary mx-auto">Book a Consultation</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
