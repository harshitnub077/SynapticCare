import React, { useState } from "react";
import api from "../api/axiosConfig";

const LoginSignupForm = ({ onLoginSuccess = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        onLoginSuccess();
      } else {
        const res = await api.post("/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setMessage(res.data.message || "Signup successful. You can now sign in.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-6 py-8">
          <h1 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            SynapticCare – Account
          </h1>

          <div className="flex mb-5 rounded-md bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-1.5 rounded-md ${
                isLogin
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-1.5 rounded-md ${
                !isLogin
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-medical"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="input-medical"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="input-medical"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-xs text-center text-slate-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
