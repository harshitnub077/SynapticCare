import React from 'react';
import SmoothScroll from './animations/SmoothScroll';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = ({ isAuthenticated, userRole, onLogout, children }) => {
    const location = useLocation();
    const hideFooter = location.pathname === '/login';

    return (
        <SmoothScroll>
            <div className="flex flex-col min-h-screen bg-zinc-950 font-sans antialiased text-zinc-200 selection:bg-white/10 selection:text-white">
                <Navbar isAuthenticated={isAuthenticated} userRole={userRole} handleLogout={onLogout} />
                <main className="flex-1 w-full relative pt-20 z-10">
                    {children ? children : <Outlet />}
                </main>
                {!hideFooter && <Footer />}
            </div>
        </SmoothScroll>
    );
};

export default Layout;
