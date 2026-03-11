import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { updateUserDoc } from "../../firebase/firestore";

const CAMPUSES = [
  "Karachi - SITE", "Karachi - Korangi", "Karachi - Gulshan",
  "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan",
  "Faisalabad", "Rawalpindi", "Hyderabad", "Other"
];

export default function StudentProfile() {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    campus: "",
    rollNumber: ""
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        campus: userProfile.campus || "",
        rollNumber: userProfile.rollNumber || ""
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      await updateUserDoc(currentUser.uid, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        campus: formData.campus,
        rollNumber: formData.rollNumber.trim()
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [currentUser, formData]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#66b032] to-[#0057a8] rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="opacity-90">Manage your personal information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white text-2xl font-bold">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userProfile?.name || "User"}</h2>
            <p className="text-gray-500">{userProfile?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {userProfile?.role === "admin" ? "Admin" : "Student"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03001234567"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] bg-white"
              >
                <option value="">Select campus</option>
                {CAMPUSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="SMIT-2024-0001"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-[#66b032] hover:bg-[#4a9020] text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="font-bold text-lg text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-900 font-medium">{userProfile?.email || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Role</span>
            <span className="text-gray-900 font-medium capitalize">{userProfile?.role || "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Account Status</span>
            <span className={`font-medium ${userProfile?.isActive ? "text-green-600" : "text-red-600"}`}>
              {userProfile?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-900 font-medium">
              {userProfile?.createdAt?.toDate ? userProfile.createdAt.toDate().toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

