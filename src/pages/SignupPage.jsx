 import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { signupUser } from "../firebase/auth";

const CAMPUSES = [
  "Karachi - SITE", "Karachi - Korangi", "Karachi - Gulshan",
  "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan",
  "Faisalabad", "Rawalpindi", "Hyderabad", "Other"
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "student", rollNumber: "", campus: "", phone: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (form.role === "student" && !form.rollNumber.trim()) return "Roll number is required for students.";
    if (!form.campus) return "Please select your campus.";
    return null;
  };

  const handleSignup = async () => {
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    const result = await signupUser({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      rollNumber: form.rollNumber.trim(),
      campus: form.campus,
      phone: form.phone.trim(),
    });
    setLoading(false);

    if (result.success) {
      toast.success("Account created! Welcome to SMIT Hub 🎉");
      
      // Navigate based on role - AuthContext will handle the rest
      // The ProtectedRoute will verify the role matches
      if (form.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9e8] to-[#e8f3fd] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">Join the SMIT Campus Portal</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {["student", "admin"].map(r => (
            <button
              key={r}
              onClick={() => update("role", r)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                form.role === r
                  ? "bg-white text-[#0057a8] shadow"
                  : "text-gray-500"
              }`}
            >
              {r === "student" ? "🎓 Student" : "⚙️ Admin"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { label: "Full Name *", field: "name", placeholder: "Ahmed Khan", type: "text" },
            { label: "Email Address *", field: "email", placeholder: "ahmed@gmail.com", type: "email" },
            { label: "Password * (min 6 chars)", field: "password", placeholder: "••••••••", type: "password" },
            { label: "Confirm Password *", field: "confirmPassword", placeholder: "••••••••", type: "password" },
            { label: "Phone Number", field: "phone", placeholder: "03001234567", type: "tel" },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#66b032] text-sm"
              />
            </div>
          ))}

          {form.role === "student" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Roll Number *</label>
              <input
                type="text"
                value={form.rollNumber}
                onChange={(e) => update("rollNumber", e.target.value)}
                placeholder="SMIT-2024-0001"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#66b032] text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Campus *</label>
            <select
              value={form.campus}
              onChange={(e) => update("campus", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#66b032] text-sm bg-white"
            >
              <option value="">Select your campus</option>
              {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-xl bg-[#66b032] hover:bg-[#4a9020] text-white font-bold text-base transition-all disabled:opacity-60 shadow-lg"
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0057a8] font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

