import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import api from "../api/axiosConfig";

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
            const token = localStorage.getItem("token");
            const response = await api.post("/reports", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });

            setMessage("Report uploaded successfully! Processing...");
            setTimeout(() => {
                navigate("/reports");
            }, 2000);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage(error.response?.data?.message || "Failed to upload report");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Upload Medical Report
                    </h1>
                    <p className="text-slate-600 mb-8">
                        Upload your medical report (PDF or image) for AI-powered analysis
                    </p>

                    <FileUpload onFileSelect={setFile} />

                    {uploading && (
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {message && (
                        <div
                            className={`mt-6 p-4 rounded-md ${message.includes("success")
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {uploading ? "Uploading..." : "Upload & Analyze"}
                        </button>
                        <button
                            onClick={() => navigate("/reports")}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadReport;
