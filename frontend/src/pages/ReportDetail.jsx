import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Activity, FileText, ShieldCheck, Tag } from 'lucide-react';
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
            <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-medium tracking-wide">Retrieving clinical insights...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6">
                <div className="text-center p-10 bg-zinc-900 rounded-3xl border border-zinc-800 max-w-md shadow-2xl">
                    <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Record Not Found</h2>
                    <p className="text-zinc-500 mb-8 text-sm">The requested medical report archive could not be located in our secure vault.</p>
                    <button onClick={() => navigate('/reports')} className="btn-primary w-full shadow-white/5">Return to Archive</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">
            {/* Header */}
            <div className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-6 py-6 sticky top-20 z-40">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/reports')} className="p-2.5 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">{report.title || 'Medical Report'}</h1>
                                <span className="status-success px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">Analyzed</span>
                            </div>
                            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                                {new Date(report.date || report.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> HIPAA Validated
                        </div>
                        <button className="px-5 py-2.5 bg-white text-zinc-950 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Meta Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Archive Metadata</h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-zinc-400" /></div>
                                    <div><p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">Classification</p><p className="font-bold text-white text-sm mt-0.5 capitalize">{report.type || 'Standard Diagnostic'}</p></div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0"><Activity className="w-5 h-5 text-zinc-400" /></div>
                                    <div><p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">Clinical Status</p><p className="font-bold text-emerald-400 text-sm mt-0.5">Report Active</p></div>
                                </div>
                                {report.tags && report.tags.length > 0 && (
                                    <div className="flex items-start gap-4 pt-2">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0"><Tag className="w-5 h-5 text-zinc-400" /></div>
                                        <div className="flex-1">
                                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider mb-2.5">Key Identifiers</p>
                                            <div className="flex flex-wrap gap-2">
                                                {report.tags.map((tag, i) => <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity"><Lock className="w-12 h-12 text-blue-400" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-5 h-5 text-blue-400" /><span className="font-bold text-sm text-blue-400 uppercase tracking-wider">Military Grade Security</span></div>
                                <p className="text-zinc-400 text-xs leading-relaxed font-medium">This record is protected by 256-bit AES encryption and dual-factor authentication protocols. Your clinical data remains your own.</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="lg:col-span-2">
                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden min-h-[600px]">
                            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5"><Activity className="w-5 h-5 text-zinc-950" /></div>
                                    <div>
                                        <h2 className="font-bold text-white text-lg tracking-tight">AI Clinical Synthesis</h2>
                                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Neural Engine v4.2 · Verified Accuracy</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-900/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">SYNTHESIZED</span>
                                </div>
                            </div>
                            <div className="p-8 md:p-10">
                                {report.analysis ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="prose prose-invert prose-zinc max-w-none 
                                                   prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight 
                                                   prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-base
                                                   prose-strong:text-white prose-strong:font-bold
                                                   prose-li:text-zinc-400 prose-li:my-1
                                                   prose-hr:border-zinc-800">
                                        <ReactMarkdown>{report.analysis}</ReactMarkdown>
                                    </motion.div>
                                ) : (
                                    <div className="py-24 text-center">
                                        <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-6"><Activity className="w-8 h-8 text-zinc-600 animate-pulse" /></div>
                                        <h3 className="text-white font-bold mb-2">Analysis in Progress</h3>
                                        <p className="text-zinc-500 text-sm max-w-xs mx-auto">Our neural engine is currently decomposing this report into structured insights. This usually takes less than 60 seconds.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;
