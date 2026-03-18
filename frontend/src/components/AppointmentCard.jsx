import React from "react";

const AppointmentCard = ({ appointment, onCancel }) => {
    const statusColors = {
        booked: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                        {appointment.doctor.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{appointment.doctor.name}</h3>
                        <p className="text-sm text-blue-600">{appointment.doctor.specialization}</p>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded text-xs font-semibold uppercase ${statusColors[appointment.status] || "bg-gray-100 text-gray-600"
                        }`}
                >
                    {appointment.status}
                </span>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div>
                    <span className="font-medium text-gray-900">Date:</span> {formatDate(appointment.date)}
                </div>
                <div>
                    <span className="font-medium text-gray-900">Time:</span> {appointment.time}
                </div>
                <div>
                    <span className="font-medium text-gray-900">Location:</span> {appointment.doctor.location}
                </div>
            </div>

            {appointment.status === "booked" && (
                <button
                    onClick={() => onCancel(appointment.id)}
                    className="w-full py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    Cancel Appointment
                </button>
            )}
        </div>
    );
};

export default AppointmentCard;
