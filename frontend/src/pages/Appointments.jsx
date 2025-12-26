import React, { useState, useEffect } from "react";
import { Calendar, Loader } from "lucide-react";
import api from "../api/axiosConfig";
import AppointmentCard from "../components/AppointmentCard";
import CancelModal from "../components/CancelModal";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const initiateCancel = (id) => {
        setSelectedAppointmentId(id);
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedAppointmentId) return;

        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/appointments/${selectedAppointmentId}/cancel`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Refresh list
            fetchAppointments();
            setCancelModalOpen(false);
            setSelectedAppointmentId(null);
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
        }
    };

    const initiateReschedule = (appointment) => {
        setSelectedAppointmentId(appointment.id);
        setRescheduleData({
            date: new Date(appointment.date).toISOString().split('T')[0],
            time: appointment.time
        });
        setRescheduleModalOpen(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppointmentId) return;

        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/appointments/${selectedAppointmentId}/reschedule`,
                rescheduleData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchAppointments();
            setRescheduleModalOpen(false);
            setSelectedAppointmentId(null);
        } catch (error) {
            console.error("Failed to reschedule appointment:", error);
            alert("Failed to reschedule. Time slot might be taken.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
                        <p className="text-slate-600 mt-1">Manage your upcoming and past visits</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No appointments yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Book your first consultation with our expert doctors.
                        </p>
                        <a
                            href="/doctors"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Find a Doctor
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="relative">
                                <AppointmentCard
                                    appointment={appointment}
                                    onCancel={initiateCancel}
                                />
                                {appointment.status !== 'cancelled' && (
                                    <button
                                        onClick={() => initiateReschedule(appointment)}
                                        className="absolute bottom-4 right-24 text-sm text-blue-600 hover:text-blue-800 font-medium bg-white px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                    >
                                        Reschedule
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CancelModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />

            {/* Reschedule Modal */}
            {rescheduleModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all">
                        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Reschedule Appointment</h3>
                            <button
                                onClick={() => setRescheduleModalOpen(false)}
                                className="text-white hover:text-blue-100 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-600 mb-6 text-sm">
                                Choose a new date and time for your appointment. previous booking will be updated.
                            </p>

                            <form onSubmit={handleRescheduleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={rescheduleData.date}
                                            onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={rescheduleData.time}
                                            onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setRescheduleModalOpen(false)}
                                        className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all hover:translate-y-[-1px]"
                                    >
                                        Confirm Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
