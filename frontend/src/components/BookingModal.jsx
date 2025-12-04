import React, { useState } from "react";
import api from "../api/axiosConfig";

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/appointments",
                {
                    doctorId: doctor.id,
                    date,
                    time,
                    reason,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Booking failed:", err);
            setError(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">Book Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded border border-blue-100">
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                            {doctor.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-blue-600">{doctor.specialization}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Date
                            </label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Time
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setTime(slot)}
                                        className={`py-2 text-sm rounded border ${time === slot
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason (Optional)
                            </label>
                            <textarea
                                rows="3"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Briefly describe your symptoms..."
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !date || !time}
                            className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
