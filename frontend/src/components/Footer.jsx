import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-trust-600 flex items-center justify-center">
                                <HeartPulse className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-display font-semibold text-xl tracking-tight text-slate-900">
                                Synaptic Care
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                            India's leading AI-powered healthcare platform. Providing ultra-premium diagnostic analysis and seamless specialist appointments.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-trust-600 hover:bg-trust-50 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-trust-600 hover:bg-trust-50 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-trust-600 hover:bg-trust-50 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/upload" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">AI Analysis</Link></li>
                            <li><Link to="/doctors" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">Find a Doctor</Link></li>
                            <li><Link to="/reports" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">Medical Records</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Institutions</h4>
                        <ul className="space-y-3">
                            <li><span className="text-sm text-slate-600">AIIMS New Delhi</span></li>
                            <li><span className="text-sm text-slate-600">Apollo Hospitals</span></li>
                            <li><span className="text-sm text-slate-600">Fortis Healthcare</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-trust-600 transition-colors">Medical Disclaimer</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                    <p>&copy; 2026 Synaptic Care. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">Built with <HeartPulse className="w-3 h-3 text-rose-500" /> in India</p>
                </div>
            </div>
        </footer>
    );
}
