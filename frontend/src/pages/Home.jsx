import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">SynapticCare+</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Your AI Health Assistant
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-slate-500">
              Upload medical reports, get instant summaries, and chat with your personalized health assistant.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all">
                Upload Report
              </button>
              <button className="px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-sm hover:shadow-md transition-all">
                Chat Assistant
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Smart Analysis", desc: "Instant extraction of lab values and flags for abnormalities." },
              { title: "Secure Storage", desc: "Your health data is encrypted and stored safely." },
              { title: "24/7 Assistant", desc: "Ask questions about your reports anytime, anywhere." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white overflow-hidden shadow rounded-lg p-6 border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="text-lg font-medium text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-base text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

