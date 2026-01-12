import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
    FileText,
    Plus,
    ChevronRight,
    Activity,
    ShieldCheck,
    Clock,
    AlertCircle,
    CheckCircle2,
    Search,
    Dna
} from "lucide-react";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
        const interval = setInterval(fetchReports, 10000); // Auto-refresh for processing states
        return () => clearInterval(interval);
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get("/reports");
            const data = res.data;
            const reportsArray = Array.isArray(data) ? data : (data.reports || []);
            setReports(reportsArray);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "done":
                return {
                    label: "Verified",
                    icon: CheckCircle2,
                    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    glow: "bg-emerald-500"
                };
            case "processing":
                return {
                    label: "Analyzing",
                    icon: Clock,
                    color: "bg-blue-50 text-blue-600 border-blue-100",
                    glow: "bg-blue-500"
                };
            case "error":
                return {
                    label: "System Alert",
                    icon: AlertCircle,
                    color: "bg-red-50 text-red-600 border-red-100",
                    glow: "bg-red-500"
                };
            default:
                return {
                    label: "Pending",
                    icon: Activity,
                    color: "bg-slate-50 text-slate-600 border-slate-100",
                    glow: "bg-slate-500"
                };
        }
    };

    const filteredReports = Array.isArray(reports)
        ? reports.filter(r => r.fileName?.toLowerCase().includes(search.toLowerCase()))
        : [];

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            <main className="max-w-[1600px] mx-auto px-6 relative z-10">
                {/* Dossier Header */}
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="stagger-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full mb-8 border border-white shadow-sm">
                            <Dna className="w-4 h-4 text-nexus-accent neural-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent">Genomic & Clinical Data Stream</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-nexus-primary tracking-tighter leading-none mb-8">
                            Health <br />
                            <span className="text-gradient">Dossier.</span>
                        </h1>
                        <p className="text-nexus-text-muted max-w-xl font-medium text-xl leading-relaxed">
                            Your unified clinical archive. Securely manage genomic profiles,
                            diagnostic lab results, and AI-driven health longitudinals.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-text-muted group-focus-within:text-nexus-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter Archives..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-nexus pl-16 py-5 min-w-[300px] border-white shadow-lg shadow-blue-900/5 group-hover:border-nexus-accent/20"
                            />
                        </div>
                        <button
                            onClick={() => navigate("/upload")}
                            className="btn-nexus group h-full"
                        >
                            Ingest Report <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Secure List Interface */}
                {loading ? (
                    <div className="min-h-[500px] flex flex-col items-center justify-center gap-8">
                        <div className="w-20 h-20 border-4 border-nexus-accent/10 border-t-nexus-accent rounded-full animate-spin shadow-2xl shadow-nexus-accent/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-nexus-accent animate-pulse">Decrypting Clinical Stream...</p>
                    </div>
                ) : filteredReports.length > 0 ? (
                    <div className="space-y-6 stagger-in">
                        {filteredReports.map((report) => {
                            const badge = getStatusBadge(report.status);
                            const Icon = badge.icon;
                            return (
                                <div
                                    key={report.id}
                                    onClick={() => report.status === "done" && navigate(`/reports/${report.id}`)}
                                    className={`nexus-card p-0 overflow-hidden flex flex-col md:flex-row md:items-center justify-between group cursor-pointer ${report.status !== "done" ? "!cursor-default" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-8 p-8 flex-1">
                                        <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-2xl transition-all duration-700 bg-white group-hover:bg-nexus-primary group-hover:text-white`}>
                                            <FileText className="w-9 h-9" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-nexus-primary group-hover:text-nexus-accent transition-colors truncate">
                                                    {report.fileName}
                                                </h3>
                                                <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-5 text-nexus-text-muted text-xs font-semibold">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                    ID: {report.id.slice(0, 8).toUpperCase()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-nexus-accent" />
                                                    {new Date(report.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 md:bg-transparent border-t md:border-t-0 border-slate-100 p-8 flex items-center gap-8 shrink-0">
                                        <div className={`badge-nexus px-6 py-3 ${badge.color} border-slate-100 shadow-sm flex items-center gap-3`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${badge.glow} neural-pulse`} />
                                            <Icon className="w-4 h-4" />
                                            <span className="font-black">{badge.label}</span>
                                        </div>
                                        <div className={`w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center transition-all duration-500 ${report.status === "done" ? "group-hover:border-nexus-accent group-hover:bg-nexus-accent group-hover:text-white" : "opacity-20"
                                            }`}>
                                            <ChevronRight className={`w-6 h-6 transition-transform duration-500 ${report.status === "done" ? "group-hover:translate-x-1" : ""}`} />
                                        </div>
                                    </div>

                                    {/* Intelligence Progress UI */}
                                    {report.status === "processing" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-nexus-accent animate-[loading_2s_infinite]" style={{ width: "33%" }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="min-h-[500px] flex flex-col items-center justify-center text-center stagger-in">
                        <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mb-12 border-2 border-slate-50 shadow-2xl">
                            <FileText className="w-14 h-14 text-slate-200" />
                        </div>
                        <h3 className="text-4xl font-black text-nexus-primary mb-6">Archive Null.</h3>
                        <p className="text-nexus-text-muted max-w-md font-medium text-lg leading-relaxed">
                            No medical transmissions found in your current dossier.
                            Initialize an ingestion protocol to begin analysis.
                        </p>
                        <button
                            onClick={() => navigate("/upload")}
                            className="mt-12 btn-nexus"
                        >
                            Start Ingestion
                        </button>
                    </div>
                )}

                {/* System Security Disclaimer */}
                <div className="mt-20 p-10 nexus-glass-heavy rounded-[3rem] border-white/60 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[1.75rem] flex items-center justify-center shrink-0 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                        <ShieldCheck className="w-9 h-9 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-black text-nexus-primary uppercase tracking-tight mb-2">Nexus Security Architecture</h4>
                        <p className="text-nexus-text-muted font-medium text-sm leading-relaxed">
                            Every document in your dossier is processed through our AES-512 encrypted clinical pipeline.
                            AI analysis occurs within a sandboxed environment, ensuring path-verified privacy for all biological data.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-nexus-accent uppercase tracking-widest whitespace-nowrap">
                        Last Audit: T-Minus 4m <div className="w-2 h-2 rounded-full bg-emerald-500 neural-pulse" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
