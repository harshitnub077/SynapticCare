import React, { useState } from "react";
import api from "../api/axiosConfig";
import {
    X,
    Calendar,
    Clock,
    ShieldCheck,
    Activity,
    ChevronRight,
    CheckCircle2,
    Lock
} from "lucide-react";

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/appointments", {
                doctorId: doctor.id,
                date,
                time
            });
            setBooked(true);
            setTimeout(() => {
                onSuccess();
            }, 2500);
        } catch (err) {
            console.error(err);
            alert("Matrix Collision: Failed to synchronize session.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div
                className="absolute inset-0 bg-nexus-primary/60 backdrop-blur-2xl animate-in fade-in duration-700"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-white nexus-glass-heavy rounded-[4rem] shadow-[0_80px_160px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-700 grid grid-cols-1 lg:grid-cols-5 border-white/80">

                {/* Visual Context Panel */}
                <div className="hidden lg:flex lg:col-span-2 bg-nexus-primary p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img
                            src={doctor.image}
                            className="w-full h-full object-cover grayscale blur-sm scale-110"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-nexus-primary to-transparent" />
                    </div>

                    <div className="relative z-10 stagger-in">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-10 group">
                            <Activity className="w-8 h-8 text-nexus-primary" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-6">
                            Secure <br />
                            <span className="text-nexus-accent">Coordination.</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">
                            Initialize a direct clinical link with {doctor.name}. Our quantum scheduler
                            synchronizes your health trajectory in real-time.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <ShieldCheck className="w-5 h-5 text-nexus-accent" />
                                Specialist Verified
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Lock className="w-5 h-5 text-nexus-accent" />
                                E2E Secure Channel
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                        <p className="text-[9px] font-black text-nexus-accent uppercase tracking-[0.4em] mb-2">Protocol Reference</p>
                        <p className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Nexus-SYS-7729-ALPHA</p>
                    </div>
                </div>

                {/* Interaction Panel */}
                <div className="lg:col-span-3 p-12 md:p-16 flex flex-col justify-center">
                    {!booked ? (
                        <>
                            <header className="mb-12 flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-black text-nexus-primary tracking-tighter mb-2">Initialize Link.</h3>
                                    <p className="text-nexus-text-muted font-medium">Configure your session parameters below.</p>
                                </div>
                                <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all group">
                                    <X className="w-6 h-6 text-slate-400 group-hover:text-nexus-primary" />
                                </button>
                            </header>

                            <form onSubmit={handleBooking} className="space-y-8">
                                <div className="space-y-3 stagger-in">
                                    <label className="text-[10px] font-black text-nexus-text-muted uppercase tracking-widest ml-4">Temporal Target (Date)</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted transition-colors group-focus-within:text-nexus-accent" />
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input-nexus pl-16 py-5"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 stagger-in [animation-delay:0.1s]">
                                    <label className="text-[10px] font-black text-nexus-text-muted uppercase tracking-widest ml-4">Sync Coordinates (Time)</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted transition-colors group-focus-within:text-nexus-accent" />
                                        <input
                                            type="time"
                                            required
                                            className="input-nexus pl-16 py-5"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-50 flex items-center justify-between stagger-in [animation-delay:0.2s]">
                                    <div>
                                        <p className="text-[10px] font-black text-nexus-accent uppercase tracking-widest mb-1">Clinic Fee index</p>
                                        <p className="text-2xl font-black text-nexus-primary">${doctor.fees}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-nexus-text-muted uppercase tracking-widest mb-1">Duration Payload</p>
                                        <p className="text-sm font-bold text-nexus-primary">45m Standard Session</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 stagger-in [animation-delay:0.3s]">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-nexus py-6 text-[10px] tracking-[0.3em] group/btn"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Calibrating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                Confirm Session Protocol
                                                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
                                            </div>
                                        )}
                                    </button>
                                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                        End-to-End Secure Transaction
                                    </p>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10 flex flex-col items-center animate-in zoom-in-95 duration-1000">
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30 neural-pulse">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black text-nexus-primary mb-6">Link Synchronized.</h2>
                            <p className="text-nexus-text-muted text-lg font-medium leading-relaxed max-w-sm mb-12">
                                Coordination protocols established. Your clinical session with {doctor.name}
                                has been successfully mapped to the Nexus stream.
                            </p>
                            <div className="flex items-center gap-3 text-[10px] font-black text-nexus-accent uppercase tracking-[0.5em] animate-pulse">
                                Finalizing Calibration
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
