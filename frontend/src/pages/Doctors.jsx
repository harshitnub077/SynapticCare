import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Stethoscope, Star, Clock, ArrowRight, ShieldCheck, Filter, Video, Award } from 'lucide-react';

const DOCTORS = [
    {
        id: 1, name: "Dr. Ananya Sharma", specialty: "Neurologist", subspec: "Stroke & Epilepsy",
        hospital: "AIIMS, New Delhi", experience: "15 Yrs", rating: 4.9, reviews: 1240,
        availability: "Available Today", price: "₹1,500", lang: ["Hindi", "English"],
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        education: "MD Neurology, AIIMS Delhi · DM, PGI Chandigarh",
        awards: ["Best Neurologist 2023 — India Health Awards"],
    },
    {
        id: 2, name: "Dr. Sidharth Menon", specialty: "Cardiologist", subspec: "Interventional Cardiology",
        hospital: "Apollo Hospitals, Chennai", experience: "20 Yrs", rating: 4.8, reviews: 3100,
        availability: "Wait: 15 mins", price: "₹2,000", lang: ["Tamil", "English"],
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        education: "MD Cardiology, JIPMER · Fellowship, Cleveland Clinic USA",
        awards: ["Padmashri Nominee 2022"],
    },
    {
        id: 3, name: "Dr. Kavita Desai", specialty: "Endocrinologist", subspec: "Diabetes & Thyroid",
        hospital: "Lilavati Hospital, Mumbai", experience: "12 Yrs", rating: 4.9, reviews: 950,
        availability: "Available Tomorrow", price: "₹1,200", lang: ["Marathi", "Hindi", "English"],
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        education: "MD Medicine, KEM Mumbai · DM Endocrinology, PGIMER",
        awards: ["Times Healthcare Icon 2023"],
    },
    {
        id: 4, name: "Dr. Rajesh Kumar", specialty: "Orthopedic Surgeon", subspec: "Sports Medicine & Arthroscopy",
        hospital: "Fortis Escorts, Jaipur", experience: "18 Yrs", rating: 4.7, reviews: 2100,
        availability: "Available Today", price: "₹1,800", lang: ["Hindi", "English"],
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        education: "MS Orthopaedics, SMS Medical College · Fellowship, HSS New York",
        awards: ["Excellence in Orthopaedics 2022 — IHEA"],
    },
    {
        id: 5, name: "Dr. Meera Patel", specialty: "Dermatologist", subspec: "Cosmetic & Clinical Dermatology",
        hospital: "Manipal Hospital, Bangalore", experience: "10 Yrs", rating: 4.9, reviews: 4200,
        availability: "Wait: 20 mins", price: "₹1,000", lang: ["Gujarati", "English"],
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        education: "MD Dermatology, B.J. Medical College · Fellowship, Harvard Dermatology",
        awards: ["Top Dermatologist under 40 — India Today"],
    },
    {
        id: 6, name: "Dr. Vikram Singh", specialty: "Oncologist", subspec: "Medical Oncology & Immunotherapy",
        hospital: "Tata Memorial, Mumbai", experience: "25 Yrs", rating: 5.0, reviews: 890,
        availability: "Next Week", price: "₹2,500", lang: ["Hindi", "English"],
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        education: "MD Oncology, TATA Memorial · Post-Doctoral Fellowship, MD Anderson USA",
        awards: ["Padmashri 2021 · ASCO Merit Award"],
    },
    {
        id: 7, name: "Dr. Priya Nair", specialty: "Gynecologist", subspec: "High-Risk Pregnancy & Fertility",
        hospital: "Amrita Institute of Medical Sciences, Kochi", experience: "14 Yrs", rating: 4.8, reviews: 1870,
        availability: "Available Today", price: "₹1,300", lang: ["Malayalam", "English"],
        image: "https://randomuser.me/api/portraits/women/52.jpg",
        education: "MD OBG, Amrita IMS · Fellowship in Reproductive Medicine, Singapore",
        awards: ["Best Gynaecologist, Kerala Health Summit 2023"],
    },
    {
        id: 8, name: "Dr. Arjun Bose", specialty: "Gastroenterologist", subspec: "Advanced Endoscopy & IBD",
        hospital: "AIIMS, Bhubaneswar", experience: "11 Yrs", rating: 4.7, reviews: 710,
        availability: "Available Tomorrow", price: "₹1,400", lang: ["Odia", "Hindi", "English"],
        image: "https://randomuser.me/api/portraits/men/28.jpg",
        education: "DM Gastroenterology, AIIMS Delhi",
        awards: ["Young Gastroenterologist Award 2022 — SGEI"],
    },
    {
        id: 9, name: "Dr. Sneha Iyer", specialty: "Psychiatrist", subspec: "Mood Disorders & Cognitive Therapy",
        hospital: "NIMHANS, Bangalore", experience: "9 Yrs", rating: 4.9, reviews: 2300,
        availability: "Available Today", price: "₹900", lang: ["Kannada", "Tamil", "English"],
        image: "https://randomuser.me/api/portraits/women/35.jpg",
        education: "MD Psychiatry, NIMHANS · Fellowship in CBT, University of Oxford",
        awards: ["Mental Health Champion 2023 — WHO India"],
    },
    {
        id: 10, name: "Dr. Ravi Shankar", specialty: "Pulmonologist", subspec: "Asthma, COPD & Sleep Medicine",
        hospital: "Narayana Health, Hyderabad", experience: "16 Yrs", rating: 4.6, reviews: 1560,
        availability: "Wait: 30 mins", price: "₹1,100", lang: ["Telugu", "Hindi", "English"],
        image: "https://randomuser.me/api/portraits/men/42.jpg",
        education: "MD Pulmonary Medicine, Osmania University · DNB Respiratory Medicine",
        awards: ["Best Pulmonologist — Andhra Pradesh Medical Council 2023"],
    },
    {
        id: 11, name: "Dr. Ayesha Khan", specialty: "Ophthalmologist", subspec: "Retina Surgery & Cataract",
        hospital: "Sankara Eye Hospital, Coimbatore", experience: "13 Yrs", rating: 4.8, reviews: 3400,
        availability: "Available Today", price: "₹1,000", lang: ["Urdu", "Tamil", "English"],
        image: "https://randomuser.me/api/portraits/women/72.jpg",
        education: "MS Ophthalmology, AIIMS Madras · Vitreo-Retina Fellowship, Aravind Eye Care",
        awards: ["Excellence in Ophthalmology 2023 — AIOS"],
    },
    {
        id: 12, name: "Dr. Dinesh Pillai", specialty: "Nephrologist", subspec: "Kidney Transplant & Dialysis",
        hospital: "Christian Medical College, Vellore", experience: "22 Yrs", rating: 4.9, reviews: 540,
        availability: "Next Week", price: "₹2,200", lang: ["Malayalam", "Tamil", "English"],
        image: "https://randomuser.me/api/portraits/men/65.jpg",
        education: "DM Nephrology, CMC Vellore · Transplant Fellowship, Toronto General Hospital",
        awards: ["Padmabhushan Nominee 2023 · ISN Global Kidney Award"],
    },
    {
        id: 13, name: "Dr. Rohit Aggarwal", specialty: "Pediatrician", subspec: "Neonatology & Developmental Paediatrics",
        hospital: "Kalawati Saran Children's Hospital, Delhi", experience: "17 Yrs", rating: 4.7, reviews: 2890,
        availability: "Available Today", price: "₹800", lang: ["Hindi", "Punjabi", "English"],
        image: "https://randomuser.me/api/portraits/men/55.jpg",
        education: "MD Paediatrics, AIIMS Delhi · Fellowship, Great Ormond Street Hospital UK",
        awards: ["Best Pediatrician — Delhi Medical Association 2022"],
    },
    {
        id: 14, name: "Dr. Sunita Rao", specialty: "Radiologist", subspec: "Interventional Radiology & MRI",
        hospital: "Yashoda Hospitals, Secunderabad", experience: "8 Yrs", rating: 4.6, reviews: 430,
        availability: "Available Tomorrow", price: "₹1,600", lang: ["Telugu", "Kannada", "English"],
        image: "https://randomuser.me/api/portraits/women/61.jpg",
        education: "MD Radiodiagnosis, JIPMER · Fellowship, Johns Hopkins Hospital USA",
        awards: ["Young Radiologist Award 2023 — Indian Radiology Congress"],
    },
    {
        id: 15, name: "Dr. Ashok Verma", specialty: "Orthopedic Surgeon", subspec: "Spine Surgery & Joint Replacement",
        hospital: "Max Super Speciality Hospital, Noida", experience: "21 Yrs", rating: 4.8, reviews: 1980,
        availability: "Wait: 10 mins", price: "₹1,900", lang: ["Hindi", "English"],
        image: "https://randomuser.me/api/portraits/men/21.jpg",
        education: "MS Orthopaedics, BHU · Spine Fellowship, Charité, Berlin",
        awards: ["Spine Surgeon of the Year 2023 — Indian Orthopaedic Association"],
    },
];

