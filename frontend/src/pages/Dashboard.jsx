import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    FileText,
    AlertCircle,
    Calendar,
    Upload,
    TrendingUp
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
    ResponsiveContainer
} from "recharts";
import api from "../api/axiosConfig";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        abnormalReports: 0,
        recentReports: [],
    });
    const [trendData] = useState([
        { month: "Jan", hemoglobin: 13.5, wbc: 7000 },
        { month: "Feb", hemoglobin: 13.2, wbc: 7200 },
        { month: "Mar", hemoglobin: 13.8, wbc: 6800 },
        { month: "Apr", hemoglobin: 14.1, wbc: 7100 },
        { month: "May", hemoglobin: 13.9, wbc: 7300 },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const reportsResponse = await api.get("/reports?limit=5");
            const data = reportsResponse.data;
            const reports = (data.reports && Array.isArray(data.reports)) ? data.reports : [];
            const abnormal = reports.filter(r => (r.flags?.abnormalities?.length || 0) > 0);

            setStats({
                totalReports: data.pagination?.total || 0,
                abnormalReports: abnormal.length,
                recentReports: reports,
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your health overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Abnormal Reports</p>
                                <p className="text-3xl font-bold text-red-600">{stats.abnormalReports}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Health Score</p>
                                <p className="text-3xl font-bold text-green-600">98%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Hemoglobin Trend</h3>
                                <p className="text-sm text-gray-600">Last 5 months</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="hemoglobin" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">WBC Count</h3>
                                <p className="text-sm text-gray-600">Last 5 months</p>
                            </div>
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="wbc" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                        <button
                            onClick={() => navigate("/upload")}
                            className="btn btn-primary"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Report
                        </button>
                    </div>

                    {stats.recentReports.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No reports yet. Upload your first report to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentReports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => navigate(`/reports/${report.id}`)}
                                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{report.filename}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(report.uploadedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {report.flags?.abnormalities?.length > 0 && (
                                        <span className="badge badge-error">Alert</span>
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
