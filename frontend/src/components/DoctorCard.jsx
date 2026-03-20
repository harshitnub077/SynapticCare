import React from "react";
import { Star, MapPin, Briefcase, DollarSign, Stethoscope } from "lucide-react";

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="medical-card p-0 overflow-hidden flex flex-col group h-full">
            <div className="p-6 pb-5 flex-1 relative">
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-medical-100 to-medical-50 rounded-2xl flex items-center justify-center text-medical-600 text-2xl font-bold shadow-inner border border-medical-100 shrink-0">
                        {doctor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-medical-600 transition-colors truncate">{doctor.name}</h3>
                        <p className="text-medical-600 font-medium text-sm flex items-center gap-1 mt-0.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {doctor.specialization}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {doctor.location}
                        </p>
                    </div>
                </div>

                <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-sm font-bold border border-amber-200/50 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {(doctor.rating || 4.5).toFixed(1)}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Experience</span>
                        </div>
                        <span className="font-bold text-slate-900">{doctor.experience} yrs</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Consult Fee</span>
                        </div>
                        <span className="font-bold text-slate-900">${doctor.fees}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3 mt-auto">
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-slate-500 font-medium">Availability</span>
                    <span className={`flex items-center gap-1.5 text-sm font-bold ${doctor.available ? "text-emerald-600" : "text-rose-600"}`}>
                        <span className={`w-2 h-2 rounded-full ${doctor.available ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {doctor.available ? "Accepting Patients" : "Fully Booked"}
                    </span>
                </div>
                
                <button
                    onClick={() => onBook(doctor)}
                    disabled={!doctor.available}
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        doctor.available 
                            ? "bg-medical-600 hover:bg-medical-700 text-white shadow-sm hover:shadow active:scale-[0.98]" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                >
                    {doctor.available ? "Book Appointment" : "Unavailable"}
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;
