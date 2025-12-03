import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Upload, MessageSquare, FileText, TrendingUp, Shield } from "lucide-react";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-medical">
      {/* Navbar */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SynapticCare+
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/reports")}
                className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Reports
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                AI Chat
              </button>
              <button
                onClick={onLogout}
                className="text-slate-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                AI-Powered Health Assistant
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
              Your Personal
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Health Companion
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
              Upload medical reports, get instant AI-powered analysis, and chat with your intelligent health assistant for personalized insights.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => navigate("/upload")}
                className="btn-medical-primary flex items-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Report</span>
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="btn-medical-secondary flex items-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat with AI</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div
              onClick={() => navigate("/upload")}
              className="medical-card cursor-pointer group"
            >
              <div className="medical-icon mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Upload</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload PDF or image reports and get instant text extraction with AI-powered analysis
              </p>
            </div>

            <div
              onClick={() => navigate("/chat")}
              className="medical-card cursor-pointer group"
            >
              <div className="medical-icon mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Assistant</h3>
              <p className="text-slate-600 leading-relaxed">
                Chat with AI about your health reports and get personalized medical insights
              </p>
            </div>

            <div
              onClick={() => navigate("/reports")}
              className="medical-card cursor-pointer group"
            >
              <div className="medical-icon mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Report History</h3>
              <p className="text-slate-600 leading-relaxed">
                Access all your medical reports with flagged abnormalities and trends
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl">
              <Shield className="h-10 w-10 text-blue-600" />
              <div>
                <h4 className="font-bold text-slate-900">Secure & Private</h4>
                <p className="text-sm text-slate-600">Your data is encrypted</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl">
              <TrendingUp className="h-10 w-10 text-green-600" />
              <div>
                <h4 className="font-bold text-slate-900">AI-Powered</h4>
                <p className="text-sm text-slate-600">Advanced health insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl">
              <Activity className="h-10 w-10 text-cyan-600" />
              <div>
                <h4 className="font-bold text-slate-900">24/7 Available</h4>
                <p className="text-sm text-slate-600">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
