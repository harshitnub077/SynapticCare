import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Plus, FileSearch, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
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
                setReports(response.data);
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
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* Header Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-semibold tracking-wide mb-4 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure HIPAA Archive
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight">
                            Medical <span className="text-trust-600">Records</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Your complete diagnostic history, analyzed by AI.</p>
                    </motion.div>
                    
                    <motion.button 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/upload')}
                        className="btn-medical-primary whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Upload New Report
                    </motion.button>
                </header>

                <div className="space-y-8">
                    
                    {/* Tools */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-trust-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search by report name or type..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-medical pl-12 py-4 text-lg shadow-sm"
                            />
                        </div>
                        <button className="btn-medical-secondary bg-white">
                            <Filter className="w-5 h-5" />
                            Filter Options
                        </button>
                    </motion.div>

                    {/* Data Grid */}
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center text-trust-600">
                            <div className="w-12 h-12 rounded-full border-4 border-trust-200 border-t-trust-600 animate-spin mb-4"></div>
                            <p className="font-semibold animate-pulse">Retrieving Secure Archives...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 border-dashed text-slate-500"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <FileSearch className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Records Found</h3>
                            <p className="text-slate-500 text-center max-w-sm mb-6">
                                You haven't uploaded any medical reports that match your search query.
                            </p>
                            <button onClick={() => navigate('/upload')} className="text-trust-600 font-semibold hover:text-trust-700 underline underline-offset-4">
                                Upload your first report
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {filteredReports.map((report, i) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={report.id} 
                                        onClick={() => navigate("/reports/" + report.id)}
                                        className="medical-card group cursor-pointer flex flex-col h-full bg-white overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-trust-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                                        
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                                <Calendar className="w-3.5 h-3.5 text-trust-500" />
                                                {new Date(report.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-trust-50 flex items-center justify-center text-trust-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="w-4 h-4 -rotate-45" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-trust-100 flex items-center justify-center shrink-0">
                                                <FileText className="w-6 h-6 text-trust-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-trust-600 transition-colors leading-tight line-clamp-2">
                                                    {report.title || 'Untitled Medical Record'}
                                                </h3>
                                                <p className="text-slate-500 text-sm font-medium mt-1 capitalize">{report.type || 'Standard Lab Analysis'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto pt-6">
                                            <div className="w-full bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100 group-hover:border-trust-200 group-hover:bg-trust-50 transition-colors">
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-trust-700 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Evaluated
                                                </span>
                                                <span className="text-sm text-trust-600 font-semibold group-hover:translate-x-1 transition-transform">
                                                    View Insights →
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
