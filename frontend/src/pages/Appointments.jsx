import React, { useState, useEffect } from "react";
import { Calendar, Loader, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

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
            await api.put(`/appointments/${selectedAppointmentId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
            await api.put(`/appointments/${selectedAppointmentId}/reschedule`, rescheduleData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAppointments();
            setRescheduleModalOpen(false);
            setSelectedAppointmentId(null);
        } catch (error) {
            alert("Failed to reschedule. Time slot might be taken.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader className="w-8 h-8 animate-spin text-medical-500" />
                    Loading your schedule...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">My Appointments</h1>
                    <p className="text-slate-500">Manage your upcoming and past medical visits</p>
                </div>
                <button onClick={() => navigate("/doctors")} className="btn-medical-primary w-full sm:w-auto">
                    <FilePlus className="w-4 h-4 mr-2" /> Book New
                </button>
            </div>

            {appointments.length === 0 ? (
                <div className="medical-card border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-medical-50 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="w-10 h-10 text-medical-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No appointments scheduled</h3>
                    <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                        Stay on top of your health. Book an online or in-person consultation with our specialized healthcare professionals.
                    </p>
                    <button onClick={() => navigate("/doctors")} className="btn-medical-primary">
                        Find a Specialist
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appointment) => (
                        <div key={appointment.id} className="relative h-full flex">
                            <div className="flex-1">
                                <AppointmentCard
                                    appointment={appointment}
                                    onCancel={initiateCancel}
                                />
                            </div>
                            
                            {/* Reschedule Button overlay inside card structure */}
                            {appointment.status !== 'cancelled' && (
                                <div className="absolute top-5 right-[110px] sm:right-[120px]">
                                    <button
                                        onClick={() => initiateReschedule(appointment)}
                                        className="text-xs text-medical-600 hover:text-medical-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-medical-200 hover:border-medical-300 hover:bg-medical-50 transition-colors shadow-sm"
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CancelModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />

            {rescheduleModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Reschedule Visit</h3>
                        <p className="text-slate-500 mb-6 text-sm">Choose a new date and time for your appointment.</p>
                        <form onSubmit={handleRescheduleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-medical"
                                    value={rescheduleData.date}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Time</label>
                                <input
                                    type="time"
                                    required
                                    className="input-medical"
                                    value={rescheduleData.time}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setRescheduleModalOpen(false)}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-medical-primary px-6"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
