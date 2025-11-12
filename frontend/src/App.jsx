import { useEffect, useState } from "react";
import LoginSignupForm from "./pages/LoginSignupForm";
import Home from "./pages/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <Home onLogout={handleLogout} />
      ) : (
        <LoginSignupForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
export default App;