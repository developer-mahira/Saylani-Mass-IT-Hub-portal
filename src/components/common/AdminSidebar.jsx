import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, FileText, Search, Users, UserCog, Bell, 
  LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";
import toast from "react-hot-toast";

const navItems = [
  { name: "Overview", icon: Home, path: "/admin" },
  { name: "Complaints", icon: FileText, path: "/admin/complaints" },
  { name: "Lost & Found", icon: Search, path: "/admin/lost-found" },
  { name: "Volunteers", icon: Users, path: "/admin/volunteers" },
  { name: "Users", icon: UserCog, path: "/admin/users" },
  { name: "Announcements", icon: Bell, path: "/admin/announcements" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast.success("Logged out successfully!");
      navigate("/login");
    } else {
      toast.error(result.error);
    }
  };

  // Get user initials safely
  const getUserInitials = () => {
    if (userProfile?.name) {
      return userProfile.name.charAt(0).toUpperCase();
    }
    return "A";
  };

  // Get user name safely
  const getUserName = () => {
    if (userProfile?.name) {
      return userProfile.name;
    }
    return "Admin";
  };

  // Get user email safely
  const getUserEmail = () => {
    if (userProfile?.email) {
      return userProfile.email;
    }
    return "";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside
        initial={false}
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0057a8] to-[#003d73] text-white z-40 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {loading ? "..." : getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {loading ? "Loading..." : getUserName()}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {loading ? "..." : getUserEmail()}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

