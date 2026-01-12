import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import AppointmentCard from "../components/AppointmentCard";
import CancelModal from "../components/CancelModal";
import {
    Calendar,
    Activity,
    Clock,
    ShieldCheck,
    Plus,
    LayoutGrid,
    X,
    CheckCircle2,
    ChevronRight,
    TrendingUp
} from "lucide-react";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("upcoming");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleData, setRescheduleData] = useState({ id: "", date: "", time: "" });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/appointments");
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id) => {
        setSelectedApptId(id);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        try {
            await api.delete(`/appointments/${selectedApptId}`);
            fetchAppointments();
            setShowCancelModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/appointments/${rescheduleData.id}`, {
                date: rescheduleData.date,
                time: rescheduleData.time
            });
            fetchAppointments();
            setShowRescheduleModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = Array.isArray(appointments)
        ? appointments.filter(appt => {
            const isUpcoming = new Date(appt.date) > new Date();
            return view === "upcoming" ? isUpcoming : !isUpcoming;
        })
        : [];

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            <main className="max-w-[1600px] mx-auto px-6 relative z-10">
                {/* Coordination Header */}
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="stagger-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full mb-8 border border-white shadow-sm">
                            <Clock className="w-4 h-4 text-nexus-accent neural-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent">Real-time Clinical Synchronization</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-nexus-primary tracking-tighter leading-none mb-8">
                            Session <br />
                            <span className="text-gradient">Matrix.</span>
                        </h1>
                        <p className="text-nexus-text-muted max-w-xl font-medium text-xl leading-relaxed">
                            Coordinate your medical trajectory. Manage upcoming clinical
                            sessions and review comprehensive historical metadata.
                        </p>
                    </div>

                    {/* Matrix View Toggle */}
                    <div className="nexus-glass-heavy p-3 rounded-[2.5rem] flex gap-2 border-white/80">
                        <button
                            onClick={() => setView("upcoming")}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === "upcoming" ? "bg-nexus-primary text-white shadow-xl shadow-nexus-primary/20" : "text-nexus-text-muted hover:bg-white/60"
                                }`}
                        >
                            <Calendar className="w-4 h-4" /> Upcoming
                        </button>
                        <button
                            onClick={() => setView("history")}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === "history" ? "bg-nexus-primary text-white shadow-xl shadow-nexus-primary/20" : "text-nexus-text-muted hover:bg-white/60"
                                }`}
                        >
                            <Clock className="w-4 h-4" /> History
                        </button>
                    </div>
                </div>

                {/* Session Stream */}
                {loading ? (
                    <div className="min-h-[500px] flex flex-col items-center justify-center gap-8">
                        <div className="w-20 h-20 border-4 border-nexus-accent/10 border-t-nexus-accent rounded-full animate-spin shadow-2xl shadow-nexus-accent/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-nexus-accent animate-pulse">Synchronizing Session Stream...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-in">
                        {filtered.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                appointment={appt}
                                onCancel={handleCancel}
                                onReschedule={(data) => {
                                    setRescheduleData({ id: data.id, date: data.date.split('T')[0], time: data.time });
                                    setShowRescheduleModal(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[500px] flex flex-col items-center justify-center text-center stagger-in">
                        <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mb-12 border-2 border-slate-50 shadow-2xl shadow-nexus-primary/5">
                            <Calendar className="w-14 h-14 text-slate-200" />
                        </div>
                        <h3 className="text-4xl font-black text-nexus-primary mb-6">Stream Idle.</h3>
                        <p className="text-nexus-text-muted max-w-md font-medium text-lg leading-relaxed">
                            No active clinical signals found in the {view} matrix.
                            Initialize a new session with our specialists.
                        </p>
                        <button
                            onClick={() => navigate("/doctors")}
                            className="mt-12 btn-nexus group"
                        >
                            Initialize Session <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                )}

                {/* System Telemetry Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="nexus-glass-heavy p-10 rounded-[3rem] flex items-center gap-8 border-white/60">
                        <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-nexus-primary uppercase tracking-tight">Verified Protocols Only</h4>
                            <p className="text-nexus-text-muted text-sm font-medium leading-relaxed mt-1">All specialists are board-certified and identity-verified through our clinical cloud.</p>
                        </div>
                    </div>
                    <div className="nexus-glass-heavy p-10 rounded-[3rem] flex items-center gap-8 border-white/60">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-nexus-primary uppercase tracking-tight">Precision Scheduling</h4>
                            <p className="text-nexus-text-muted text-sm font-medium leading-relaxed mt-1">Real-time slot allocation ensures 99.8% session accuracy across all clinical hubs.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reschedule Matrix Interface */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-nexus-primary/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowRescheduleModal(false)} />
                    <div className="relative w-full max-w-xl nexus-glass-heavy shadow-[0_50px_100px_rgba(0,0,0,0.15)] rounded-[3rem] p-12 border-white/80 animate-in zoom-in-95 duration-500">
                        <button onClick={() => setShowRescheduleModal(false)} className="absolute right-10 top-10 text-nexus-text-muted hover:text-nexus-primary">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-14 h-14 bg-nexus-accent text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-nexus-accent/20">
                                <Clock className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-nexus-primary tracking-tighter">Reschedule Protocol</h3>
                                <p className="text-[10px] font-black text-nexus-accent uppercase tracking-[0.2em] mt-1">Matrix Calibration v5.0</p>
                            </div>
                        </div>

                        <form onSubmit={handleRescheduleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-nexus-text-muted uppercase tracking-widest ml-4">New Target Date</label>
                                <input
                                    type="date"
                                    required
                                    value={rescheduleData.date}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                    className="input-nexus py-5"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-nexus-text-muted uppercase tracking-widest ml-4">Sync Time Payload</label>
                                <input
                                    type="time"
                                    required
                                    value={rescheduleData.time}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                    className="input-nexus py-5"
                                />
                            </div>
                            <button type="submit" className="w-full btn-nexus py-6 text-xs tracking-[0.3em]">
                                Commit Calibration <ChevronRight className="w-5 h-5 ml-auto" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <CancelModal
                    onConfirm={confirmCancel}
                    onClose={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
};

export default Appointments;
