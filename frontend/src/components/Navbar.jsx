import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
    Heart,
    LayoutDashboard,
    FileText,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Users,
    Calendar
} from "lucide-react";

const Navbar = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => setIsOpen(false), [location]);

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Doctors", path: "/doctors", icon: Users },
        { name: "Appointments", path: "/appointments", icon: Calendar },
        { name: "Reports", path: "/reports", icon: FileText },
        { name: "Chat", path: "/chat", icon: MessageSquare },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg" : "bg-transparent"
            }`}>
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <Heart className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            SynapticCare
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black"
                                            : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Desktop Logout */}
                    <button
                        onClick={onLogout}
                        className="hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-[#2a2a2a] fade-in">
                    <div className="container mx-auto py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black"
                                            : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
