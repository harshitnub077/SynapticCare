import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "../components/FileUpload";
import api from "../api/axiosConfig";
import { ShieldCheck, BrainCircuit, Activity } from "lucide-react";

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first");
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/reports", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });

            setMessage("Report uploaded successfully. Initializing Neural Analysis...");
            setTimeout(() => {
                navigate("/reports");
            }, 2000);
        } catch (error) {
            console.error("Upload error:", error);
            let errorMessage = "Failed to upload report securely";
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            } else if (error.request) {
                errorMessage = "Network issue. Ensure you have stable connectivity.";
            } else {
                errorMessage = error.message || errorMessage;
            }
            setMessage(errorMessage);
        } finally {
            if(!message.includes("success")) setUploading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* Header Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-trade-50 via-white to-medical-50 -z-10"></div>

            <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-50 text-trust-600 text-sm font-semibold tracking-wide mb-6 shadow-sm border border-trust-100">
                        <BrainCircuit className="w-4 h-4" /> Powered by Synaptic AI Engine
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Upload Medical <span className="text-trust-600">Records</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Securely upload your physical tests or digital health records for deep, clinical-grade AI parsing and anomaly detection.
                    </p>
                </motion.div>

                {/* Upload Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden"
                >
                    {/* Security Badge */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit mb-8 border border-emerald-100">
                        <ShieldCheck className="w-4 h-4" /> HIPAA Compliant Encryption Active
                    </div>

                    <FileUpload onFileSelect={setFile} />

                    {/* Progress Bar */}
                    <AnimatePresence>
                        {uploading && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-3">
                                    <span className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-trust-500 animate-pulse" /> 
                                        Encrypting & Uploading Matrix...
                                    </span>
                                    <span className="text-trust-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: progress + "%" }}
                                        className="bg-gradient-to-r from-trust-500 to-medical-400 h-full rounded-full shadow-[0_0_10px_rgb(59,130,246,0.5)]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Feedback Messages */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mt-6 p-4 rounded-2xl border font-medium flex items-center gap-3 ${
                                    message.includes("success")
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : "bg-rose-50 text-rose-800 border-rose-200"
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.includes("success") ? "bg-emerald-200" : "bg-rose-200"}`}>
                                    {message.includes("success") ? <ShieldCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                </div>
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Block */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="btn-medical-primary flex-1 py-4 text-base disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none"
                        >
                            {uploading ? "Transmitting..." : "Initiate AI Scan"}
                        </button>
                        <button
                            onClick={() => navigate("/reports")}
                            className="btn-medical-secondary py-4 w-full sm:w-auto px-8"
                            disabled={uploading}
                        >
                            View Pass Archive
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default UploadReport;
