import React from "react";
import { Calendar, Clock, MapPin, ChevronRight, Activity, XCircle, MoreVertical } from "lucide-react";

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
    const isUpcoming = new Date(appointment.date) > new Date();

    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
            case "Completed": return "bg-blue-50 text-blue-600 border-blue-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="nexus-card bg-white/40 group overflow-hidden border-white/60">
            {/* Session Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`badge-nexus px-4 py-2 ${getStatusColor(appointment.status)} flex items-center gap-3`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${appointment.status === 'Confirmed' ? 'bg-emerald-500 neural-pulse' : 'bg-slate-400'}`} />
                    <span className="font-black">Session: {appointment.status}</span>
                </div>
                {isUpcoming && appointment.status !== "Cancelled" && (
                    <button className="w-10 h-10 rounded-2xl bg-white/50 border border-white hover:bg-white transition-all flex items-center justify-center text-slate-400 hover:text-nexus-primary">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Core Metadata */}
            <div className="flex items-start gap-6 mb-10 relative z-10">
                <div className="shrink-0">
                    <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-50">
                        {appointment.doctor?.image ? (
                            <img
                                src={appointment.doctor.image}
                                alt={appointment.doctor.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-nexus-accent/5 text-nexus-accent font-black text-xl italic uppercase">
                                {appointment.doctor?.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <p className="text-[10px] font-black text-nexus-accent uppercase tracking-[0.2em] mb-2">Specialist Coordinator</p>
                    <h3 className="text-2xl font-bold text-nexus-primary leading-tight mb-4 group-hover:text-nexus-accent transition-colors">
                        {appointment.doctor?.name || "Dr. Unassigned"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <Calendar className="w-3.5 h-3.5 text-nexus-accent" />
                            {new Date(appointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <Clock className="w-3.5 h-3.5 text-nexus-accent" />
                            {appointment.time}
                        </div>
                    </div>
                </div>
            </div>

            {/* Integration Details */}
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50/50 mb-8 relative z-10 group-hover:bg-white transition-all duration-700">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <MapPin className="w-6 h-6 text-nexus-accent" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-nexus-text-muted uppercase tracking-widest mb-1">Clinical Coordinates</p>
                        <p className="text-sm font-bold text-nexus-primary leading-relaxed">
                            {appointment.doctor?.clinic || "Nexus Central Hub"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Terminal Actions */}
            {isUpcoming && appointment.status !== "Cancelled" && (
                <div className="flex gap-4 relative z-10 mt-auto">
                    <button
                        onClick={() => onReschedule(appointment)}
                        className="flex-1 btn-nexus shadow-none !px-4"
                    >
                        Reschedule Protocol
                    </button>
                    <button
                        onClick={() => onCancel(appointment.id)}
                        className="w-16 h-16 bg-red-50 text-red-500 border-2 border-red-100 rounded-[1.5rem] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500 active:scale-95"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
            )}

            {!isUpcoming && (
                <button className="w-full btn-nexus-outline shadow-none !bg-white/40">
                    Review Metadata <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
            )}
        </div>
    );
};

export default AppointmentCard;
