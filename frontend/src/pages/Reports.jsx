import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Plus, FileSearch, Calendar, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosConfig from '../api/axiosConfig';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axiosConfig.get('/reports');
                setReports(response.data.reports || []);
            } catch (err) {
                console.error("Error fetching reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">
            {/* Header */}
            <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-3 py-1.5 rounded-full mb-4">
                                <ShieldCheck className="w-3.5 h-3.5" /> Secure HIPAA Archive
                            </div>
                            <h1 className="font-display text-4xl font-bold text-white">My Medical Records</h1>
                            <p className="text-zinc-500 mt-2">Your complete diagnostic history, analyzed by AI.</p>
                        </div>
                        <button onClick={() => navigate('/upload')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-all whitespace-nowrap shrink-0 shadow-lg shadow-white/10">
                            <Plus className="w-4 h-4" /> Upload New Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8">
                {/* Search */}
                <div className="relative mb-8 max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <input type="text" placeholder="Search by report name or type..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-sm transition-all" />
                </div>

                {loading ? (
                    <div className="py-36 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-2 border-zinc-700 border-t-white rounded-full animate-spin mb-4"></div>
                        <p className="text-zinc-500 text-sm">Loading your health records...</p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center bg-zinc-900 rounded-2xl border border-dashed border-zinc-700">
                        <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-5">
                            <FileSearch className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                        <p className="text-zinc-500 text-center max-w-sm mb-6 text-sm">
                            {searchTerm ? 'No reports match your search.' : "You haven't uploaded any medical reports yet."}
                        </p>
                        <button onClick={() => navigate('/upload')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-all">
                            <Plus className="w-4 h-4" /> Upload First Report
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <p className="text-zinc-600 text-sm mb-5">{filteredReports.length} record{filteredReports.length !== 1 ? 's' : ''} found</p>
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {filteredReports.map((report, i) => (
                                    <motion.div layout key={report.id}
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.04 }}
                                        whileHover={{ y: -3, borderColor: '#52525b' }}
                                        onClick={() => navigate("/reports/" + report.id)}
                                        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex flex-col group cursor-pointer transition-all">
                                        
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(report.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-white group-hover:text-zinc-100 transition-colors line-clamp-2 leading-snug">
                                                    {report.title || 'Untitled Medical Record'}
                                                </h3>
                                                <p className="text-zinc-500 text-xs font-medium mt-0.5 capitalize">{report.type || 'Standard Lab Analysis'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-zinc-800 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                                <ShieldCheck className="w-3 h-3" /> AI Evaluated
                                            </span>
                                            <span className="text-sm font-semibold text-zinc-400 group-hover:text-white flex items-center gap-1 transition-colors">
                                                View Insights <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
