import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Search,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Clock,
  LayoutGrid
} from "lucide-react";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const primaryActions = [
    {
      id: "reports",
      title: "Health Dossier",
      subtitle: "Secure Medical Memory",
      desc: "Instant neural analysis of clinical results.",
      icon: FileText,
      link: "/reports",
      size: "col-span-1 md:col-span-2 row-span-2",
      metric: "14 Records",
      status: "Synced"
    },
    {
      id: "doctors",
      title: "Specialists",
      subtitle: "Elite Healthcare Network",
      desc: "Connect with verified medical professionals.",
      icon: Search,
      link: "/doctors",
      size: "col-span-1 row-span-1",
      metric: "52 Online"
    },
    {
      id: "appointments",
      title: "Nexus Schedule",
      subtitle: "Time Coordination",
      desc: "Manage your clinical sessions.",
      icon: Calendar,
      link: "/appointments",
      size: "col-span-1 row-span-1",
      metric: "Next: 14:00"
    },
    {
      id: "ai-intelligence",
      title: "Synaptic AI",
      subtitle: "Neural Intelligence Hub",
      desc: "Chat with our LLM-powered medical assistant for instant insights.",
      icon: MessageSquare,
      link: "/chat",
      size: "col-span-1 md:col-span-3 row-span-1",
      metric: "Active Protocol"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden mesh-gradient">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 blur-3xl pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-300 rounded-full animate-pulse delay-1000" />
      </div>

      <main className="max-w-[1600px] mx-auto px-6 pt-32 pb-12 relative z-10">
        {/* Header Hero Section */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="stagger-in">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 nexus-glass-heavy rounded-full mb-8 border-nexus-accent/20">
              <span className="flex h-2 w-2 rounded-full bg-nexus-accent neural-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-nexus-accent">System v5.0 Master Protocol</span>
            </div>
            <h1 className="text-hero mb-8">
              Neural <br />
              <span className="text-gradient">Nexus.</span>
            </h1>
            <p className="text-xl text-nexus-text-muted max-w-xl font-medium leading-relaxed">
              The next evolution in clinical oversight. Unified health intelligence
              integrated with genomic analysis and predictive diagnostics.
            </p>
            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={() => navigate("/upload")}
                className="btn-nexus group"
              >
                Ingest Data <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="btn-nexus-outline"
              >
                Specialist Network
              </button>
            </div>
          </div>

          {/* Abstract Hero Visualization */}
          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-[3rem] group-hover:bg-blue-200/20 transition-all duration-700" />
            <div className="relative rounded-[3rem] overflow-hidden nexus-glass-heavy border-white/80 shadow-2xl">
              <img
                src="/nexus-hero.png"
                alt="Neural Nexus Hero"
                className="w-full h-[500px] object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nexus-primary/40 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Telemetry Stream</p>
                <p className="text-2xl font-bold tracking-tight">System Integrity: 99.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Command Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 stagger-in">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => navigate(action.link)}
                className={`${action.size} nexus-card flex flex-col justify-between`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-nexus-primary group-hover:text-white transition-all duration-500">
                      <Icon className="w-8 h-8" />
                    </div>
                    {action.metric && (
                      <span className="badge-nexus border-slate-100 bg-white/50 text-nexus-text">
                        {action.metric}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[10px] font-black text-nexus-accent uppercase tracking-[0.2em] mb-3">
                    {action.subtitle}
                  </h4>
                  <h3 className="text-3xl font-bold text-nexus-primary mb-3">
                    {action.title}
                  </h3>
                  <p className="text-nexus-text-muted font-medium text-sm leading-relaxed max-w-[240px]">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-12 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-nexus-accent flex items-center gap-2">
                    Initialize Protocol <ChevronRight className="w-4 h-4" />
                  </span>
                  {action.status && (
                    <span className="text-[9px] font-semibold text-emerald-500 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 neural-pulse" /> {action.status}
                    </span>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors" />
              </div>
            );
          })}
        </div>

        {/* System Telemetry Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-1">
          {[
            { label: "Core Sync", value: "Verified", icon: ShieldCheck, color: "text-blue-500" },
            { label: "Neural Load", value: "Optimal", icon: LayoutGrid, color: "text-purple-500" },
            { label: "Data Pipeline", value: "Active", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Uptime", value: "482d 12h", icon: Clock, color: "text-slate-400" }
          ].map((stat, i) => (
            <div key={i} className="nexus-glass rounded-3xl p-6 flex items-center gap-5 border-white/80 shadow-md">
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${stat.color} shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-nexus-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-md font-bold text-nexus-primary leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Persistent System Version */}
      <div className="fixed bottom-8 right-8 text-[9px] font-bold text-nexus-text-muted/40 uppercase tracking-[0.5em] pointer-events-none select-none">
        Synaptic OS // v5.0.Nexus
      </div>
    </div>
  );
};

export default Home;