const SPECIALTIES = ['All', ...Array.from(new Set(DOCTORS.map(d => d.specialty)))];

const availStyle = a =>
    a.includes('Today') || a.includes('mins')
        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900'
        : a.includes('Tomorrow')
        ? 'bg-amber-950/60 text-amber-400 border-amber-900'
        : 'bg-zinc-800 text-zinc-500 border-zinc-700';

export default function Doctors() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const filtered = DOCTORS.filter(d =>
        (filter === 'All' || d.specialty === filter) &&
        (d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.specialty.toLowerCase().includes(search.toLowerCase()) ||
            d.hospital.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">

            {/* ── Header ── */}
            <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(255,255,255,0.05),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> NABH Verified Medical Professionals
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
                        Find the Right Specialist
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
                        Connect with India's most trusted doctors from premier institutions. Book video consults or in-person visits instantly.
                    </motion.p>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                        <input type="text"
                            className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-base transition-all"
                            placeholder="Search doctors, hospitals, specialties..." value={search} onChange={e => setSearch(e.target.value)} />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-10">
                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {SPECIALTIES.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === s
                                ? 'bg-white text-zinc-900 border-white shadow-lg shadow-white/10'
                                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'}`}>
                            {s}
                        </button>
                    ))}
                </div>

                {/* Result count */}
                <p className="text-zinc-600 text-sm mb-6">{filtered.length} specialist{filtered.length !== 1 ? 's' : ''} found</p>

                {/* Cards */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map((doc, i) => (
                            <motion.div layout key={doc.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                                whileHover={{ y: -4, borderColor: '#52525b' }}
                                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col cursor-pointer group transition-all">

                                {/* Card header strip */}
                                <div className="relative h-14 bg-gradient-to-r from-zinc-800 to-zinc-900">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
                                </div>

                                <div className="px-5 pb-5 flex-1 flex flex-col relative">
                                    {/* Avatar + availability */}
                                    <div className="flex items-end justify-between -mt-8 mb-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-zinc-900 shadow-xl">
                                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${availStyle(doc.availability)}`}>
                                            {(doc.availability.includes('Today') || doc.availability.includes('mins')) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                            {doc.availability}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-base font-bold text-white group-hover:text-zinc-100 mb-0.5">{doc.name}</h3>
                                    <p className="text-sm text-zinc-400 font-medium mb-1 flex items-center gap-1">
                                        <Stethoscope className="w-3.5 h-3.5 text-zinc-600" /> {doc.specialty}
                                        <span className="text-zinc-700 text-xs">· {doc.subspec}</span>
                                    </p>

                                    <div className="space-y-1.5 mb-4 mt-2 text-xs text-zinc-500">
                                        <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-zinc-700" />{doc.hospital}</p>
                                        <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-zinc-700" />{doc.experience} Experience</p>
                                        <p className="flex items-center gap-2">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="font-semibold text-zinc-300">{doc.rating}</span>
                                            <span className="text-zinc-600">({doc.reviews.toLocaleString()} patients)</span>
                                        </p>
                                        <p className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-zinc-700" />{doc.lang.join(', ')}</p>
                                    </div>

                                    {/* Education */}
                                    <p className="text-xs text-zinc-600 border-t border-zinc-800 pt-3 mb-3 leading-relaxed">{doc.education}</p>

                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800">
                                        <div className="font-bold text-white text-base">{doc.price}<span className="text-xs text-zinc-500 font-normal ml-1">/Consult</span></div>
                                        <button className="flex items-center gap-1 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg transition-all">
                                            Book Now <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                                <Search className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Specialists Found</h3>
                            <p className="text-zinc-500">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
