import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Home, Building2, MapPin, XCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

const mockAppointments = [
    {
        id: 'APT-091',
        doctor: 'Dr. Ananya Sharma',
        specialty: 'Neurologist',
        date: '2026-03-24',
        time: '10:00 AM',
        type: 'video',
        status: 'upcoming',
        hospital: 'AIIMS, New Delhi',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
    },
    {
        id: 'APT-092',
        doctor: 'Dr. Sidharth Menon',
        specialty: 'Cardiologist',
        date: '2026-03-15',
        time: '02:30 PM',
        type: 'in-person',
        status: 'completed',
        hospital: 'Apollo Hospitals, Chennai',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
    }
];

export default function Appointments() {
    const [activeTab, setActiveTab] = useState('upcoming');

    const filteredAppointments = mockAppointments.filter(apt => apt.status === activeTab);

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-trust-50 to-white -z-10"></div>

            <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-20">
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-bold font-display text-slate-900 tracking-tight mb-2">
                            My <span className="text-trust-600">Appointments</span>
                        </h1>
                        <p className="text-slate-500 text-lg">Manage your upcoming consultations and visit history.</p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex items-center bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-sm w-fit self-center md:self-auto">
                        <button 
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button 
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'completed' ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Past Visits
                        </button>
                    </div>
                </header>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((apt, index) => (
                                <motion.div
                                    key={apt.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                                >
                                    {/* Decoration Line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${apt.status === 'upcoming' ? 'bg-trust-500' : 'bg-slate-300'}`}></div>

                                    {/* Date Column */}
                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[120px] shrink-0">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                        <p className="text-4xl font-black font-display text-slate-900 leading-none my-1">{new Date(apt.date).getDate()}</p>
                                        <p className="text-xs font-semibold text-slate-400">{new Date(apt.date).getFullYear()}</p>
                                    </div>

                                    {/* Details Column */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-100">
                                                    <img src={apt.image} alt={apt.doctor} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">{apt.doctor}</h3>
                                                    <p className="text-trust-600 font-semibold text-sm">{apt.specialty}</p>
                                                </div>
                                            </div>
                                            {/* Status Badge */}
                                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${apt.status === 'upcoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {apt.status === 'upcoming' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {apt.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 w-fit">
                                            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                                <Clock className="w-4 h-4 text-slate-400" /> {apt.time}
                                            </div>
                                            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                                {apt.type === 'video' ? <Video className="w-4 h-4 text-trust-500" /> : <Building2 className="w-4 h-4 text-slate-400" />}
                                                <span className="capitalize">{apt.type} Consult</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-slate-400" /> {apt.hospital}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex flex-row md:flex-col justify-end gap-3 mt-4 md:mt-0 shrink-0">
                                        {apt.status === 'upcoming' && (
                                            <>
                                                {apt.type === 'video' && (
                                                    <button className="btn-medical-primary whitespace-nowrap px-5 py-2.5 text-sm w-full md:w-auto">
                                                        <Video className="w-4 h-4" /> Join Call
                                                    </button>
                                                )}
                                                <button className="btn-medical-secondary bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200 hover:border-rose-200 whitespace-nowrap px-5 py-2.5 text-sm w-full md:w-auto">
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'completed' && (
                                            <button className="flex items-center justify-center gap-2 text-trust-600 font-bold text-sm hover:text-trust-700 transition-colors bg-trust-50 hover:bg-trust-100 px-5 py-2.5 rounded-xl w-full md:w-auto">
                                                View Summary <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center shadow-sm"
                            >
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No {activeTab} appointments</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">You don't have any appointments scheduled for the selected category.</p>
                                <button className="btn-medical-primary mx-auto">Book Consultation</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
