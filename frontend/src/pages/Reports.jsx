import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, AlertCircle, CheckCircle, Loader, Plus, Calendar, ChevronRight, AlertTriangle, Trash2 } from "lucide-react";
import api from "../api/axiosConfig";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        // Auto-refresh every 3 seconds if any report is processing
        const interval = setInterval(() => {
            const hasProcessing = reports.some(r => r.status === "processing");
            if (hasProcessing) {
                fetchReports();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [reports]);

    const fetchReports = async () => {
        try {
            const response = await api.get("/reports");
            setReports(response.data.reports);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else {
                setError("Failed to load reports");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "done":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "processing":
                return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-slate-400" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "done":
                return "Analyzed";
            case "processing":
                return "Processing...";
            case "error":
                return "Error";
            default:
                return "Uploaded";
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove from state
            setReports(reports.filter(r => r.id !== id));
        } catch (err) {
            console.error("Failed to delete report:", err);
            alert("Failed to delete report.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading reports...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">My Medical Reports</h1>
                    <button
                        onClick={() => navigate("/upload")}
                        className="btn-medical-primary"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Upload New Report
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                {reports.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No reports yet</h3>
                        <p className="text-slate-500 mb-6">Upload your first medical report to get AI insights.</p>
                        <button
                            onClick={() => navigate("/upload")}
                            className="btn-medical-primary mx-auto"
                        >
                            Upload Report
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/reports/${report.id}`)}
                                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {report.filename}
                                            </h3>
                                            <div className="flex items-center text-sm text-slate-500 mt-1">
                                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                                {new Date(report.uploadedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {report.status === "processing" ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Processing...
                                            </span>
                                        ) : report.status === "error" ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Error
                                            </span>
                                        ) : report.flags?.abnormalities?.length > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Attention Needed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Normal
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(report.id, e)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Report"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
