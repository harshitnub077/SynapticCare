import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "../components/FileUpload";
import api from "../api/axiosConfig";
import { ShieldCheck, BrainCircuit, Activity, CheckCircle, AlertCircle } from "lucide-react";

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) { setMessage("Please select a file first."); return; }
        setUploading(true);
        setProgress(0);
        setMessage("");
        const formData = new FormData();
        formData.append("file", file);
        try {
            await api.post("/reports", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                },
            });
            setMessage("success:Report uploaded! Starting AI analysis...");
            setTimeout(() => navigate("/reports"), 2000);
        } catch (error) {
            let err = "Failed to upload report. Please try again.";
            if (error.response) err = error.response.data?.message || error.response.data?.error || err;
            else if (error.request) err = "Network issue. Please check your connection.";
            setMessage("error:" + err);
        } finally {
            if (!message.startsWith("success")) setUploading(false);
        }
    };

    const isSuccess = message.startsWith("success:");
    const isError = message.startsWith("error:");
    const displayMsg = message.replace(/^(success:|error:)/, '');

    return (
        <div className="w-full min-h-screen bg-zinc-950 pb-20">
            {/* Header Overlay */}
            <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden py-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
                    >
                        <BrainCircuit className="w-4 h-4 text-white" /> Intelligence Processing
                    </motion.div>
                    <h1 className="text-5xl font-bold font-display text-white mb-6 tracking-tight leading-tight">Upload Clinical Reports</h1>
                    <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">Securely upload your diagnostic records for instant AI-driven biomarker extraction and medical synthesis.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 pt-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 rounded-[32px] border border-zinc-800 shadow-2xl p-10 md:p-14 relative overflow-hidden"
                >
                    {/* Background Decorative Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />

                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-5 py-3 rounded-2xl w-fit mb-12 tracking-[0.1em] uppercase">
                        <ShieldCheck className="w-4 h-4" /> HIPAA Certified · End-to-End Encrypted
                    </div>

                    <FileUpload onFileSelect={setFile} />

                    <AnimatePresence>
                        {uploading && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-12">
                                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">
                                    <span className="flex items-center gap-2.5"><Activity className="w-4 h-4 text-blue-500 animate-pulse" />Ingesting Diagnostic Stream...</span>
                                    <span className="text-white">{progress}%</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2.5 border border-zinc-700 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: progress + "%" }} className="bg-white h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {message && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className={`mt-10 p-6 rounded-2xl flex items-center gap-4 text-sm font-semibold border ${isSuccess ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-red-950/40 text-red-400 border-red-900/50'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
                                    {isSuccess ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="font-bold mb-0.5">{isSuccess ? 'Upload Successful' : 'Upload Failed'}</p>
                                    <p className="text-zinc-500 text-xs font-medium">{displayMsg}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 flex flex-col sm:flex-row gap-5 pt-12 border-t border-zinc-800">
                        <button onClick={handleUpload} disabled={!file || uploading}
                            className="btn-primary flex-1 py-4.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-white/5 uppercase tracking-[0.15em]">
                            {uploading ? "Analyzing Report..." : "Begin AI Synthesis"}
                        </button>
                        <button onClick={() => navigate("/reports")} className="px-10 py-4.5 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-2xl font-bold text-sm hover:text-white hover:border-zinc-500 transition-all uppercase tracking-[0.15em]" disabled={uploading}>
                            View Archive
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            { label: "Supported", val: "PDF, JPG, DICOM", icon: FileText },
                            { label: "Bandwidth", val: "Up to 15MB", icon: Activity },
                            { label: "Storage", val: "AES-256 Vault", icon: Lock }
                        ].map((f, i) => (
                            <div key={i} className="p-5 bg-zinc-950/40 rounded-2xl border border-zinc-800 text-center flex flex-col items-center gap-1">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">{f.label}</p>
                                <p className="text-xs font-bold text-zinc-300 mt-1">{f.val}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UploadReport;
