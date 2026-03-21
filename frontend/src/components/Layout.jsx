import React from 'react';
import SmoothScroll from './animations/SmoothScroll';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ userRole, onLogout }) => {
    return (
        <SmoothScroll>
            <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
                <Navbar isAuthenticated={true} userRole={userRole} handleLogout={onLogout} />
                <main className="flex-1 w-full relative pt-20">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default Layout;
