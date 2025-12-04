import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const DoctorDashboard = ({ onLogout }) => {
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
            // Refresh list
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update appointment status.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <span className="text-xl font-semibold text-slate-900">
                                SynapticCare (Doctor)
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={onLogout}
                                className="text-slate-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Doctor Dashboard</h1>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800">Appointment Requests</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-medium text-slate-500">Patient</th>
                                        <th className="px-6 py-3 text-sm font-medium text-slate-500">Date & Time</th>
                                        <th className="px-6 py-3 text-sm font-medium text-slate-500">Reason</th>
                                        <th className="px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                                        <th className="px-6 py-3 text-sm font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {appointments.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                No appointments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        appointments.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{apt.user?.name || "Unknown"}</div>
                                                    <div className="text-sm text-slate-500">{apt.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-900">
                                                        {new Date(apt.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-slate-500">{apt.time}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {apt.reason || "No reason provided"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${apt.status === "confirmed"
                                                            ? "bg-green-100 text-green-800"
                                                            : apt.status === "cancelled"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {apt.status === "booked" && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                                                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                                                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
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
            </div>
        </div>
    );
};

export default DoctorDashboard;
