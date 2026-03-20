import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, MessageSquare, FileText, Calendar, Activity, Star, ShieldCheck } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Patient");

  useEffect(() => {
    // In a real app, fetch from profile API. For now, we'll just show a generic greeting or look for name in localStorage
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medical-800 to-medical-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <Activity className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find the care you need, <br className="hidden sm:block" />
            <span className="text-teal-300">faster and smarter.</span>
          </h1>
          <p className="text-medical-100 text-lg mb-8 max-w-xl">
            Welcome to SynapticCare. Book appointments, get AI-driven insights from your reports, and take charge of your health journey today.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 bg-white text-medical-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Star className="w-5 h-5" /> Find a Specialist
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="px-6 py-3 bg-medical-700 text-white font-semibold rounded-xl border border-medical-500 hover:bg-medical-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" /> Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <button 
            onClick={() => navigate("/upload")}
            className="medical-card group text-left flex flex-col items-start gap-4 hover:border-medical-300"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Upload Report</h3>
              <p className="text-sm text-slate-500">Analyze your scans and labs</p>
            </div>
          </button>

          <button 
            onClick={() => navigate("/reports")}
            className="medical-card group text-left flex flex-col items-start gap-4 hover:border-medical-300"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">My Records</h3>
              <p className="text-sm text-slate-500">View your medical history</p>
            </div>
          </button>

          <button 
            onClick={() => navigate("/appointments")}
            className="medical-card group text-left flex flex-col items-start gap-4 hover:border-medical-300"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Appointments</h3>
              <p className="text-sm text-slate-500">Manage your bookings</p>
            </div>
          </button>

          <button 
            onClick={() => navigate("/dashboard")}
            className="medical-card group text-left flex flex-col items-start gap-4 hover:border-medical-300"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Health Dashboard</h3>
              <p className="text-sm text-slate-500">Track your vital trends</p>
            </div>
          </button>
        </div>
      </div>

      {/* Trust / Security Note */}
      <div className="mt-12 bg-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left border border-slate-200/60">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 mb-1">Bank-Grade Security</h4>
          <p className="text-sm text-slate-600 max-w-2xl">
            Your medical data is encrypted and stored securely. We comply with major health data protection regulations to ensure your privacy is never compromised.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
