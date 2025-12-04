import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

import DoctorDashboard from "./pages/DoctorDashboard";

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
        // Decode token to get role or fetch user profile
        // For simplicity, we'll fetch the user profile or store role in localStorage on login
        // Let's assume we store it in localStorage for now to keep it simple
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
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginSignupForm onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {userRole === "doctor" ? (
              <Route path="/" element={<DoctorDashboard onLogout={handleLogout} />} />
            ) : (
              <Route path="/" element={<Home onLogout={handleLogout} />} />
            )}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadReport />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;