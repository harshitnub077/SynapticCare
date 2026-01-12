import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Mail, Lock, User, UserCircle, Stethoscope, Heart, Shield, Sparkles } from "lucide-react";

const LoginSignupForm = ({ onLoginSuccess = () => { } }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await api.post(endpoint, { ...formData, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d4af37] to-transparent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#60a5fa] to-transparent opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 fade-in">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl flex items-center justify-center gold-glow">
              <Heart className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">SynapticCare</span>
            </h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Premium Healthcare<br />
                <span className="gradient-text">At Your Fingertips</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Experience world-class medical care with our advanced platform.
                Connect with top specialists, manage your health records, and take control of your wellness journey.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Shield, text: "Bank-level Security & Privacy" },
                { icon: Sparkles, text: "AI-Powered Health Insights" },
                { icon: Heart, text: "24/7 Medical Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          <p>© 2026 SynapticCare. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0a0a]">
        <div className="w-full max-w-md scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">SynapticCare</h1>
          </div>

          <div className="card">
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Join SynapticCare"}
              </h3>
              <p className="text-gray-400">
                {isLogin ? "Sign in to access your account" : "Create your account to get started"}
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-4">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${role === "patient"
                      ? "border-[#d4af37] bg-[#d4af37]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                    }`}
                >
                  <UserCircle className={`w-8 h-8 ${role === "patient" ? "text-[#d4af37]" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${role === "patient" ? "text-[#d4af37]" : "text-gray-400"}`}>
                    Patient
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${role === "doctor"
                      ? "border-[#d4af37] bg-[#d4af37]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                    }`}
                >
                  <Stethoscope className={`w-8 h-8 ${role === "doctor" ? "text-[#d4af37]" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${role === "doctor" ? "text-[#d4af37]" : "text-gray-400"}`}>
                    Doctor
                  </span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="input pl-12"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="input pl-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#d4af37] font-semibold hover:text-[#f4d03f] transition-colors"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
