import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";
import { Search, Filter, Loader, UserPlus, CheckCircle } from "lucide-react";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        specialization: "",
        sortBy: "rating_desc",
    });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9;

    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        fetchDoctors();
    }, [debouncedSearch, filters, page]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (filters.specialization) params.append("specialization", filters.specialization);
            if (filters.sortBy) params.append("sortBy", filters.sortBy);
            params.append("page", page);
            params.append("limit", limit);

            const response = await api.get(`/doctors?${params.toString()}`);
            setDoctors(response.data.doctors);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookingSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const specializations = [
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Pediatrician",
        "General Physician",
        "Orthopedic",
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 slide-in-from-right-4 duration-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Appointment booked successfully!</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Find a Specialist</h1>
                    <p className="text-slate-500 text-sm">Book online consultations with top medical experts</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search doctors by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[260px] pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={filters.specialization}
                                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 outline-none appearance-none font-medium text-slate-700 shadow-sm cursor-pointer"
                            >
                                <option value="">All Specialists</option>
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 outline-none font-medium text-slate-700 shadow-sm cursor-pointer"
                        >
                            <option value="rating_desc">Highest Rated</option>
                            <option value="experience_desc">Most Experienced</option>
                            <option value="fees_asc">Lowest Fees</option>
                            <option value="fees_desc">Highest Fees</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[40vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <Loader className="w-8 h-8 animate-spin text-medical-500" />
                        Finding specialists...
                    </div>
                </div>
            ) : doctors.length === 0 ? (
                <div className="medical-card border-dashed border-2 flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <UserPlus className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No specialists found</h3>
                    <p className="text-slate-500 max-w-sm">
                        We couldn't find any doctors matching your current filters. Try adjusting your search criteria.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onBook={setSelectedDoctor}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-8 pb-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            <span className="text-slate-600 font-medium text-sm bg-slate-100 px-4 py-2 rounded-lg">
                                Page {page} of {Math.max(1, totalPages)}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default Doctors;
