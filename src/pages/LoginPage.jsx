import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginUser } from "../firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.accountCreated) return;

    toast.success("Account created successfully. Please log in.");
    if (location.state.email) {
      setEmail(location.state.email);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleLogin = useCallback(async () => {
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!password) return toast.error("Please enter your password.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    const result = await loginUser(email.trim(), password);
    setLoading(false);

    if (result.success) {
      const safeRole =
        typeof result.role === "string" ? result.role.trim().toLowerCase() : "";

      if (safeRole === "admin") {
        toast.success("Welcome back!");
        navigate("/admin", { replace: true });
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard", { replace: true });
      }
    } else {
      toast.error(result.error);
    }
  }, [email, password, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const togglePassword = () => setShowPass((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9e8] to-[#e8f3fd] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-black text-sm">
              SMIT
            </div>
            <div className="text-left">
              <div className="font-bold text-[#0057a8] text-sm leading-tight">Saylani Mass</div>
              <div className="font-semibold text-[#66b032] text-xs leading-tight">IT Hub Portal</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your campus portal</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#66b032] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#66b032] text-sm pr-12"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#66b032] hover:bg-[#4a9020] text-white font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          New here?{" "}
          <Link to="/signup" className="text-[#0057a8] font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
