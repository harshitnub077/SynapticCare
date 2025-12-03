import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    TrendingUp,
    FileText,
    AlertCircle,
    Calendar,
    BarChart3
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
            const token = localStorage.getItem("token");
            const reportsResponse = await api.get("/reports?limit=5", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const reports = reportsResponse.data.reports;
            const abnormal = reports.filter(r => r.flags?.abnormalities?.length > 0);

            setStats({
                totalReports: reportsResponse.data.pagination.total,
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
        <div className="min-h-screen gradient-medical py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Health Dashboard</h1>
                    <p className="text-slate-600">Overview of your health metrics and reports</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="medical-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Reports</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.totalReports}</p>
                            </div>
                            <div className="medical-icon">
                                <FileText className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="medical-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Flagged Reports</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.abnormalReports}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="medical-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Health Score</p>
                                <p className="text-3xl font-bold text-green-600">Good</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                                <Activity className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Trend Chart */}
                    <div className="chart-container">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                            Health Trends
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="hemoglobin"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="glucose"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-container">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                            Lab Values Overview
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="wbc" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="medical-card">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Recent Reports
                    </h3>
                    {stats.recentReports.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">No reports yet. Upload your first report to get started!</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentReports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => navigate(`/reports/${report.id}`)}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <FileText className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-slate-900">{report.filename}</p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(report.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {report.flags?.abnormalities?.length > 0 && (
                                        <span className="badge-medical status-warning">
                                            {report.flags.abnormalities.length} flags
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
