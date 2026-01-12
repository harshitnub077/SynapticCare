import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";
import { Search, Filter, Activity, ShieldCheck, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const specializations = [
        "Cardiology", "Neurology", "General Medicine",
        "Dermatology", "Pediatrics", "Orthopedics", "Psychiatry"
    ];

    useEffect(() => {
        fetchDoctors();
    }, [search, specialization, currentPage]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await api.get("/doctors", {
                params: {
                    name: search,
                    clinic: search,
                    specialization: specialization,
                    page: currentPage,
                    limit: 9
                }
            });
            setDoctors(res.data.doctors || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            <main className="max-w-[1600px] mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="stagger-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full mb-6 border border-white">
                            <Activity className="w-4 h-4 text-nexus-accent neural-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent">Global Specialist Network</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-nexus-primary tracking-tighter leading-none mb-6">
                            Elite <span className="text-gradient">Registry.</span>
                        </h1>
                        <p className="text-nexus-text-muted max-w-xl font-medium text-lg leading-relaxed">
                            Access the world's most advanced medical precision. Connect with board-verified
                            specialists in our next-generation clinical cloud.
                        </p>
                    </div>

                    {/* High-fidelity Filter System */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto nexus-glass-heavy p-6 rounded-[2.5rem]">
                        <div className="relative flex-1 sm:min-w-[300px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted" />
                            <input
                                type="text"
                                placeholder="Search Name or Clinic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-nexus pl-16 py-4"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted" />
                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="input-nexus pl-16 py-4 pr-12 appearance-none cursor-pointer"
                            >
                                <option value="">Specialization</option>
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Database Stream */}
                {loading ? (
                    <div className="min-h-[500px] flex items-center justify-center flex-col gap-6">
                        <div className="w-16 h-16 border-4 border-nexus-accent/20 border-t-nexus-accent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-nexus-accent animate-pulse">Syncing Database...</p>
                    </div>
                ) : doctors.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-in">
                            {doctors.map((doctor) => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                    onBook={(doc) => setSelectedDoctor(doc)}
                                />
                            ))}
                        </div>

                        {/* Pagination Stream */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-5 nexus-glass rounded-2xl hover:bg-nexus-primary hover:text-white transition-all duration-500 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-nexus-text"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2 p-3 nexus-glass rounded-2xl">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all duration-500 ${currentPage === i + 1
                                                ? "bg-nexus-primary text-white shadow-xl"
                                                : "text-nexus-text-muted hover:bg-white"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-5 nexus-glass rounded-2xl hover:bg-nexus-primary hover:text-white transition-all duration-500 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-nexus-text"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="min-h-[500px] flex flex-col items-center justify-center text-center stagger-in">
                        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-100 shadow-2xl shadow-red-500/10">
                            <LayoutGrid className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-nexus-primary mb-4">Registry Null.</h3>
                        <p className="text-nexus-text-muted max-w-md font-medium">
                            No active biological signals detected for this query.
                            Please refine your search parameters.
                        </p>
                        <button
                            onClick={() => { setSearch(""); setSpecialization(""); }}
                            className="mt-10 btn-nexus-outline"
                        >
                            Reset Protocol
                        </button>
                    </div>
                )}
            </main>

            {/* Specialist Onboarding Modal */}
            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onSuccess={() => {
                        setSelectedDoctor(null);
                        // Refresh if needed
                    }}
                />
            )}
        </div>
    );
};

export default Doctors;
