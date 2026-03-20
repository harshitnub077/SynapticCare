import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  MessageSquare, 
  Users, 
  Calendar, 
  LogOut,
  Stethoscope,
  Menu,
  X,
  Bell
} from 'lucide-react';

const Layout = ({ children, userRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: userRole === 'doctor' ? '/' : '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Upload', path: '/upload', icon: Upload, hideForDoctor: true },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Doctors', path: '/doctors', icon: Users, hideForDoctor: true },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
  ].filter(item => !(userRole === 'doctor' && item.hideForDoctor));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-medical-700 font-bold text-xl">
            <Stethoscope className="w-6 h-6" />
            <span>SynapticCare</span>
          </div>
          <button 
            className="ml-auto lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-medical-50 text-medical-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-medical-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 opacity-70" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
              {menuItems.find(item => location.pathname === item.path || (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path)))?.name || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="h-8 w-8 rounded-full bg-medical-100 flex items-center justify-center text-medical-700 font-bold border border-medical-200">
              {userRole === 'doctor' ? 'Dr' : 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
