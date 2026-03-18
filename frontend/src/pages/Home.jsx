import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <span className="text-xl font-semibold text-slate-900">
                SynapticCare
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
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Medical Report Management
            </h1>
            <p className="max-w-2xl mx-auto text-slate-600">
              Upload and manage your medical reports
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
              <button
                onClick={() => navigate("/doctors")}
                className="btn-medical-primary w-full"
              >
                Find a Doctor
              </button>
              <button
                onClick={() => navigate("/appointments")}
                className="btn-medical-secondary w-full"
              >
                My Appointments
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="btn-medical-secondary w-full md:col-span-2"
              >
                Chat with AI Assistant
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div
              onClick={() => navigate("/upload")}
              className="bg-white border border-slate-200 rounded-lg p-6 cursor-pointer hover:border-blue-300"
            >
              <h3 className="font-medium text-slate-900 mb-2">Upload Reports</h3>
              <p className="text-sm text-slate-600">
                Upload your medical reports for analysis
              </p>
            </div>

            <div
              onClick={() => navigate("/chat")}
              className="bg-white border border-slate-200 rounded-lg p-6 cursor-pointer hover:border-blue-300"
            >
              <h3 className="font-medium text-slate-900 mb-2">Chat</h3>
              <p className="text-sm text-slate-600">
                Ask questions about your reports
              </p>
            </div>

            <div
              onClick={() => navigate("/reports")}
              className="bg-white border border-slate-200 rounded-lg p-6 cursor-pointer hover:border-blue-300"
            >
              <h3 className="font-medium text-slate-900 mb-2">View Reports</h3>
              <p className="text-sm text-slate-600">
                Access your report history
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
