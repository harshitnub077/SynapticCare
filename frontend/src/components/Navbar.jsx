import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Activity } from "lucide-react";

export default function Navbar({ isAuthenticated, userRole, handleLogout }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 24);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Find Doctors", path: "/doctors" },
        { name: "Upload Report", path: "/upload" },
        { name: "My Reports", path: "/reports" },
        { name: "AI Assistant", path: "/chat" },
    ];

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 py-3 shadow-xl shadow-black/50"
                    : "bg-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* ── Logo ── */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    {/* Logo mark */}
                    <div className="relative w-8 h-8">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-all">
                            <Activity className="w-4 h-4 text-zinc-900" />
                        </div>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-white">
                        Synaptic<span className="text-zinc-400">Care</span>
                    </span>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "text-white bg-white/10"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.span layoutId="navPill"
                                        className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Auth CTA ── */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-sm font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white pl-2.5 pr-4 py-2 rounded-full transition-all"
                            >
                                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <User className="w-3 h-3 text-zinc-300" />
                                </span>
                                {userRole === "doctor" ? "Provider Portal" : "My Dashboard"}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-950/30"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/login"
                            className="px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-all shadow-lg shadow-white/10 hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            Sign In / Register
                        </Link>
                    )}
                </div>

                {/* ── Mobile Toggle ── */}
                <button
                    className="md:hidden text-zinc-400 p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 overflow-hidden"
                    >
                        <div className="px-6 py-5 flex flex-col gap-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                        location.pathname === link.path
                                            ? "text-white bg-white/10"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-zinc-800 my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-zinc-300">Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 text-left">Sign Out</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-white text-zinc-900 rounded-xl text-sm font-semibold text-center mt-1">Sign In / Register</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
