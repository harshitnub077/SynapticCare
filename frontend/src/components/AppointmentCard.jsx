import React from "react";
import { Calendar, Clock, MapPin, Stethoscope, Video } from "lucide-react";

const AppointmentCard = ({ appointment, onCancel }) => {
    const statusConfig = {
        booked: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Scheduled" },
        completed: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Completed" },
        cancelled: { color: "bg-rose-50 text-rose-700 border-rose-200", label: "Cancelled" },
    };

    const currentStatus = statusConfig[appointment.status] || { color: "bg-slate-50 text-slate-600 border-slate-200", label: appointment.status };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="medical-card p-0 overflow-hidden group">
            <div className="p-5 flex justify-between items-start">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-medical-100 to-medical-50 rounded-xl flex items-center justify-center text-medical-600 font-bold text-lg border border-medical-200 shrink-0 shadow-inner">
                        {appointment.doctor?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-medical-600 transition-colors">{appointment.doctor?.name || "Dr. Unknown"}</h3>
                        <p className="text-sm font-medium text-medical-600 flex items-center gap-1 mt-0.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {appointment.doctor?.specialization || "General"}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${currentStatus.color}`}>
                    {currentStatus.label}
                </span>
            </div>

            <div className="px-5 py-4 bg-slate-50 border-y border-slate-100/50 space-y-3">
                <div className="flex items-center text-slate-600 text-sm gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-900">{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-900">{appointment.time}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {appointment.doctor?.location?.toLowerCase().includes("online") || appointment.doctor?.location?.toLowerCase().includes("video") ? (
                            <Video className="w-4 h-4 text-slate-400" />
                        ) : (
                            <MapPin className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <span className="text-slate-700">{appointment.doctor?.location || "TBD"}</span>
                </div>
            </div>

            {appointment.status === "booked" && (
                <div className="p-5 flex items-center justify-between bg-white border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Standard consultation</p>
                    <button
                        onClick={() => onCancel(appointment.id)}
                        className="px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors text-sm font-semibold"
                    >
                        Cancel Visit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
