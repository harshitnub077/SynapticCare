import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
    Upload,
    FileText,
    X,
    Activity,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Database,
    CloudRain
} from "lucide-react";

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/"))) {
            setFile(selectedFile);
            setError("");
        } else {
            setError("Invalid Protocol: Only PDF or Image streams are accepted.");
        }
    };

    const onUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("report", file);

        try {
            await api.post("/reports/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess(true);
            setTimeout(() => navigate("/reports"), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Ingestion Failure: System Link Error.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-32 pb-20 mesh-gradient relative">
            <main className="max-w-[1200px] mx-auto px-6 relative z-10">

                {/* Navigation Gateway */}
                <button
                    onClick={() => navigate("/reports")}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent mb-12 hover:opacity-70 transition-all duration-500"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
                    Back to Archive
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Contextual Narrative */}
                    <div className="stagger-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur rounded-full mb-8 border border-white shadow-sm">
                            <Database className="w-4 h-4 text-nexus-accent neural-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-accent">Secure Ingestion Protocol</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-nexus-primary tracking-tighter leading-none mb-8">
                            Data <br />
                            <span className="text-gradient">Ingestion.</span>
                        </h1>
                        <p className="text-nexus-text-muted max-w-md font-medium text-xl leading-relaxed mb-10">
                            Synchronize your clinical data with our neural engine.
                            Upload lab results, imaging, or prescriptions for deep-link analysis.
                        </p>

                        <div className="space-y-6">
                            {[
                                { label: "OCR Post-Processing", icon: Activity },
                                { label: "AI Diagnostic Verification", icon: ShieldCheck },
                                { label: "Encrypted Dossier Storage", icon: CheckCircle2 }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 p-5 bg-white/40 rounded-3xl border border-white/60">
                                    <div className="w-12 h-12 bg-nexus-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-nexus-primary uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ingestion Terminal */}
                    <div className="nexus-glass-heavy p-10 md:p-16 rounded-[4rem] border-white/80 shadow-[0_50px_100px_rgba(0,0,0,0.1)] stagger-in delay-200">
                        {!success ? (
                            <>
                                <div
                                    className={`relative group cursor-pointer border-4 border-dashed rounded-[3rem] p-16 transition-all duration-700 flex flex-col items-center justify-center text-center ${file ? "border-nexus-accent bg-blue-50/30" : "border-slate-100 hover:border-nexus-accent/30 hover:bg-slate-50/50"
                                        }`}
                                >
                                    <input
                                        type="file"
                                        onChange={onFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                        accept=".pdf,image/*"
                                    />

                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-transform duration-700 group-hover:scale-110">
                                        {file ? (
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                        ) : (
                                            <CloudRain className="w-12 h-12 text-nexus-accent animate-bounce" />
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-nexus-primary mb-3">
                                        {file ? file.name : "Target Pulse."}
                                    </h3>
                                    <p className="text-nexus-text-muted font-medium px-8 leading-relaxed mb-0">
                                        {file
                                            ? `(${(file.size / 1024 / 1024).toFixed(2)} MB Payload Synchronized)`
                                            : "Drag clinical stream here or click to browse system archives."
                                        }
                                    </p>

                                    {!file && (
                                        <p className="mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            PDF, JPEG, or PNG Max 10MB
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 text-sm font-bold slide-in-from-top-4 animate-in">
                                        <AlertCircle className="w-6 h-6 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="mt-12 flex flex-col gap-5">
                                    <button
                                        onClick={onUpload}
                                        disabled={!file || uploading}
                                        className="btn-nexus py-6 text-xs tracking-[0.3em] relative overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-nexus-accent/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                        <div className="flex items-center justify-center gap-3 relative z-10">
                                            {uploading ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                                    <span>Ingesting Stream...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Initialize Ingestion</span>
                                                    <Upload className="w-5 h-5 group-hover/btn:translate-y-[-2px] transition-transform duration-500" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => navigate("/reports")}
                                        className="btn-nexus-outline py-6"
                                    >
                                        Terminate
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 flex flex-col items-center animate-in zoom-in-95 duration-700">
                                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30 overflow-hidden relative">
                                    <CheckCircle2 className="w-12 h-12 relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 animate-ping" />
                                </div>
                                <h2 className="text-4xl font-black text-nexus-primary mb-6">Ingestion Active.</h2>
                                <p className="text-nexus-text-muted text-lg font-medium leading-relaxed max-w-sm mb-12">
                                    Communication link optimized. Your clinical dossier is now being updated with the new transmission.
                                </p>
                                <div className="flex items-center gap-3 text-[10px] font-black text-nexus-accent uppercase tracking-[0.5em] animate-pulse">
                                    Redirecting to Archive
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Encryption Status */}
                <div className="fixed bottom-10 left-10 hidden xl:flex items-center gap-4 text-[10px] font-black text-nexus-text-muted uppercase tracking-[0.3em] opacity-40">
                    <ShieldCheck className="w-5 h-5" />
                    End-to-End Secure Channel Active
                </div>
            </main>
        </div>
    );
};

export default UploadReport;
