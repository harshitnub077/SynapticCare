import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Stethoscope, Star, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const MOCK_INDIAN_DOCTORS = [
    {
        id: 1,
        name: "Dr. Ananya Sharma",
        specialty: "Neurologist",
        hospital: "AIIMS, New Delhi",
        experience: "15+ Years",
        rating: 4.9,
        reviews: 1240,
        availability: "Available Today",
        price: "₹1,500",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Dr. Sidharth Menon",
        specialty: "Cardiologist",
        hospital: "Apollo Hospitals, Chennai",
        experience: "20+ Years",
        rating: 4.8,
        reviews: 3100,
        availability: "Wait: 15 mins",
        price: "₹2,000",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Dr. Kavita Desai",
        specialty: "Endocrinologist",
        hospital: "Lilavati Hospital, Mumbai",
        experience: "12+ Years",
        rating: 4.9,
        reviews: 950,
        availability: "Available Tomorrow",
        price: "₹1,200",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Dr. Rajesh Kumar",
        specialty: "Orthopedic Surgeon",
        hospital: "Fortis Escorts, Jaipur",
        experience: "18+ Years",
        rating: 4.7,
        reviews: 2100,
        availability: "Available Today",
        price: "₹1,800",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Dr. Meera Patel",
        specialty: "Dermatologist",
        hospital: "Manipal Hospital, Bangalore",
        experience: "10+ Years",
        rating: 4.9,
        reviews: 4200,
        availability: "Wait: 20 mins",
        price: "₹1,000",
        image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Dr. Vikram Singh",
        specialty: "Oncologist",
        hospital: "Tata Memorial, Mumbai",
        experience: "25+ Years",
        rating: 5.0,
        reviews: 890,
        availability: "Next Week",
        price: "₹2,500",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop"
    }
];

export default function Doctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDomain, setActiveDomain] = useState('All');

    const domains = ['All', 'Neurologist', 'Cardiologist', 'Endocrinologist', 'Orthopedic Surgeon', 'Dermatologist', 'Oncologist'];

    const filteredDoctors = MOCK_INDIAN_DOCTORS.filter(doc => 
        (activeDomain === 'All' || doc.specialty === activeDomain) &&
        (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="w-full min-h-screen relative bg-white pb-32">
            
            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50 to-white -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center pt-16 pb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-50 text-trust-600 text-sm font-semibold tracking-wide mb-6">
                        <ShieldCheck className="w-4 h-4" /> Verified Medical Professionals
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                        Find The Right <span className="text-trust-600">Specialist</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
                        Connect with India's most trusted doctors from premier institutions. Book high-definition video consults or in-person visits instantly.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-trust-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            className="input-medical pl-12 py-5 text-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                            placeholder="Search doctors, hospitals, or specialties..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-3 top-3 bottom-3 bg-trust-600 text-white px-6 rounded-xl font-medium hover:bg-trust-700 transition-colors shadow-sm">
                            Search
                        </button>
                    </div>

                    {/* Domain Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        {domains.map(domain => (
                            <button
                                key={domain}
                                onClick={() => setActiveDomain(domain)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeDomain === domain 
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid Section */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
                >
                    <AnimatePresence>
                        {filteredDoctors.map((doc, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                key={doc.id}
                                className="medical-card p-0 overflow-hidden flex flex-col h-full bg-white group cursor-pointer"
                            >
                                {/* Banner Area */}
                                <div className="h-24 bg-gradient-to-r from-slate-100 to-indigo-50/50 relative"></div>
                                
                                {/* Content Area */}
                                <div className="px-6 pb-6 pt-0 flex-1 flex flex-col relative">
                                    {/* Floating Avatar */}
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md absolute -top-10 border border-slate-100 ring-4 ring-white">
                                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>

                                    {/* Action Header */}
                                    <div className="flex justify-end pt-3 mb-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                                            doc.availability.includes('Today') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            doc.availability.includes('mins') ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-slate-50 text-slate-600 border border-slate-200'
                                        }`}>
                                            {doc.availability.includes('Today') || doc.availability.includes('mins') ? (
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                            ) : (
                                                <Calendar className="w-3 h-3" />
                                            )}
                                            {doc.availability}
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-trust-600 transition-colors leading-tight mb-1">{doc.name}</h3>
                                    <p className="text-trust-600 font-medium text-sm mb-3 flex items-center gap-1.5">
                                        <Stethoscope className="w-4 h-4" /> {doc.specialty}
                                    </p>

                                    <div className="space-y-2 mb-6 text-sm text-slate-600">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" /> {doc.hospital}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" /> {doc.experience} Experience
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-400" /> 
                                            <span className="font-semibold text-slate-700">{doc.rating}</span> 
                                            <span className="text-slate-400">({doc.reviews.toLocaleString()} patients)</span>
                                        </p>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="font-semibold text-slate-900">{doc.price} <span className="text-xs text-slate-500 font-normal">/ Consult</span></div>
                                        <button className="text-trust-600 font-semibold text-sm flex items-center gap-1 hover:text-trust-700 transition-colors">
                                            Book Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Specialists Found</h3>
                            <p className="text-slate-500">Try adjusting your search terms or filters.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
