import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Users, CalendarCheck, Clock, ShieldAlert, Activity } from "lucide-react";
import { motion } from "framer-motion";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => { fetchAppointments(); }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/appointments/doctor", { headers: { Authorization: `Bearer ${token}` } });
            setAppointments(res.data.appointments);
        } catch (err) {
            setError("Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/appointments/status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchAppointments();
        } catch (err) {
            alert("Failed to update appointment status.");
        }
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Loading patient data...</p>
            </div>
        </div>
    );

    const pending = appointments.filter(a => a.status === 'booked').length;
    const today = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length;

    const stats = [
        { label: "Total Patients", value: appointments.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Today's Schedule", value: today, icon: CalendarCheck, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Pending Requests", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="w-full min-h-screen bg-slate-50 pb-16">
            <div className="bg-white border-b border-slate-200 px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold font-display text-slate-900">Provider Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your patient appointments and consultation queue.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {stats.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                                <s.icon className={`w-7 h-7 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3 mb-6">
                        <ShieldAlert className="w-5 h-5 shrink-0" />{error}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" /> Patient Consultation Queue
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {["Patient", "Schedule", "Notes", "Status", "Actions"].map(h => (
                                        <th key={h} className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-16 text-center">
                                        <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400">No appointments in queue.</p>
                                    </td></tr>
                                ) : appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {apt.user?.name?.charAt(0) || "P"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{apt.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-slate-400">{apt.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-800">{new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{apt.time}</p>
                                        </td>
                                        <td className="px-6 py-4"><p className="text-sm text-slate-500 line-clamp-2 max-w-xs">{apt.reason || "Routine check-up"}</p></td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                apt.status === "confirmed" ? "status-success" :
                                                apt.status === "cancelled" ? "status-error" : "status-warning"
                                            }`}>{apt.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {apt.status === "booked" ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatusUpdate(apt.id, "confirmed")} className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-lg transition-colors">Accept</button>
                                                    <button onClick={() => handleStatusUpdate(apt.id, "cancelled")} className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold rounded-lg transition-colors">Decline</button>
                                                </div>
                                            ) : <span className="text-xs text-slate-400 italic">No actions</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
