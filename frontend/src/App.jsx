import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Chat from "./pages/Chat";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import DoctorDashboard from "./pages/DoctorDashboard";
import TestUpload from "./pages/TestUpload";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(Boolean(token));

      if (token) {
        const storedRole = localStorage.getItem("userRole");
        setUserRole(storedRole);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("userRole"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      {/* Layout wraps all routes so Navbar/Footer is always visible */}
      <Layout isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginSignupForm onLoginSuccess={handleLoginSuccess} />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {userRole === "doctor" ? <DoctorDashboard /> : <Dashboard />}
              </ProtectedRoute>
            } 
          />
          <Route path="/upload" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/test-upload" element={<ProtectedRoute><TestUpload /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;