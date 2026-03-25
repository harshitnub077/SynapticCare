import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user?.role || "patient");
      onLoginSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* Left Feature Side */}
      <div className="hidden lg:flex w-1/2 bg-white relative justify-center items-center p-12 border-r border-slate-200/60 z-10">
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-trust-50 rounded-full blur-[100px] -z-10 opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-medical-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

        <div className="z-10 max-w-lg">
          <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-8">
            <HeartPulse className="w-8 h-8 text-trust-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-slate-900 font-display">
            Intelligent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-600 to-medical-500">Care Network</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            Join the most secure ecosystem for connected health. Upload physical tests, instantly consult top doctors, and gain complete control over your biological data.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-white/60 p-5 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-trust-50 flex items-center justify-center text-trust-600 border border-trust-100">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Clinical-Grade Analysis</h3>
                <p className="text-sm text-slate-500 font-medium">AI-powered medical report parsing instantly</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/60 p-5 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-trust-50 flex items-center justify-center text-trust-600 border border-trust-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Zero-Trust Vault</h3>
                <p className="text-sm text-slate-500 font-medium">Military-grade protection for personal records</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 bg-trust-50 rounded-xl flex items-center justify-center border border-trust-100">
                <HeartPulse className="w-6 h-6 text-trust-600" />
            </div>
            <span className="text-xl font-bold text-slate-900 font-display">SynapticCare</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Enter your credentials to access your secure terminal." : "Start your journey to connected healthcare today."}
            </p>
          </div>

          <div className="bg-slate-50 p-1 rounded-2xl flex mb-8 border border-slate-100 shadow-inner">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={"flex-1 py-2.5 text-sm font-bold rounded-xl transition-all " + (isLogin ? "bg-white text-trust-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700")}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={"flex-1 py-2.5 text-sm font-bold rounded-xl transition-all " + (!isLogin ? "bg-white text-trust-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700")}
            >
              Register
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMessage("Google Login Failed.")}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                  <label className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl cursor-pointer transition-all border ${role === 'patient' ? 'bg-white border-trust-200 text-trust-700 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    <input type="radio" name="role" value="patient" checked={role === "patient"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <span className="font-bold text-sm">Patient Node</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl cursor-pointer transition-all border ${role === 'doctor' ? 'bg-white border-trust-200 text-trust-700 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    <input type="radio" name="role" value="doctor" checked={role === "doctor"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                    <span className="font-bold text-sm">Doctor Node</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Entity Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input-medical bg-slate-50"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Identifier (Email)</label>
              <input
                type="email"
                name="email"
                placeholder="node@example.com"
                className="input-medical bg-slate-50"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Passkey</label>
                {isLogin && <a href="#" className="text-xs text-trust-500 hover:text-trust-700 font-bold transition-colors">Forgot passkey?</a>}
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input-medical bg-slate-50"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-medical-primary w-full py-4 mt-8 text-base shadow-lg shadow-trust-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Authenticate" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 py-3 px-4 rounded-xl text-sm font-bold text-center border ${message.includes("successful") || message.includes("success") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
               {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
