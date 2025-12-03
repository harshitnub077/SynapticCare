import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, AlertCircle, CheckCircle, Loader } from "lucide-react";
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
                        <p className="text-slate-600 mt-1">View and manage your medical reports</p>
                    </div>
                    <button
                        onClick={() => navigate("/upload")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                        Upload New Report
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {reports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">
                            No reports yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Upload your first medical report to get started
                        </p>
                        <button
                            onClick={() => navigate("/upload")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
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
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-slate-100"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <FileText className="h-10 w-10 text-blue-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-slate-900 truncate">
                                                {report.filename}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Uploaded {new Date(report.uploadedAt).toLocaleDateString()}
                                            </p>
                                            {report.flags?.abnormalities?.length > 0 && (
                                                <div className="flex items-center mt-2 text-sm text-amber-600">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {report.flags.abnormalities.length} abnormality(ies) detected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        {getStatusIcon(report.status)}
                                        <span className="text-sm font-medium text-slate-700">
                                            {getStatusText(report.status)}
                                        </span>
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
