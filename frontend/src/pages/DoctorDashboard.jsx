import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
    Activity,
    User,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    MoreVertical,
    LayoutGrid,
    LogOut,
    ArrowRight,
    TrendingUp,
    Database
} from "lucide-react";

const DoctorDashboard = ({ onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("/appointments/doctor");
            // Assuming res.data.appointments is the correct path based on previous file
            setAppointments(res.data.appointments || []);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError("Synchronization Failure: Clinical Data Link Interrupted.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/status/${id}`, { status });
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Matrix Collision: Failed to update session protocol.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center flex-col gap-10">
            <div className="w-24 h-24 border-8 border-nexus-accent/10 border-t-nexus-accent rounded-full animate-spin shadow-2xl shadow-nexus-accent/20" />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-nexus-accent animate-pulse">Initializing Specialist Terminal...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            {/* Global Telemetry Navbar (Dashboard Specific) */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] w-full max-w-[1500px] px-6">
                <div className="nexus-glass-heavy rounded-full px-10 py-4 flex items-center justify-between shadow-2xl shadow-nexus-primary/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-nexus-primary rounded-xl flex items-center justify-center shadow-lg neural-pulse">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-nexus-primary uppercase tracking-widest leading-none">Specialist Terminal</h2>
                            <p className="text-[9px] font-black text-nexus-accent uppercase tracking-[0.3em] mt-1.5 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-nexus-accent" /> Alpha Protocol V5
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 p-1 bg-white/40 rounded-2xl border border-white">
                            {[
                                { label: "Patient Load", value: "Optimal", color: "text-emerald-500" },
                                { label: "Sync Status", value: "Verified", color: "text-blue-500" }
                            ].map((stat, i) => (
                                <div key={i} className="px-6 py-2">
                                    <p className="text-[8px] font-black text-nexus-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-[10px] font-black uppercase ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all duration-500 active:scale-95"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto px-6 relative z-10">
                {/* Header Stats Strip */}
                <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div className="stagger-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full mb-8 border border-white shadow-sm">
                            <Activity className="w-4 h-4 text-nexus-accent neural-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent">Master Clinical Oversight</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-nexus-primary tracking-tighter leading-[0.9] mb-8">
                            Command <br />
                            <span className="text-gradient">Center.</span>
                        </h1>
                        <p className="text-nexus-text-muted max-w-xl font-medium text-xl leading-relaxed">
                            Unified specialist oversight. Orchestrate patient trajectories,
                            verify diagnostic requests, and manage clinical synchronizations.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 stagger-in">
                        <div className="nexus-glass p-8 rounded-[3rem] border-white/80 shadow-xl">
                            <TrendingUp className="w-10 h-10 text-nexus-accent mb-6" />
                            <p className="text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.3em] mb-2">Weekly Throughput</p>
                            <p className="text-4xl font-black text-nexus-primary tracking-tighter">114 %</p>
                        </div>
                        <div className="nexus-glass p-8 rounded-[3rem] border-white/80 shadow-xl relative overflow-hidden">
                            <Database className="w-10 h-10 text-emerald-500 mb-6" />
                            <p className="text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.3em] mb-2">Systems Health</p>
                            <p className="text-4xl font-black text-nexus-primary tracking-tighter italic">OPTIMAL</p>
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-100/30 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>

                {/* Session Matrix (Table Redesign) */}
                <div className="nexus-glass-heavy rounded-[4rem] border-white/80 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.05)] stagger-in delay-200">
                    <div className="p-10 border-b-2 border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/40">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-nexus-primary text-white rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-nexus-primary/20">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-nexus-primary tracking-tighter">Session Matrix</h3>
                                <div className="flex items-center gap-2 mt-1.5 text-[9px] font-black text-nexus-accent uppercase tracking-[0.2em]">
                                    Active Requests: {appointments.filter(a => a.status === 'booked').length}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="px-6 py-4 bg-white/80 border-2 border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-nexus-text-muted flex items-center gap-3">
                                <Activity className="w-4 h-4" />
                                Monitoring Real-time Pulsar
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-8 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em]">Biological Target (Patient)</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em]">Sync Coordinates (Time)</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em]">Directive / Reason</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em]">Status Link</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em]">Terminal Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-28 text-center bg-white/20">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-slate-100 shadow-xl">
                                                <Database className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <h4 className="text-2xl font-black text-nexus-primary mb-3">Matrix Idle.</h4>
                                            <p className="text-nexus-text-muted font-medium uppercase tracking-widest text-[10px]">No session requests found in the current transmission cycle.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt.id} className="group hover:bg-white transition-all duration-500">
                                            <td className="px-10 py-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-slate-50 relative group-hover:scale-110 transition-transform">
                                                        <User className="w-7 h-7 text-nexus-primary" />
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-nexus-accent rounded-full border-2 border-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-black text-nexus-primary tracking-tight leading-none mb-1.5">{apt.user?.name || "Anonymous Target"}</div>
                                                        <div className="text-[10px] font-bold text-nexus-text-muted uppercase tracking-widest">{apt.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="inline-flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-nexus-accent/5 group-hover:border-nexus-accent/10">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-nexus-primary uppercase tracking-widest leading-none">
                                                        <Calendar className="w-3.5 h-3.5 text-nexus-accent" />
                                                        {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-nexus-accent uppercase tracking-widest leading-none">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {apt.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="max-w-xs text-sm font-bold text-nexus-text-muted leading-relaxed italic border-l-2 border-slate-100 pl-4 group-hover:border-nexus-accent transition-colors">
                                                    {apt.reason || "No clinical directive provided."}
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className={`badge-nexus px-6 py-2.5 rounded-2xl ${apt.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        apt.status === "cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                                                            "bg-blue-50 text-blue-600 border-blue-100"
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${apt.status === 'confirmed' ? 'bg-emerald-500 neural-pulse' : 'bg-current'}`} />
                                                    <span className="font-black uppercase">{apt.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                {apt.status === "booked" ? (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                                                            className="flex-1 bg-nexus-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-nexus-accent transition-all duration-500 shadow-lg shadow-nexus-primary/20 active:scale-95"
                                                        >
                                                            Sync
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                                                            className="w-12 h-12 bg-white text-red-500 border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-all duration-500 active:scale-95"
                                                        >
                                                            <XCircle className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="w-full py-4 border-2 border-slate-50 text-slate-300 rounded-2xl text-[9px] font-black uppercase tracking-widest cursor-default">
                                                        Link Terminated
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-10 border-t-2 border-slate-50 bg-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.4em]">End-to-End Clinical Assurance</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Terminal Session: V5.Nexus // Active</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
