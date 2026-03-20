import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    TrendingUp,
    FileText,
    AlertCircle,
    Calendar,
    BarChart3,
    Heart
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import api from "../api/axiosConfig";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        abnormalReports: 0,
        recentReports: [],
    });
    const [trendData, setTrendData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const reportsResponse = await api.get("/reports?limit=5");

            const reports = reportsResponse.data.reports || [];
            const abnormal = reports.filter(r => r.flags?.abnormalities?.length > 0);

            setStats({
                totalReports: reportsResponse.data.pagination?.total || 0,
                abnormalReports: abnormal.length,
                recentReports: reports,
            });

            // Mock trend data (in real app, this would come from backend)
            setTrendData([
                { month: "Jan", hemoglobin: 13.5, wbc: 7000, glucose: 95 },
                { month: "Feb", hemoglobin: 13.2, wbc: 7200, glucose: 92 },
                { month: "Mar", hemoglobin: 13.8, wbc: 6800, glucose: 98 },
                { month: "Apr", hemoglobin: 14.1, wbc: 7100, glucose: 90 },
                { month: "May", hemoglobin: 13.9, wbc: 7300, glucose: 94 },
            ]);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Health Analytics</h1>
                <p className="text-slate-500">Track and monitor your key vital trends over time.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="medical-card flex items-center gap-5 border-l-4 border-l-medical-500">
                    <div className="w-14 h-14 rounded-full bg-medical-50 flex items-center justify-center shrink-0">
                        <FileText className="w-7 h-7 text-medical-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Reports Processed</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalReports}</p>
                    </div>
                </div>

                <div className="medical-card flex items-center gap-5 border-l-4 border-l-amber-500">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Flags Detected</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.abnormalReports}</p>
                    </div>
                </div>

                <div className="medical-card flex items-center gap-5 border-l-4 border-l-emerald-500">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Heart className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Overall Status</p>
                        <p className="text-2xl font-bold text-emerald-600">{stats.abnormalReports > 0 ? 'Needs Review' : 'Optimal'}</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="medical-card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-medical-500" />
                            Biomarker Trends
                        </h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="hemoglobin" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Hemoglobin (g/dL)" />
                                <Line type="monotone" dataKey="glucose" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Glucose (mg/dL)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="medical-card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-amber-500" />
                            WBC Count Overview
                        </h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar dataKey="wbc" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="WBC Content" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Reports List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-medical-600" />
                        Recently Processed Reports
                    </h3>
                    <button 
                        onClick={() => navigate('/reports')}
                        className="text-sm font-medium text-medical-600 hover:text-medical-700"
                    >
                        View all →
                    </button>
                </div>
                
                <div className="divide-y divide-slate-100">
                    {stats.recentReports.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">No reports yet.</p>
                            <button 
                                onClick={() => navigate('/upload')}
                                className="mt-4 text-sm text-medical-600 font-medium hover:underline"
                            >
                                Upload your first report
                            </button>
                        </div>
                    ) : (
                        stats.recentReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/reports/${report.id}`)}
                                className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-medical-50 text-medical-600 flex items-center justify-center group-hover:bg-medical-100 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{report.filename}</p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {report.flags?.abnormalities?.length > 0 ? (
                                        <span className="badge-medical status-warning">
                                            {report.flags.abnormalities.length} Flags
                                        </span>
                                    ) : (
                                        <span className="badge-medical status-success hidden sm:inline-flex">
                                            Normal
                                        </span>
                                    )}
                                    <div className="text-slate-400 group-hover:text-medical-600 transition-colors">
                                        &rarr;
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
