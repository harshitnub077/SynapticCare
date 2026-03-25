import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, HeartPulse, User } from "lucide-react";

export default function Navbar({ isAuthenticated, userRole, handleLogout }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Doctors", path: "/doctors" },
        { name: "AI Upload", path: "/upload" },
        { name: "Reports", path: "/reports" },
        { name: "AI Chat", path: "/chat" },
    ];

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-b border-slate-200/50 py-3" : "bg-transparent py-5"}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-trust-600 via-trust-500 to-medical-400 flex items-center justify-center shadow-lg shadow-trust-500/20 group-hover:shadow-trust-500/40 group-hover:-translate-y-0.5 transition-all duration-300">
                        <HeartPulse className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-semibold text-xl tracking-tight text-slate-900">
                        Synaptic<span className="text-trust-600">Care</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`text-sm font-semibold transition-colors relative ${isActive ? "text-trust-600" : "text-slate-500 hover:text-slate-900"}`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div 
                                        layoutId="nav-pill"
                                        className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-trust-600 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth CTAs */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-trust-600 transition-colors bg-slate-50 border border-slate-200 pl-2 pr-4 py-1.5 rounded-full hover:bg-trust-50 hover:border-trust-200">
                                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                    <User className="w-4 h-4 text-slate-500" />
                                </span>
                                {userRole === 'doctor' ? 'Provider Portal' : 'Patient Portal'}
                            </Link>
                            <button onClick={handleLogout} className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-medical-primary text-sm py-2.5 px-6 shadow-md shadow-trust-500/20">
                            Sign In / Register
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden text-slate-700 p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden bg-white/95 backdrop-blur-3xl border-b border-slate-200 shadow-2xl overflow-hidden"
                >
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-base font-semibold ${location.pathname === link.path ? "text-trust-600" : "text-slate-600"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-2"></div>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700">Dashboard</Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-base font-semibold text-rose-500 text-left">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-trust-600">Sign In</Link>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
