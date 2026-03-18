import React from "react";

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-bold">
                    {doctor.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500 mt-1">{doctor.location}</p>
                </div>
                <div className="ml-auto">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-semibold">
                        ★ {doctor.rating.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-medium text-gray-900">{doctor.experience} years</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Fees</span>
                    <span className="font-medium text-gray-900">${doctor.fees}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={doctor.available ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {doctor.available ? "Available" : "Unavailable"}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onBook(doctor)}
                disabled={!doctor.available}
                className={`w-full ${doctor.available ? "btn-medical-primary" : "bg-gray-100 text-gray-400 cursor-not-allowed py-2.5 rounded-lg font-medium"}`}
            >
                Book Appointment
            </button>
        </div>
    );
};

export default DoctorCard;
