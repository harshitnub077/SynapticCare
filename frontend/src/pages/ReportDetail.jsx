import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, Loader, FileText, Activity, HeartPulse, Sparkles, Beaker } from "lucide-react";
import api from "../api/axiosConfig";

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const response = await api.get(`/reports/${id}`);
            setReport(response.data.report);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else {
                setError("Failed to load clinical report.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader className="w-8 h-8 animate-spin text-medical-500" />
                    Analyzing medical document...
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="bg-rose-50 text-rose-800 p-6 rounded-2xl border border-rose-200 max-w-md text-center">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-rose-500" />
                    <h3 className="text-lg font-bold mb-2">Notice</h3>
                    <p>{error || "Report not found or has been removed."}</p>
                    <button onClick={() => navigate("/reports")} className="mt-6 btn-medical-secondary w-full">Go Back</button>
                </div>
            </div>
        );
    }

    const abnormalities = report.flags?.abnormalities || [];
    const aiInsights = report.flags?.aiInsights;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate("/reports")}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Records
            </button>

            {/* Header Document Summary */}
            <div className="medical-card border-none bg-gradient-to-br from-slate-900 to-medical-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-medical-800 opacity-50">
                    <FileText className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 flex items-start gap-5">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1 truncate max-w-lg">{report.filename}</h1>
                        <p className="text-medical-200/80 text-sm flex items-center gap-2">
                            Uploaded on {new Date(report.uploadedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="relative z-10 self-start sm:self-auto">
                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${
                        report.status === "done" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : 
                        report.status === "processing" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : 
                        "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    }`}>
                        {report.status === "done" && <CheckCircle className="w-4 h-4 mr-2 inline" />}
                        {report.status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Processing State */}
            {report.status === "processing" && (
                <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Loader className="w-8 h-8 text-amber-600 animate-spin" />
                            <div>
                                <h3 className="font-bold text-amber-900 text-lg">AI Analysis in Progress</h3>
                                <p className="text-amber-700 text-sm mt-1">Our clinical AI is extracting and analyzing parameters...</p>
                            </div>
                        </div>
                        <button onClick={fetchReport} className="btn-medical-secondary bg-white">Refresh Status</button>
                    </div>
                </div>
            )}

            {report.status === "error" && (
                <div className="bg-rose-50 rounded-2xl p-6 sm:p-8 border border-rose-200 flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                    <div>
                        <h3 className="font-bold text-rose-900 text-lg">Analysis Failed</h3>
                        <p className="text-rose-700 mt-1">{report.extractedText || "Image clarity was too low or file format unsupported."}</p>
                    </div>
                </div>
            )}

            {/* AI Insights Section */}
            {aiInsights && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Insights Main */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="medical-card">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <Sparkles className="w-6 h-6 text-medical-600" />
                                <h2 className="text-xl font-bold text-slate-800">Clinical Summary</h2>
                            </div>
                            
                            <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-line text-[15px]">
                                {aiInsights.summary}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {aiInsights.concerns?.length > 0 && (
                                    <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
                                        <h3 className="font-semibold text-rose-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" /> Areas of Concern
                                        </h3>
                                        <ul className="space-y-2 text-sm text-rose-800/80 list-disc ml-5">
                                            {aiInsights.concerns.map((i,x) => <li key={x}>{i}</li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                {aiInsights.recommendations?.length > 0 && (
                                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                                        <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                                            <HeartPulse className="w-4 h-4" /> Next Steps
                                        </h3>
                                        <ul className="space-y-2 text-sm text-emerald-800/80 list-disc ml-5">
                                            {aiInsights.recommendations.map((i,x) => <li key={x}>{i}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Abnormalities List */}
                        {abnormalities.length > 0 && (
                            <div className="medical-card">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <Activity className="w-6 h-6 text-amber-500" />
                                        Detected Abnormalities
                                    </h2>
                                    <span className="badge-medical status-warning">{abnormalities.length} Flags found</span>
                                </div>
                                
                                <div className="space-y-4">
                                    {abnormalities.map((flag, idx) => (
                                        <div key={idx} className={`p-5 rounded-xl border ${flag.status === 'high' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'} flex items-start gap-4`}>
                                            <div className={`p-2 rounded-lg ${flag.status === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 capitalize text-lg">{flag.test}</h4>
                                                    <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${flag.status === 'high' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}`}>
                                                        {flag.value} {flag.unit}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 mb-3">Target Range: <span className="text-slate-800">{flag.normalRange}</span></p>
                                                <p className="text-sm text-slate-700 bg-white/50 p-3 rounded-lg border border-slate-200/50 leading-relaxed italic">"{flag.message}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Infobox */}
                    <div className="space-y-6">
                        {/* Urgency */}
                        {aiInsights.urgency && (
                            <div className={`medical-card text-center ${aiInsights.urgency === 'high' ? 'border-t-4 border-t-rose-500' : aiInsights.urgency === 'medium' ? 'border-t-4 border-t-amber-500' : 'border-t-4 border-t-emerald-500'}`}>
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Priority Level</h3>
                                <p className={`text-2xl font-bold ${aiInsights.urgency === 'high' ? 'text-rose-600' : aiInsights.urgency === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {aiInsights.urgency === 'high' ? 'Seek Medical Attention' : aiInsights.urgency === 'medium' ? 'Schedule Review' : 'Routine Status'}
                                </p>
                            </div>
                        )}

                        <div className="medical-card bg-slate-50 border-none">
                            <h3 className="font-semibold text-slate-900 mb-2">Disclaimer</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {aiInsights.disclaimer || "This analysis is generated by AI intended for informational purposes only. It is not professional medical advice, diagnosis, or treatment. Always seek the advice of your physician."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Extracted Data Table */}
            {report.parsedData && report.parsedData.length > 0 && (
                <div className="medical-card p-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <Beaker className="w-5 h-5 text-slate-500" />
                        <h2 className="text-lg font-bold text-slate-800">Raw Extracted Values</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Metric / Test Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Identified Value</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit of Measure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report.parsedData.map((test, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 capitalize">{test.test}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{test.value}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{test.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportDetail;
