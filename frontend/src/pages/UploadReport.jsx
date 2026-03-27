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
        <div className="w-full min-h-screen bg-slate-50 pb-16">
            <div className="bg-white border-b border-slate-200 px-6 py-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-semibold mb-4">
                        <BrainCircuit className="w-4 h-4" /> AI-Powered Report Analysis
                    </div>
                    <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Upload Medical Reports</h1>
                    <p className="text-slate-500 text-lg">Upload your lab tests, scan reports, or clinical documents for instant AI-powered analysis and health insights.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 pt-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">

                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl w-fit mb-8">
                        <ShieldCheck className="w-4 h-4" /> HIPAA Compliant · End-to-End Encrypted
                    </div>

                    <FileUpload onFileSelect={setFile} />

                    <AnimatePresence>
                        {uploading && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-8">
                                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2.5">
                                    <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600 animate-pulse" />Encrypting & sending...</span>
                                    <span className="text-blue-600 font-bold">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: progress + "%" }} className="bg-gradient-to-r from-blue-500 to-teal-500 h-full rounded-full shadow-sm" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {message && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${isSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                    {isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                                </div>
                                {displayMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-8 border-t border-slate-100">
                        <button onClick={handleUpload} disabled={!file || uploading}
                            className="btn-medical-primary flex-1 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                            {uploading ? "Analyzing..." : "Start AI Analysis"}
                        </button>
                        <button onClick={() => navigate("/reports")} className="btn-medical-secondary py-3.5 px-8" disabled={uploading}>
                            View My Records
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        {["PDF, JPG, PNG", "Up to 10 MB", "256-bit AES"].map((f, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500">{["Supported Formats", "Max File Size", "Encryption"][i]}</p>
                                <p className="text-sm font-bold text-slate-800 mt-1">{f}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UploadReport;
