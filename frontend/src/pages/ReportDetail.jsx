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
            <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading medical record...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <FileText className="w-7 h-7 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Record Not Found</h2>
                    <p className="text-slate-500 mb-6 text-sm">The requested medical record could not be retrieved.</p>
                    <button onClick={() => navigate('/reports')} className="btn-medical-primary w-full">Return to Records</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 pb-16">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-20 z-40">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/reports')} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">{report.title || 'Medical Report'}</h1>
                            <p className="text-sm text-slate-400">{new Date(report.date || report.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" /> AI Verified
                        </div>
                        <button className="btn-medical-secondary py-2 text-sm">
                            <Download className="w-4 h-4" /> Download
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Meta Info Sidebar */}
                    <div className="lg:col-span-1 space-y-5">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Report Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-blue-600" /></div>
                                    <div><p className="text-slate-400 text-xs">Report Name</p><p className="font-semibold text-slate-800">{report.title || 'Lab Report'}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Activity className="w-4 h-4 text-slate-500" /></div>
                                    <div><p className="text-slate-400 text-xs">Report Type</p><p className="font-semibold text-slate-800 capitalize">{report.type || 'Standard Lab'}</p></div>
                                </div>
                                {report.tags && report.tags.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><Tag className="w-4 h-4 text-violet-600" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {report.tags.map((tag, i) => <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-2xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-blue-100" /><span className="font-bold text-sm">HIPAA Protected</span></div>
                            <p className="text-blue-100 text-xs leading-relaxed">This record is encrypted and complies with all HIPAA data privacy regulations.</p>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                                <div>
                                    <h2 className="font-bold text-slate-900">AI Clinical Analysis</h2>
                                    <p className="text-xs text-slate-400">Generated by Synaptic AI Engine · Verified</p>
                                </div>
                            </div>
                            <div className="p-6 md:p-8">
                                {report.analysis ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-800 prose-li:text-slate-600 prose-a:text-blue-600">
                                        <ReactMarkdown>{report.analysis}</ReactMarkdown>
                                    </motion.div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Activity className="w-6 h-6 text-slate-400" /></div>
                                        <p className="text-slate-500 font-medium">Analysis pending or unavailable.</p>
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
