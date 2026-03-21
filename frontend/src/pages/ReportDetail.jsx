import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Share2, Activity, Printer, FileText, HeartPulse, ShieldCheck, Tag } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axiosConfig.get("/reports/" + id);
                setReport(response.data);
            } catch (err) {
                console.error("Error fetching report", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center pt-20">
                <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-trust-200 border-t-trust-600 animate-spin"></div>
                    <Activity className="absolute inset-0 m-auto text-trust-600 w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Decrypting Clinical Data...</h3>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 max-w-md">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Record Not Found</h2>
                    <p className="text-slate-500 mb-6">The requested medical record could not be retrieved or decrypted.</p>
                    <button onClick={() => navigate('/reports')} className="btn-medical-primary w-full">
                        Return to Archives
                    </button>
                </div>
            </div>
        );
    }

    // Modernize Markdown Rendering
    const customRenderers = {
        h1: ({children}) => <h1 className="text-3xl font-display font-bold text-slate-900 mt-8 mb-6 pb-4 border-b border-slate-100">{children}</h1>,
        h2: ({children}) => <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">{children}</h2>,
        h3: ({children}) => <h3 className="text-xl font-display font-bold text-slate-800 mt-6 mb-3">{children}</h3>,
        p: ({children}) => <p className="text-slate-700 leading-relaxed max-w-prose mb-6 text-[15px]">{children}</p>,
        ul: ({children}) => <ul className="space-y-3 mb-6 ml-4 list-none">{children}</ul>,
        li: ({children}) => (
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-trust-500 mt-2 mr-3 shrink-0"></span>
                <span className="text-slate-700 leading-relaxed text-[15px]">{children}</span>
            </li>
        ),
        strong: ({children}) => <strong className="font-bold text-slate-900">{children}</strong>,
        blockquote: ({children}) => (
            <blockquote className="pl-6 border-l-4 border-trust-400 bg-trust-50/50 py-3 pr-4 rounded-r-xl italic text-slate-700 mb-6 my-4">
                {children}
            </blockquote>
        )
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-trust-50 via-white to-transparent -z-10"></div>

            <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
                {/* Navigation Toolbar */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
                >
                    <button 
                        onClick={() => navigate('/reports')}
                        className="flex items-center gap-2 text-slate-500 hover:text-trust-600 transition-colors font-medium w-fit"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Records
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:text-trust-600 hover:bg-trust-50 rounded-xl transition-all border border-transparent hover:border-trust-100">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-trust-600 hover:bg-trust-50 rounded-xl transition-all border border-transparent hover:border-trust-100">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-trust-600 font-semibold border border-trust-200 rounded-xl shadow-sm hover:shadow-md hover:border-trust-300 transition-all">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-trust-900 to-trust-800 p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 blur-3xl w-64 h-64 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-sm font-semibold tracking-wide mb-6 border border-white/20">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Verified Analysis
                                </div>
                                <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight">
                                    {report.title || "Clinical AI Insights"}
                                </h1>
                                <p className="text-trust-100 flex items-center gap-2 text-lg">
                                    <Tag className="w-5 h-5" />
                                    {report.type ? report.type.charAt(0).toUpperCase() + report.type.slice(1) : "Consultation Summary"}
                                </p>
                            </div>
                            
                            <div className="text-left md:text-right bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                                <p className="text-trust-200 text-sm font-medium mb-1 uppercase tracking-wider">Date Evaluated</p>
                                <p className="text-xl font-bold font-mono">
                                    {new Date(report.date).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 md:p-12">
                        <div className="prose prose-slate max-w-none">
                            <ReactMarkdown components={customRenderers}>
                                {report.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Disclaimer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center text-sm text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-3 bg-white py-4 px-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                    <HeartPulse className="w-6 h-6 text-trust-400 shrink-0" />
                    <p>This is an AI-generated analysis based on your physical reports. Always consult your primary physician or a specialist for an official diagnosis.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ReportDetail;
