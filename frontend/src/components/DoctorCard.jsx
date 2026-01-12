import React from "react";
import { Star, Clock, ChevronRight, ShieldCheck, MapPin, DollarSign } from "lucide-react";

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="nexus-card bg-white/40 group overflow-hidden h-full flex flex-col">
            {/* Sync Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-slate-100 shadow-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-emerald-500 neural-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {doctor.available ? 'Sync: Online' : 'Sync: Offline'}
                    </span>
                </div>
                {doctor.rating > 4.8 && (
                    <div className="flex items-center gap-1.5 text-nexus-accent">
                        <ShieldCheck className="w-4 h-4 fill-nexus-accent/10" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Elite Specialist</span>
                    </div>
                )}
            </div>

            {/* Profile Core */}
            <div className="flex items-start gap-6 mb-10 relative z-10">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-50">
                        {doctor.image ? (
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-nexus-accent bg-nexus-accent/5 font-black text-2xl uppercase">
                                {doctor.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="absolute -inset-3 bg-nexus-accent/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>

                <div className="flex-1 min-w-0 pt-2">
                    <h3 className="text-2xl font-bold text-nexus-primary leading-tight mb-2 group-hover:text-nexus-accent transition-colors duration-500">
                        {doctor.name}
                    </h3>
                    <p className="text-[10px] font-black text-nexus-accent uppercase tracking-[0.2em] mb-4">
                        {doctor.specialization}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span className="text-xs font-black text-slate-700">{doctor.rating?.toFixed(1) || "4.9"}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-nexus-text-muted">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{doctor.experience}Y EXP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clinical Details */}
            <div className="grid grid-cols-2 gap-4 mb-10 mt-auto relative z-10">
                <div className="p-5 bg-white/60 rounded-3xl border border-white flex flex-col justify-center">
                    <p className="text-[9px] font-black text-nexus-text-muted uppercase tracking-widest mb-2">Session Fee</p>
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-lg font-bold text-nexus-primary">${doctor.fees}</span>
                    </div>
                </div>
                <div className="p-5 bg-white/60 rounded-3xl border border-white flex flex-col justify-center">
                    <p className="text-[9px] font-black text-nexus-text-muted uppercase tracking-widest mb-2">Location</p>
                    <div className="flex items-center gap-1.5 text-nexus-primary">
                        <MapPin className="w-3.5 h-3.5 text-nexus-accent" />
                        <span className="text-sm font-bold truncate">{doctor.clinic || "Nexus Hub"}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onBook(doctor)}
                disabled={!doctor.available}
                className={`w-full group/btn relative ${doctor.available
                        ? "btn-nexus shadow-none"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    }`}
            >
                <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-[0.2em]">
                    {doctor.available ? "Initialize Link" : "System Unavailable"}
                    {doctor.available && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-500" />}
                </div>
            </button>
        </div>
    );
};

export default DoctorCard;
