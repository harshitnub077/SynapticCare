import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-white/10 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-trust-500/10 border border-trust-500/20 flex items-center justify-center">
                                <HeartPulse className="w-4 h-4 text-trust-400" />
                            </div>
                            <span className="font-display font-semibold text-xl tracking-tight text-white">
                                Synaptic Care
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                            India's elite AI-powered healthcare terminal. Providing ultra-premium intelligence and seamless network access.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/upload" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Neural Analysis</Link></li>
                            <li><Link to="/doctors" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Provider Directory</Link></li>
                            <li><Link to="/reports" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Encrypted Vault</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Infrastructure</h4>
                        <ul className="space-y-3">
                            <li><span className="text-sm text-slate-500">AIIMS Servers</span></li>
                            <li><span className="text-sm text-slate-500">Apollo Grid</span></li>
                            <li><span className="text-sm text-slate-500">Fortis Network</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-trust-400 transition-colors">Zero-Trust Notice</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                    <p>&copy; 2026 Synaptic Care Systems. Standard Operating Procedures.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">Compiled in <HeartPulse className="w-3 h-3 text-trust-500" /> secure facility</p>
                </div>
            </div>
        </footer>
    );
}
