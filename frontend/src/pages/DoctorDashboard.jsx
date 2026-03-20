import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Users, CalendarCheck, Clock, ShieldAlert, Activity } from "lucide-react";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/appointments/doctor", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(res.data.appointments);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError("Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/appointments/status/${id}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update appointment status.");
        }
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading patient data...</p>
            </div>
        </div>
    );

    const pendingAppointments = appointments.filter(a => a.status === 'booked').length;
    const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Doctor Stats Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="medical-card border-l-4 border-l-teal-500 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Patients</p>
                        <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
                    </div>
                </div>

                <div className="medical-card border-l-4 border-l-blue-500 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Today's Schedule</p>
                        <p className="text-2xl font-bold text-slate-900">{todayAppointments}</p>
                    </div>
                </div>

                <div className="medical-card border-l-4 border-l-amber-500 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <Clock className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Pending Requests</p>
                        <p className="text-2xl font-bold text-slate-900">{pendingAppointments}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Main Appointments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-medical-600" />
                        Patient Consultation Queue
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100 hidden sm:table-header-group">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinical Notes</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <CalendarCheck className="w-12 h-12 mb-3 opacity-20" />
                                            <p>No appointments pending.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors group block sm:table-row">
                                        <td className="px-6 py-4 block sm:table-cell">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-medical-100 text-medical-700 flex items-center justify-center font-bold text-sm hidden sm:flex">
                                                    {apt.user?.name?.charAt(0) || "P"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{apt.user?.name || "Unknown Patient"}</div>
                                                    <div className="text-sm text-slate-500">{apt.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 block sm:table-cell mt-2 sm:mt-0">
                                            <div className="text-slate-900 font-medium">
                                                {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {apt.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 block sm:table-cell mt-2 sm:mt-0">
                                            <p className="line-clamp-2 max-w-xs text-sm">{apt.reason || "Routine check-up"}</p>
                                        </td>
                                        <td className="px-6 py-4 block sm:table-cell mt-2 sm:mt-0">
                                            <span
                                                className={`badge-medical ${apt.status === "confirmed"
                                                    ? "status-success"
                                                    : apt.status === "cancelled"
                                                        ? "status-error"
                                                        : "status-warning"
                                                    }`}
                                            >
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 block sm:table-cell mt-4 sm:mt-0 text-right">
                                            {apt.status === "booked" ? (
                                                <div className="flex justify-start sm:justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm rounded-lg transition-colors border border-emerald-200"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                                                        className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium text-sm rounded-lg transition-colors border border-rose-200"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
