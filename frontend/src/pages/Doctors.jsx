import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";

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

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchDoctors();
    }, [debouncedSearch, filters]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (filters.specialization) params.append("specialization", filters.specialization);
            if (filters.sortBy) params.append("sortBy", filters.sortBy);

            const response = await api.get(`/doctors?${params.toString()}`);
            setDoctors(response.data.doctors);
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
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 min-w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            />

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    value={filters.specialization}
                                    onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">All Specialists</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>

                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="rating_desc">Highest Rated</option>
                                    <option value="experience_desc">Most Experienced</option>
                                    <option value="fees_asc">Lowest Fees</option>
                                    <option value="fees_desc">Highest Fees</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                    Appointment booked successfully!
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No doctors found. Try adjusting your filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onBook={setSelectedDoctor}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
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
