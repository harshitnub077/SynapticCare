import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Stethoscope, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";

const LoginSignupForm = ({ onLoginSuccess = () => { } }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("patient");
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
        localStorage.setItem("userRole", res.data.user?.role || "patient");
        onLoginSuccess();
      } else {
        const res = await api.post("/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Abstract Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-medical-800 to-medical-900 justify-center items-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="z-10 text-white max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <HeartPulse className="w-8 h-8 text-teal-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Next-Generation <br />
            <span className="text-teal-300">Healthcare AI</span>
          </h1>
          <p className="text-medical-100 text-lg mb-10 leading-relaxed opacity-90">
            SynapticCare brings advanced diagnostic tools and seamless doctor-patient communication together in one intelligent platform.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Diagnostics</h3>
                <p className="text-sm text-medical-200">AI-powered medical report analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Private</h3>
                <p className="text-sm text-medical-200">End-to-end encrypted medical records</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 text-medical-700 font-bold text-2xl mb-10 justify-center">
            <HeartPulse className="w-8 h-8 text-medical-600" />
            <span>SynapticCare</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-500">
              {isLogin ? "Please enter your details to sign in." : "Join our modern healthcare platform today."}
            </p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
                  <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all ${role === 'patient' ? 'bg-white border-medical-500 shadow-sm' : 'border-transparent hover:bg-slate-100'}`}>
                    <input type="radio" name="role" value="patient" checked={role === "patient"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <span className="font-semibold text-slate-900">Patient</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all ${role === 'doctor' ? 'bg-white border-medical-500 shadow-sm' : 'border-transparent hover:bg-slate-100'}`}>
                    <input type="radio" name="role" value="doctor" checked={role === "doctor"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <span className="font-semibold text-slate-900">Doctor</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input-medical"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input-medical"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                {isLogin && <a href="#" className="text-xs text-medical-600 hover:text-medical-700 font-medium">Forgot password?</a>}
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input-medical"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-medical-primary w-full py-3 mt-4 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm text-center ${message.includes("successful") ? "status-success" : "status-error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
