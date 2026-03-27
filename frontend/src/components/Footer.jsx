import React from "react";
import { Link } from "react-router-dom";
import { Activity, Github, Twitter, Linkedin, Mail, Phone, ArrowUpRight, HeartPulse, Shield, Zap } from "lucide-react";

const FOOTER_LINKS = {
    services: [
        { name: "AI Report Analysis", path: "/upload" },
        { name: "Find Specialists", path: "/doctors" },
        { name: "Health Records", path: "/reports" },
        { name: "AI Consultation", path: "/chat" },
        { name: "Dashboard", path: "/dashboard" },
    ],
    company: [
        { name: "About Us", path: "#" },
        { name: "Careers", path: "#" },
        { name: "Blog", path: "#" },
        { name: "Press Kit", path: "#" },
    ],
    legal: [
        { name: "Privacy Policy", path: "#" },
        { name: "Terms of Service", path: "#" },
        { name: "HIPAA Compliance", path: "#" },
        { name: "Cookie Policy", path: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="relative bg-zinc-950 border-t border-zinc-800/60 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 -translate-y-1/2 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-64 -translate-y-1/2 bg-white/3 rounded-full blur-3xl pointer-events-none" />

            {/* ── CTA Banner inside footer ── */}
            <div className="relative z-10 border-b border-zinc-800/60">
                <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Start today — it's free</p>
                        <h2 className="font-display text-3xl font-bold text-white">
                            Your Health. Your Data. Your Choice.
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <Link to="/login" className="btn-primary text-sm px-6 py-3">
                            Get Started Free <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link to="/doctors" className="btn-ghost text-sm px-6 py-3">
                            Find a Doctor
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main Footer Grid ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-all">
                                <Activity className="w-5 h-5 text-zinc-900" />
                            </div>
                            <div>
                                <span className="block font-display font-bold text-xl tracking-tight text-white leading-none">
                                    Synaptic<span className="text-zinc-400">Care</span>
                                </span>
                                <span className="text-xs text-zinc-600 font-medium">AI-Powered Healthcare</span>
                            </div>
                        </Link>

                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-8">
                            India's most advanced AI-powered healthcare ecosystem — connecting patients with world-class doctors and intelligent diagnostic insights.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {[
                                { icon: Shield, label: 'HIPAA' },
                                { icon: HeartPulse, label: 'NABH' },
                                { icon: Zap, label: 'ISO 27001' },
                            ].map(b => (
                                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 font-medium">
                                    <b.icon className="w-3 h-3" /> {b.label}
                                </div>
                            ))}
                        </div>

                        {/* Social */}
                        <div className="flex gap-2">
                            {[
                                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                                { Icon: Github, href: 'https://github.com/harshitnub077', label: 'GitHub' },
                                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                            ].map(({ Icon, href, label }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all group">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        { heading: 'Services', links: FOOTER_LINKS.services },
                        { heading: 'Company', links: FOOTER_LINKS.company },
                        { heading: 'Legal', links: FOOTER_LINKS.legal },
                    ].map(col => (
                        <div key={col.heading}>
                            <h4 className="text-white font-semibold text-sm mb-5">{col.heading}</h4>
                            <ul className="space-y-3">
                                {col.links.map(l => (
                                    <li key={l.name}>
                                        <Link to={l.path} className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                                            {l.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact bar */}
                <div className="mt-12 flex flex-wrap gap-4">
                    <a href="mailto:support@synapticcare.in" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" /> support@synapticcare.in
                    </a>
                    <a href="tel:18001230000" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5" /> 1800-123-CARE (24/7)
                    </a>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-800/60 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">
                        © 2026 SynapticCare Technologies Pvt. Ltd. · All rights reserved.
                    </p>
                    <p className="text-xs text-zinc-700 flex items-center gap-1.5">
                        Made with <HeartPulse className="w-3.5 h-3.5 text-red-600/70" /> for a healthier India
                    </p>
                </div>
            </div>
        </footer>
    );
}
