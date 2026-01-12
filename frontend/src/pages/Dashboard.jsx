import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    FileText,
    AlertCircle,
    Calendar,
    Upload,
    TrendingUp,
    Heart,
    Zap
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-4 rounded-lg border border-[#2a2a2a]">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-400">{entry.name}:</span>
                            <span className="text-white font-semibold">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl flex items-center justify-center gold-glow">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Dashboard</h1>
                            <p className="text-gray-400">Welcome back to your health command center</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card scale-in" style={{ animationDelay: "0.1s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Total Reports</p>
                                <p className="text-4xl font-bold gradient-text">{stats.totalReports}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa]/20 to-[#3b82f6]/20 rounded-xl flex items-center justify-center border border-[#60a5fa]/30">
                                <FileText className="w-8 h-8 text-[#60a5fa]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span>Updated recently</span>
                        </div>
                    </div>

                    <div className="card scale-in" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Abnormal Reports</p>
                                <p className="text-4xl font-bold text-red-400">{stats.abnormalReports}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Activity className="w-4 h-4 text-red-400" />
                            <span>Requires attention</span>
                        </div>
                    </div>

                    <div className="card scale-in" style={{ animationDelay: "0.3s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Health Score</p>
                                <p className="text-4xl font-bold text-green-400">98%</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                                <Heart className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span>Excellent condition</span>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <div className="card fade-in" style={{ animationDelay: "0.4s" }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Hemoglobin Trend</h3>
                                <p className="text-sm text-gray-400">Last 5 months analysis</p>
                            </div>
                            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trendData}>
                                <defs>
                                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                <XAxis dataKey="month" tick={{ fill: '#a3a3a3', fontSize: 12 }} stroke="#2a2a2a" />
                                <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} stroke="#2a2a2a" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="hemoglobin" stroke="#d4af37" strokeWidth={3} fill="url(#goldGradient)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card fade-in" style={{ animationDelay: "0.5s" }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold mb-1">WBC Count</h3>
                                <p className="text-sm text-gray-400">Monthly distribution</p>
                            </div>
                            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-[#60a5fa]" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                <XAxis dataKey="month" tick={{ fill: '#a3a3a3', fontSize: 12 }} stroke="#2a2a2a" />
                                <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} stroke="#2a2a2a" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="wbc" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="card fade-in" style={{ animationDelay: "0.6s" }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-1">Recent Reports</h3>
                            <p className="text-sm text-gray-400">Your latest medical documents</p>
                        </div>
                        <button
                            onClick={() => navigate("/upload")}
                            className="btn btn-primary"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Report
                        </button>
                    </div>

                    {stats.recentReports.length === 0 ? (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No reports yet</p>
                            <button
                                onClick={() => navigate("/upload")}
                                className="btn btn-outline"
                            >
                                Upload Your First Report
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentReports.map((report, index) => (
                                <div
                                    key={report.id}
                                    onClick={() => navigate(`/reports/${report.id}`)}
                                    className="p-5 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#d4af37] rounded-xl cursor-pointer transition-all group"
                                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa]/20 to-[#3b82f6]/20 rounded-lg flex items-center justify-center border border-[#60a5fa]/30">
                                                <FileText className="w-6 h-6 text-[#60a5fa]" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                                                    {report.filename}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(report.uploadedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        {report.flags?.abnormalities?.length > 0 && (
                                            <span className="badge badge-error">Alert</span>
                                        )}
                                    </div>
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
