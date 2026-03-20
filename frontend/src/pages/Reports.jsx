import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, AlertCircle, CheckCircle, Loader, Plus, Calendar, ChevronRight, AlertTriangle, Trash2, Search } from "lucide-react";
import api from "../api/axiosConfig";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
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
            setReports(response.data.reports || []);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else {
                setError("Failed to load reports");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this report from your permanent record?")) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(reports.filter(r => r.id !== id));
        } catch (err) {
            alert("Failed to delete report.");
        }
    };

    const filteredReports = reports.filter(r => r.filename.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader className="w-8 h-8 animate-spin text-medical-500" />
                Retrieving your clinical records...
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
                    <p className="text-slate-500">View and manage your diagnostic reports</p>
                </div>
                <button
                    onClick={() => navigate("/upload")}
                    className="btn-medical-primary whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" /> Add Record
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search records by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 outline-none transition-all"
                        />
                    </div>
                    <div className="text-sm text-slate-500 w-full sm:w-auto text-left sm:text-right">
                        Showing {filteredReports.length} record(s)
                    </div>
                </div>

                {error && (
                    <div className="m-4 bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {filteredReports.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No records found</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            {reports.length === 0 
                                ? "Your digital health vault is empty. Upload your first medical report to unlock AI insights."
                                : "No records match your search query."}
                        </p>
                        {reports.length === 0 && (
                            <button
                                onClick={() => navigate("/upload")}
                                className="btn-medical-secondary mx-auto"
                            >
                                <Plus className="w-4 h-4" /> Upload Now
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/reports/${report.id}`)}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                                    <div className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                                        report.status === 'error' ? 'bg-rose-50 text-rose-600' :
                                        report.flags?.abnormalities?.length > 0 ? 'bg-amber-50 text-amber-600' :
                                        'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                    }`}>
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-medical-600 transition-colors truncate">
                                            {report.filename}
                                        </h3>
                                        <div className="flex items-center text-sm text-slate-500 mt-1 gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                                    <div className="flex items-center gap-3">
                                        {report.status === "processing" ? (
                                            <span className="badge-medical bg-amber-50 text-amber-700 border border-amber-200/50 flex items-center gap-1.5">
                                                <Loader className="w-3 h-3 animate-spin inline" /> Processing
                                            </span>
                                        ) : report.status === "error" ? (
                                            <span className="badge-medical status-error flex items-center gap-1.5">
                                                <AlertCircle className="w-3 h-3" /> Error
                                            </span>
                                        ) : report.flags?.abnormalities?.length > 0 ? (
                                            <span className="badge-medical status-warning flex items-center gap-1.5">
                                                <AlertTriangle className="w-3 h-3" /> {report.flags.abnormalities.length} Flags
                                            </span>
                                        ) : (
                                            <span className="badge-medical status-success flex items-center gap-1.5">
                                                <CheckCircle className="w-3 h-3" /> Normal
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <button
                                            onClick={(e) => handleDelete(report.id, e)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-medical-50 group-hover:text-medical-600 transition-colors">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
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
