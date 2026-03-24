import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, Search, FileText, Users, Bell, User, 
  LogOut, Menu, X 
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";
import toast from "react-hot-toast";

const navItems = [
  { name: "Overview", icon: Home, path: "/dashboard" },
  { name: "Lost & Found", icon: Search, path: "/dashboard/lost-found" },
  { name: "Complaints", icon: FileText, path: "/dashboard/complaints" },
  { name: "Volunteer", icon: Users, path: "/dashboard/volunteer" },
  { name: "Notifications", icon: Bell, path: "/dashboard/notifications", badge: true },
  { name: "Profile", icon: User, path: "/dashboard/profile" },
];

export default function Sidebar({ unreadCount = 0 }) {
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
    return "U";
  };

  // Get user name safely
  const getUserName = () => {
    if (userProfile?.name) {
      return userProfile.name;
    }
    return "Student";
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
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-bold text-lg">
                {loading ? "..." : getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {loading ? "Loading..." : getUserName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {loading ? "..." : getUserEmail()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#66b032] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
                {item.badge && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

