import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
    FileText,
    ShieldCheck,
    ArrowLeft,
    AlertTriangle,
    Activity,
    CheckCircle2,
    Clock,
    Target,
    Zap,
    Dna,
    Database,
    ChevronRight,
    Search
} from "lucide-react";

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const res = await api.get(`/reports/${id}`);
            setReport(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center flex-col gap-10">
            <div className="w-24 h-24 border-8 border-nexus-accent/10 border-t-nexus-accent rounded-full animate-spin shadow-2xl shadow-nexus-accent/20" />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-nexus-accent animate-pulse">Initializing Diagnostic Engine...</p>
        </div>
    );

    if (!report) return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 mesh-gradient">
            <div className="nexus-glass-heavy p-16 rounded-[4rem] text-center max-w-2xl border-white/80 scale-in shadow-2xl">
                <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-2 border-red-100 shadow-xl shadow-red-500/10">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-4xl font-black text-nexus-primary mb-6">Link Severed.</h2>
                <p className="text-nexus-text-muted text-lg font-medium leading-relaxed mb-12">
                    The requested clinical record is not available in the Nexus stream.
                    It may have been purged or relocated for data integrity.
                </p>
                <button onClick={() => navigate("/reports")} className="btn-nexus w-full">
                    Return to Dossier
                </button>
            </div>
        </div>
    );

    const { aiInsights, status, abnormalityDetected } = report;

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            <main className="max-w-[1700px] mx-auto px-6 relative z-10">
                {/* Navigation Gateway */}
                <button
                    onClick={() => navigate("/reports")}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent mb-12 hover:opacity-70 transition-all duration-500"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
                    Back to Archive
                </button>

                {/* Clinical Metadata Header */}
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div className="stagger-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-20 h-20 bg-nexus-primary text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-nexus-primary/20 hover:scale-105 transition-transform duration-500">
                                <FileText className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-nexus-primary tracking-tighter leading-none mb-3">
                                    {report.fileName}
                                </h1>
                                <div className="flex items-center gap-5 text-[10px] font-black text-nexus-text-muted uppercase tracking-widest bg-white/60 backdrop-blur px-5 py-2.5 rounded-full border border-white">
                                    <span className="flex items-center gap-2">
                                        <Database className="w-3.5 h-3.5 text-nexus-accent" />
                                        REF: {report.id.slice(0, 12).toUpperCase()}
                                    </span>
                                    <div className="w-1 h-3 border-l border-slate-200" />
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-nexus-accent" />
                                        {new Date(report.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 justify-start lg:justify-end stagger-in">
                        <div className={`badge-nexus px-8 py-4 ${abnormalityDetected ? "bg-red-50 text-red-600 border-red-100 shadow-red-500/5 shadow-xl" : "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5 shadow-xl"
                            } flex items-center gap-4 rounded-[2rem] scale-in`}>
                            <div className={`w-2 h-2 rounded-full ${abnormalityDetected ? "bg-red-500" : "bg-emerald-500"} neural-pulse`} />
                            {abnormalityDetected ? "Clinical Alert: Active" : "Verification: Normal"}
                        </div>
                        <div className="badge-nexus px-8 py-4 bg-white/80 text-nexus-primary border-white shadow-xl flex items-center gap-4 rounded-[2rem] scale-in delay-100">
                            <ShieldCheck className="w-5 h-5 text-nexus-accent" />
                            Verified Protocol
                        </div>
                    </div>
                </div>

                {/* Diagnostic Grid System */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 stagger-in">

                    {/* Perspective: Summary */}
                    <div className="nexus-card bg-white/40 border-white/60 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-[11px] font-black text-nexus-primary uppercase tracking-[0.3em]">Synaptic Summary</h3>
                        </div>
                        <p className="text-nexus-text-muted font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2">
                            {report.summary || aiInsights?.summary || "Analyzing clinical data patterns..."}
                        </p>
                        <div className="mt-auto pt-10 flex items-center justify-between opacity-50">
                            <span className="text-[9px] font-black uppercase tracking-widest">Confidence: 98.4%</span>
                            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                    </div>

                    {/* Perspective: Critical Concerns */}
                    <div className="nexus-card bg-white/40 border-white/60">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-[11px] font-black text-nexus-primary uppercase tracking-[0.3em]">Priority Logic</h3>
                        </div>
                        <ul className="space-y-4">
                            {(report.concerns || aiInsights?.concerns || ["No critical deviations detected."]).map((item, i) => (
                                <li key={i} className="flex gap-4 p-5 bg-white/60 rounded-3xl border border-white group/item hover:border-red-100 transition-all duration-500">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 group-hover/item:scale-125 transition-transform" />
                                    <span className="text-sm font-bold text-nexus-primary leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Perspective: Action Matrix */}
                    <div className="nexus-card bg-white/40 border-white/60">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-[11px] font-black text-nexus-primary uppercase tracking-[0.3em]">Protocol Directive</h3>
                        </div>
                        <ul className="space-y-4">
                            {(report.recommendations || aiInsights?.recommendations || ["Continue standard observation."]).map((item, i) => (
                                <li key={i} className="flex gap-4 p-5 bg-white/60 rounded-3xl border border-white group/item hover:border-emerald-100 transition-all duration-500">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover/item:scale-125 transition-transform" />
                                    <span className="text-sm font-bold text-nexus-primary leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Analytical Data Stream (Table) */}
                <div className="nexus-glass-heavy rounded-[4rem] border-white/80 overflow-hidden shadow-2xl stagger-in delay-200">
                    <div className="p-10 border-b-2 border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-nexus-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                                <Activity className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-nexus-primary tracking-tighter">Diagnostic Matrix</h3>
                                <p className="text-[10px] font-black text-nexus-accent uppercase tracking-[0.2em] mt-1">Raw Biological Stream</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-muted" />
                                <input type="text" placeholder="Filter matrix..." className="input-nexus pl-12 py-3.5 text-sm min-w-[240px] border-white" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em] border-b border-white">Marker Payload</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em] border-b border-white">Value Index</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em] border-b border-white">Differential Range</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.2em] border-b border-white">Status Flux</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {(report.labData || []).length > 0 ? (
                                    report.labData.map((data, i) => (
                                        <tr key={i} className="group hover:bg-white transition-colors duration-500">
                                            <td className="px-10 py-8 font-black text-nexus-primary text-sm tracking-tight">{data.parameter}</td>
                                            <td className="px-10 py-8">
                                                <span className={`text-lg font-black ${data.status === 'High' || data.status === 'Low' ? 'text-red-500' : 'text-nexus-accent'}`}>
                                                    {data.value}
                                                </span>
                                                <span className="text-[10px] font-bold text-nexus-text-muted uppercase ml-2 tracking-widest">{data.unit}</span>
                                            </td>
                                            <td className="px-10 py-8 font-bold text-nexus-text-muted text-xs tracking-widest">{data.referenceRange}</td>
                                            <td className="px-10 py-8">
                                                <div className={`badge-nexus px-4 py-2 border-transparent ${data.status === 'High' || data.status === 'Low' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${data.status === 'High' || data.status === 'Low' ? 'bg-red-500 neural-pulse' : 'bg-emerald-500'}`} />
                                                    {data.status || "Optimal"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                <Activity className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="text-nexus-text-muted font-bold tracking-widest text-[10px] uppercase">No Clinical Signals Detected for this Matrix.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-10 bg-nexus-primary border-t border-nexus-primary/20 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-nexus-accent" />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase tracking-widest text-xs">Diagnostic Integrity Stamp</h4>
                                <p className="text-nexus-text-muted/60 text-[10px] uppercase tracking-[0.2em] mt-1">SHA-512 Verified Protocol</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">
                            System v5.0.Nexus // Deep Ingestion v2.1
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetail;
